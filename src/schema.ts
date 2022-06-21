import { makeSchema } from 'nexus';
import { GraphQLSchema } from 'graphql';
import { join } from 'path';
import * as types from './graphql';

// With Nexus
// 1. Define components of schema (types, fields, root objects) i.e. objectType
// 2. Define GraphQL queries and mutations i.e. extendType
// 3. Implement corresponding resolver functions for queries and mutations
//    - You will create, test, and use services in the resolver aka the business logic layer that calls on repositories
//    - You will create repositories aka the data access layer where we wrap how we deal with data in the database or make API calls to external endpoints
export const schema = makeSchema({
  types,
  outputs: {
    // GraphQL schema will update when we modify types i.e. objectType, enumType, etc.
    schema: join(process.cwd(), 'schema.graphql'),
    // TypeScript type definitions for all types in the GraphQL schema are generated here to keep things in sync with implementation
    typegen: join(process.cwd(), 'nexus-typegen.ts'),
  },
  contextType: {
    module: join(process.cwd(), './src/context.ts'),
    export: 'Context',
  },
}) as unknown as GraphQLSchema;
