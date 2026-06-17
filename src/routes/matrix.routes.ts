import { Server } from '@hapi/hapi';
import * as Joi from 'joi';
import * as Boom from '@hapi/boom';
import { Request, ResponseToolkit } from '@hapi/hapi';
import { getContext } from '../middleware/context';
import { getLogger } from '../utils/logger';
import {
  analyzeMatrixController,
  healthCheckController
} from '../controllers/matrix.controller';

const matrixSchema = Joi.array()
  .items(Joi.array().items(Joi.number().required()))
  .min(1)
  .required();

const analyzeRequestSchema = Joi.object({
  rotated: matrixSchema.required(),
  Q: matrixSchema.required(),
  R: matrixSchema.required()
});

const validationFailAction = (
  request: Request,
  h: ResponseToolkit,
  err: any
) => {
  const ctx = getContext(request);
  getLogger(ctx).warn('Validación fallida', {
    errors: err?.details || []
  });
  return Boom.badRequest('Datos de entrada inválidos');
};

/**
 * Registra las rutas de la API
 * @param server - Servidor Hapi
 */
export const matrixRoutes = (server: Server): void => {
  server.route({
    method: 'POST',
    path: '/api/analyze',
    options: {
      description: 'Analizar matrices Q y R',
      notes: 'Recibe matrices Q y R, calcula estadísticas y verifica si son diagonales',
      tags: ['api', 'matrix'],
      validate: {
        payload: analyzeRequestSchema,
        failAction: validationFailAction
      }
    },
    handler: analyzeMatrixController
  });

  server.route({
    method: 'GET',
    path: '/api/health',
    options: {
      description: 'Health check del servicio',
      notes: 'Verifica que el servicio esté funcionando correctamente',
      tags: ['api', 'health']
    },
    handler: healthCheckController
  });
};
