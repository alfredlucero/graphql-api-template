export interface Config {
  server: {
    name: string;
    nodeEnv: string;
    port: number;
    logLevel: string;
    deployedEnv: string;
  };
  database: {
    host: string;
    user: string;
    password: string;
    port: number;
    name: string;
  };
  okta: {
    disabled: boolean;
    issuer: string;
    clientId: string;
    audience: string;
  };
}

// Make sure to update the .env.template if you're setting any new process.env variables
const {
  NODE_ENV = '',
  SERVER_NAME = '',
  SERVER_PORT = '',
  SERVER_LOG_LEVEL = '',
  SERVER_DEPLOYED_ENV = '',
  DB_HOST = '',
  DB_USER = '',
  DB_PASSWORD = '',
  DB_PORT = '',
  DB_NAME = '',
  OKTA_DISABLED = '',
  OKTA_ISSUER = '',
  OKTA_AUDIENCE = '',
  OKTA_CLIENT_ID = '',
} = process.env;

const AppConfig: Config = {
  server: {
    port: SERVER_PORT !== '' ? parseInt(SERVER_PORT, 10) : 8080,
    nodeEnv: NODE_ENV !== '' ? NODE_ENV : 'development',
    name: SERVER_NAME !== '' ? SERVER_NAME : 'graphqlapi',
    logLevel: SERVER_LOG_LEVEL !== '' ? SERVER_LOG_LEVEL : 'info',
    deployedEnv: SERVER_DEPLOYED_ENV !== '' ? SERVER_DEPLOYED_ENV : 'localhost',
  },
  database: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT !== '' ? parseInt(DB_PORT, 10) : 3306,
    name: DB_NAME,
  },
  okta: {
    disabled: OKTA_DISABLED === 'true',
    issuer: OKTA_ISSUER,
    clientId: OKTA_CLIENT_ID,
    audience: OKTA_AUDIENCE,
  },
};

export default AppConfig;
