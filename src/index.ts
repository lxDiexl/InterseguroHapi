import * as Hapi from '@hapi/hapi';
import * as dotenv from 'dotenv';
import { PORT, NODE_ENV } from './utils/environment';
import { contextPlugin } from './middleware/context';
import { errorHandlerPlugin } from './middleware/error-handler';
import { matrixRoutes } from './routes/matrix.routes';
import logger from './utils/logger';

dotenv.config();

const init = async (): Promise<void> => {
  const server = Hapi.server({
    port: PORT,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
        credentials: true
      }
    }
  });

  try {
    await server.register([contextPlugin, errorHandlerPlugin]);

    matrixRoutes(server);

    await server.start();
    console.log(`✅ Servidor ejecutándose en: ${server.info.uri}`);
    console.log(`📊 Entorno: ${NODE_ENV}`);
    logger.info('Servidor iniciado correctamente', {
      port: PORT,
      environment: NODE_ENV
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    logger.error('Error al iniciar servidor', { error });
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled rejection:', err);
  logger.error('Unhandled rejection', { error: err });
  process.exit(1);
});

init();
