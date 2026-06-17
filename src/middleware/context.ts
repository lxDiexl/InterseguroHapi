import { Request, ResponseToolkit, Plugin } from '@hapi/hapi';
import { v4 as uuidv4 } from 'uuid';
import { APPLICATION_ID } from '../utils/environment';

export interface Context {
  applicationId: string;
  transactionId: string;
}

export interface ContextRequestApplicationState {
  context: Context;
}

/**
 * Middleware para crear contexto de trazabilidad en cada request
 */
export const contextPlugin: Plugin<void> = {
  name: 'context-plugin',
  version: '1.0.0',
  register: async (server) => {
    server.ext('onRequest', (request: Request, h: ResponseToolkit) => {
      const transactionId = uuidv4();
      const context: Context = {
        applicationId: APPLICATION_ID,
        transactionId
      };

      (request.app as ContextRequestApplicationState).context = context;

      return h.continue;
    });
  }
};

/**
 * Extrae el contexto de un request
 * @param request - Request de Hapi
 * @returns Contexto de la aplicación
 */
export const getContext = (request: Request): Context => {
  return (request.app as ContextRequestApplicationState).context;
};
