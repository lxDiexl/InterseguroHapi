import { Request, ResponseToolkit } from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import { getContext } from '../middleware/context';
import { getLogger } from '../utils/logger';
import { MatrixService } from '../services/matrix.service';
import { MatrixRequestEntity } from '../entities/matrix-request.entity';

const matrixService = new MatrixService();

/**
 * Controlador para analizar matrices
 * @param request - Request de Hapi
 * @param h - Response toolkit
 * @returns Respuesta con estadísticas de matrices
 */
export const analyzeMatrixController = async (
  request: Request,
  h: ResponseToolkit
) => {
  const ctx = getContext(request);
  getLogger(ctx).info('Recibida petición de análisis de matrices');

  try {
    const payload = request.payload as any;
    const matrixRequest = new MatrixRequestEntity(payload);

    const result = await matrixService.analyzeMatrices(ctx, matrixRequest);

    getLogger(ctx).info('Análisis completado exitosamente');
    return h.response(result).code(200);
  } catch (error: any) {
    getLogger(ctx).error('Error en análisis de matrices', {
      error: error.message,
      stack: error.stack
    });

    if (error.message.includes('debe')) {
      return Boom.badRequest(error.message);
    }

    return Boom.internal('Error interno al procesar la matriz');
  }
};

/**
 * Controlador de health check
 * @param request - Request de Hapi
 * @param h - Response toolkit
 * @returns Estado del servicio
 */
export const healthCheckController = async (
  request: Request,
  h: ResponseToolkit
) => {
  const ctx = getContext(request);
  getLogger(ctx).debug('Health check ejecutado');

  return h.response({
    status: 'OK',
    service: 'interseguro-matrix-api',
    timestamp: new Date().toISOString()
  }).code(200);
};
