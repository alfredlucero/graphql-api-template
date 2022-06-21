import { createExamplesService } from './examples.service';
import { ExamplesRepo } from './examples.repo';
import { GraphQLAPILogger } from '../../logger';
import { ContextServiceInfo } from '../../context';

/*
  Here we write integration tests for our service business logic by dependency injecting our own logger and repos so we can test
  the core business logic without actually fetching from the database or hitting endpoints
*/
describe('ExamplesService', () => {
  test('should return and log examples upon successfully getting examples', async () => {
    // Initialize our service dependencies
    const examples = [
      {
        id: 1,
        message: 'Example 1',
      },
    ];
    // We have the repo return back some examples successfully
    const examplesRepo: ExamplesRepo = {
      getExamples: async () => {
        return examples;
      },
    };
    // We pass in our own logger to make sure it's calling the right things
    const logger: GraphQLAPILogger = {
      log: jest.fn(),
    };
    // We pass in user related information from context that our service needs
    const contextInfo: ContextServiceInfo = {
      scopes: [],
      userId: 'user@company.internal',
    };

    // Inject the dependencies
    const examplesService = createExamplesService({
      logger,
      examplesRepo,
    });

    // Test out the getExamples query with these dependencies
    const result = await examplesService.getExamples(contextInfo);

    // Verify the results and the right things are logged
    expect(result).toEqual(examples);
    expect(logger.log).toHaveBeenCalledWith('info', 'Successfully retrieved examples.', {
      userId: contextInfo.userId,
    });
  });

  test('should log and throw error upon failing to retrieve examples', async () => {
    const someError = new Error('Failed to get examples.');
    // This time we have our repo throw an error to test the catch case
    const examplesRepo: ExamplesRepo = {
      getExamples: async () => {
        throw someError;
      },
    };
    const logger: GraphQLAPILogger = {
      log: jest.fn(),
    };
    const contextInfo: ContextServiceInfo = {
      scopes: [],
      userId: 'user@company.internal',
    };

    const examplesService = createExamplesService({
      logger,
      examplesRepo,
    });

    try {
      await examplesService.getExamples(contextInfo);
    } catch (err) {
      expect(someError).toEqual(err);
      expect(logger.log).toHaveBeenCalledWith('error', 'Failed to retrieve examples.', {
        error: someError,
        userId: contextInfo.userId,
      });
    }
  });
});
