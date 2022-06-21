import { createGraphQLApp, GraphQLApp } from './app';
import loggerDefault, { GraphQLAPILogger } from './logger';

export interface GraphQLAPIServerStart {
  serverPort: number;
  logger?: GraphQLAPILogger;
  graphqlApp?: GraphQLApp;
}

export const startGraphQLAPIServer = async ({
  serverPort,
  logger = loggerDefault,
  graphqlApp = createGraphQLApp({}),
}: GraphQLAPIServerStart) => {
  try {
    logger.log('info', `Starting up server on port ${serverPort}.`);

    await graphqlApp.start(serverPort);

    logger.log('info', `Server started on port ${serverPort}.`);

    // Can start up other things here as well!
  } catch (err) {
    logger.log('fatal', `Failed to start server on port ${serverPort}.`, {
      error: err,
    });
  }
};
