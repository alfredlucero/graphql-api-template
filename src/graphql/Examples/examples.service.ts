import { NexusGenObjects } from '../../../nexus-typegen';
import loggerDefault, { GraphQLAPILogger } from '../../logger';
import { examplesRepoDefault, ExamplesRepo, ExampleDb } from './examples.repo';
import { ContextServiceInfo } from '../../context';

/*
  The service layer holds all the business logic where we will use the repo data access layer objects passed in
  to accomplish what we need to do with the data

  At this layer we can validate inputs, adapt data, throw errors, log things, and return data matching up with the schema in index.ts

  Make sure to add the service interface and default service to the context shared by all GraphQL resolvers which holds our instantiated services
  Edit the app.ts "GraphQLAPIServices" interface and see how we're dependency injecting services into our app
*/

// We will code against the service interface at the resolver level and later on we can even dependency inject the service for the highest level integration tests
export interface ExamplesService {
  // We return back data that aligns with the schema defined in index.ts for this query
  // We also take in arguments like the query/mutation inputs if available and the context info that contains scopes and user information
  getExamples: (contextInfo: ContextServiceInfo) => Promise<NexusGenObjects['Example'][]>;
}

interface ExamplesServiceDependencies {
  logger?: GraphQLAPILogger;
  examplesRepo?: ExamplesRepo;
}

const adaptExamplesDb = (examplesDb: ExampleDb[]): NexusGenObjects['Example'][] => {
  return examplesDb.map((exampleDb) => {
    return {
      id: exampleDb.id,
      message: exampleDb.message,
    };
  });
};

// We have factory functions to create this service and dependency things such as a logger and repo
// The defaults will always be the real implementations of the logger and repos
export const createExamplesService = ({
  logger = loggerDefault,
  examplesRepo = examplesRepoDefault,
}: ExamplesServiceDependencies): ExamplesService => {
  return {
    getExamples: async (contextInfo: ContextServiceInfo) => {
      try {
        // Validate scopes and return some sort of error union result such as "ACCESS_FORBIDDEN"...

        // Validate inputs and return some sort of error union result such as "BAD_REQUEST"...

        // Use repo to fetch the examples, update things, etc.
        const examplesDb = await examplesRepo.getExamples();

        // Adapt data if needed...
        const adaptedExamples = adaptExamplesDb(examplesDb);

        // We often like to log out information related to success/error and the userId that prompted the query
        // We can also add more debug type logs that won't be outputted in production/staging since we will set a minimum log level
        logger.log('info', 'Successfully retrieved examples.', {
          userId: contextInfo.userId,
        });

        return adaptedExamples;
      } catch (err) {
        logger.log('error', 'Failed to retrieve examples.', {
          error: err,
          userId: contextInfo.userId,
        });
        // For errors coming from the database or endpoint calls, we can throw and it will result in a 500 error from our server
        throw err;
      }
    },
  };
};
