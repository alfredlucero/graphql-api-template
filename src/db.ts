import knex from 'knex';
import AppConfig from './config';
import loggerDefault from './logger';

const db = knex({
  client: 'mysql2',
  connection: {
    host: AppConfig.database.host,
    user: AppConfig.database.user,
    password: AppConfig.database.password,
    database: AppConfig.database.name,
    port: AppConfig.database.port,
  },
  pool: { min: 2, max: 10 },
  debug: AppConfig.server.nodeEnv === 'development',
  log: {
    warn(message) {
      loggerDefault.log('warn', 'Database Warn Message', message);
    },
    error(message) {
      loggerDefault.log('error', 'Database Error Message', message);
    },
    deprecate(message) {
      loggerDefault.log('debug', `Database Deprecate Message ${message}`);
    },
    debug(message) {
      loggerDefault.log('debug', 'Database Debug Message', message);
    },
  },
});

export default db;
