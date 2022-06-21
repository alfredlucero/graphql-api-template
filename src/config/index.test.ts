describe('AppConfig', () => {
  const oldProcessEnv = process.env;

  beforeEach(() => {
    // This is needed to clear the cache for the config module import
    jest.resetModules();
    process.env = { ...oldProcessEnv };
  });

  afterAll(() => {
    // Restore old environment variables after we're finished
    process.env = oldProcessEnv;
  });

  test('should map process.env variables in config', () => {
    process.env.NODE_ENV = 'production';
    process.env.SERVER_PORT = '8081';
    process.env.SERVER_NAME = 'graphqlapi-prod';
    process.env.SERVER_LOG_LEVEL = 'debug';
    process.env.SERVER_DEPLOYED_ENV = 'production';
    process.env.DB_HOST = 'somehost';
    process.env.DB_USER = 'someuser';
    process.env.DB_PASSWORD = 'somepassword';
    process.env.DB_PORT = '3307';
    process.env.DB_NAME = 'somename';
    process.env.OKTA_DISABLED = 'true';
    process.env.OKTA_ISSUER = 'someissuer';
    process.env.OKTA_AUDIENCE = 'someaudience';
    process.env.OKTA_CLIENT_ID = 'someclientid';

    const AppConfig = require('./').default;

    expect(AppConfig).toEqual({
      server: {
        port: 8081,
        nodeEnv: 'production',
        name: 'graphqlapi-prod',
        logLevel: 'debug',
        deployedEnv: 'production',
      },
      database: {
        host: 'somehost',
        user: 'someuser',
        password: 'somepassword',
        port: 3307,
        name: 'somename',
      },
      okta: {
        disabled: true,
        issuer: 'someissuer',
        audience: 'someaudience',
        clientId: 'someclientid',
      },
    });
  });
});
