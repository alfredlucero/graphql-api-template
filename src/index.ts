// Only load up environment variables from .env file in development mode
// Otherwise, when deployed and running in Kube/Docker, we will get the environment variables for process.env.* from wherever it's running
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
  // Uncomment below to see config values
  console.info('AppConfig: ');
  console.dir(require('./config').default);
}
import AppConfig from './config';
import loggerDefault from './logger';
import { startGraphQLAPIServer } from './server';
import { createGraphQLApp } from './app';

const SERVER_PORT = AppConfig.server.port;
startGraphQLAPIServer({
  serverPort: SERVER_PORT,
  logger: loggerDefault,
  graphqlApp: createGraphQLApp({}),
});

process.on('uncaughtException', (err) => {
  loggerDefault.log('fatal', 'Uncaught exception.', {
    error: err,
  });
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  loggerDefault.log('fatal', 'Unhandled rejection.', {
    error: err,
  });
  process.exit(1);
});
