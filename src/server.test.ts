import { Application } from 'express';
import { startGraphQLAPIServer } from './server';
import { GraphQLAPILogger } from './logger';
import { GraphQLApp } from './app';

describe('GraphQLAPIServer', () => {
  const serverPort = 8080;

  test('should start up server successfully and log info', async () => {
    const logger: GraphQLAPILogger = {
      log: jest.fn(),
    };
    const graphqlApp: GraphQLApp = {
      app: {} as Application,
      start: jest.fn(),
    };
    await startGraphQLAPIServer({
      serverPort,
      logger,
      graphqlApp,
    });

    expect(logger.log).toHaveBeenCalledWith('info', `Starting up server on port ${serverPort}.`);
    expect(graphqlApp.start).toHaveBeenCalled();
    expect(logger.log).toHaveBeenLastCalledWith('info', `Server started on port ${serverPort}.`);
  });

  test('should fail to start up server and log fatal', async () => {
    const logger: GraphQLAPILogger = {
      log: jest.fn(),
    };
    const someError = new Error('Address in use');
    const graphqlApp: GraphQLApp = {
      app: {} as Application,
      start: jest.fn().mockImplementationOnce(() => {
        throw new Error('Address in use');
      }),
    };
    await startGraphQLAPIServer({
      serverPort,
      logger,
      graphqlApp,
    });

    expect(logger.log).toHaveBeenCalledWith('info', `Starting up server on port ${serverPort}.`);
    expect(graphqlApp.start).toHaveBeenCalled();
    expect(logger.log).toHaveBeenLastCalledWith('fatal', `Failed to start server on port ${serverPort}.`, {
      error: someError,
    });
  });
});
