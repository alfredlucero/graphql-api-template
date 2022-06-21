import express, { Application } from 'express';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import { altairExpress } from 'altair-express-middleware';
import { schema } from './schema';
import HealthcheckRouter from './healthcheck';
import { createContext } from './context';
import { AuthRequest } from './auth';
import { authDisabled } from './auth/authOkta';
import loggerDefault, { GraphQLAPILogger } from './logger';
import { createAuthMiddleware } from './auth';
import { verifyAuthTokenOkta } from './auth/authOkta';
import { createExamplesService, ExamplesService } from './graphql/Examples/examples.service';

export interface GraphQLApp {
  app: Application;
  start: (serverPort: number) => Promise<void>;
}

export interface GraphQLAppDependencies {
  logger?: GraphQLAPILogger;
  services?: Partial<GraphQLAPIServices>;
}

/** Add more service types here for us to dependency inject so we can test from the highest level. These will also be part of the context object shared across resolvers. */
export interface GraphQLAPIServices {
  examplesService: ExamplesService;
}

const initializeAppMiddlewares = (app: Application) => {
  // Sets Access-Control-Allow-Origin header to *
  app.use(
    cors({
      exposedHeaders: '*',
      allowedHeaders: '*',
    })
  );

  // Support JSON data
  app.use(express.json());

  // Support application/x-www-form-urlencoded post data
  app.use(express.urlencoded({ extended: false }));
};

const initializeAppRoutes = ({ app, services, logger }: GraphQLAppRoutesDependencies) => {
  // All the GraphQL things
  app.use(
    '/graphql',
    createAuthMiddleware({
      verifyAuthToken: verifyAuthTokenOkta,
      logger,
      authDisabled,
    }),
    graphqlHTTP((req: AuthRequest) => {
      return {
        schema,
        context: createContext({ req, services }),
      };
    })
  );

  if (process.env.NODE_ENV !== 'production') {
    app.use(
      '/altair',
      altairExpress({
        endpointURL: '/graphql',
        preserveState: true,
      })
    );
  }

  app.use('/healthcheck', HealthcheckRouter);
};

interface GraphQLAppRoutesDependencies {
  app: Application;
  services: GraphQLAPIServices;
  logger: GraphQLAPILogger;
}

export const createGraphQLApp = ({ logger = loggerDefault, services = {} }: GraphQLAppDependencies): GraphQLApp => {
  const app = express();

  const graphqlApiServices: GraphQLAPIServices = {
    // Add more service defaults here that we can potentially override when testing
    examplesService: createExamplesService({ logger }),

    // Override any default services (real implementations) with any services we dependency inject
    ...services,
  };

  initializeAppMiddlewares(app);

  initializeAppRoutes({ app, services: graphqlApiServices, logger });

  return {
    app,
    start: async (serverPort: number) => {
      await app.listen(serverPort);
    },
  };
};
