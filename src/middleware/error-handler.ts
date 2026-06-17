import { Request, ResponseToolkit, Plugin } from '@hapi/hapi';
import { getContext } from './context';
import { getLogger } from '../utils/logger';

/**
 * Middleware para manejo centralizado de errores
 */
export const errorHandlerPlugin: Plugin<void> = {
  name: 'error-handler-plugin',
  version: '1.0.0',
  register: async (server) => {
    server.ext('onPreResponse', (request: Request, h: ResponseToolkit) => {
      const response = request.response;

      if (!('isBoom' in response) || !response.isBoom) {
        return h.continue;
      }

      const ctx = getContext(request);
      const error = response as any;

      getLogger(ctx).error('API Error', {
        message: error.message,
        statusCode: error.output.statusCode,
        url: request.url.pathname,
        method: request.method
      });

      const statusCode = error.output.statusCode;

      if (statusCode >= 400 && statusCode < 500) {
        return h
          .response({
            error: error.message,
            transactionId: ctx?.transactionId
          })
          .code(statusCode);
      } else {
        return h
          .response({
            error: 'Error interno del servidor',
            transactionId: ctx?.transactionId
          })
          .code(500);
      }
    });
  }
};
