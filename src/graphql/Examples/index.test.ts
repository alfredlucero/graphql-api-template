import request from 'supertest';
import { ExamplesService } from './examples.service';
import { createGraphQLApp } from '../../app';

/*
  These are the highest level integration tests for our Examples queries
  where we will perform HTTP requests to our application as if we made requests from the frontend or through Curl
  
  We will make POST requests to the /graphql endpoint with a certain query and expect back certain results
  These should be more smoke type tests that we can send the right GraphQL query and get some data back after dependency injecting a fake service
  Most of the testing should be done in the service layer
*/

describe('Examples', () => {
  test('should be able to successfully query getExamples for examples', async () => {
    const examples = [
      {
        id: 1,
        message: 'Example 1',
      },
    ];
    // We mock out the service to dependency inject into the app
    const examplesService: ExamplesService = {
      getExamples: async () => {
        return examples;
      },
    };

    // Create the app by dependency injecting the examples service
    const { app } = createGraphQLApp({
      services: {
        examplesService,
      },
    });

    // Query the server to get examples
    await request(app)
      .post('/graphql')
      .send({
        // Pass along the query in the request body similar to how we form queries in the GraphiQL UI
        query: `query GetExamples {
          getExamples {
            id
            message
          }
        }`,
      })
      .expect(200)
      .then((response) => {
        // Verify the response matches what we expect
        expect(response.body).toEqual({
          data: { getExamples: examples },
        });
      });
  });
});
