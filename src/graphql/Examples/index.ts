import { objectType, extendType } from 'nexus';
/*
  We define our schema types with Nexus for the shape of our inputs and responses for our queries and mutations
  Using those types, we implement our queries and mutations and their corresponding resolvers
 
  This file is for example purposes to show how to use nexus and GraphQL to define your schema and queries and mutations
  For more information on Nexus, check out https://nexusjs.org/
  For more information about GraphQL, check out https://graphql.org/
  
  Note: Make sure to import these types in the graphql/index.ts file; otherwise, our schema.graphql and nexus-typegen.ts files will not be updated
*/

/*
  1. We recommend for you to incrementally build out the schema types first and save along the way
  to update the outputted schema.graphql and associated TypeScript types in nexus-typegen.ts and check for any errors
  
  You'll likely use objectType a lot (similar to interface) and within the definition functions, we will define the schema
  types for each property 
  i.e. message -> t.nonNull.string is the declarative way to say String!
  This type represents { message: String! }

  You'll notice in the schema.graphql that this was generated
  """Some example type including an id and message..."""
  type Example {
    id: Int!
    message: String!
  }
*/
export const Example = objectType({
  name: 'Example',
  description: 'Some example type including an id and message...',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('message');
  },
});

/*
  2. After defining the schema types that will be used for your query response, you will then use extendType
  to define your query while using that type within one of the fields such as "getExamples" below
*/

export const ExampleQuery = extendType({
  type: 'Query',
  definition(t) {
    /*
      3. Create a query property such as "getExamples"

      We can run the following in the GraphiQL interface to verify to get the message from the "getExamples" query field
      query ExampleQuery {
        getExamples {
          id
          message
        }
      }

      You will also notice in the schema.graphql we have this
      type Query {
        """Retrieving the examples"""
        getExamples: Example!
      }
    */
    t.nonNull.list.nonNull.field('getExamples', {
      type: Example,
      description: 'Retrieving the examples',
      /*
        4. Implement how to resolve the query while matching the type
        Here we define how we resolve the data matching the Example type { id message }

        In our resolvers, we will call the service it depends on that is part of the context object passed to all GraphQL
        resolver functions
      */
      async resolve(parent, args, context) {
        // If you try returning a different type than Example, you should see some TS errors

        // Our resolvers should mainly be calling our services to handle the business logic and returning the result
        // We pass in anything from context that the service calls need i.e. scopes and userId
        return context.services.examplesService.getExamples({
          scopes: context.scopes,
          userId: context.userId,
        });
      },
    });
  },
});
