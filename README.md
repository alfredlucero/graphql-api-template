# graphql-api-template

Node/Express/TypeScript/GraphQL Template

## Getting Started

Install everything with `npm ci`.

Start up locally by doing `npm run start`.

To start up in mock mode, you can do `npm run start:nmocko` (using the `nmocko.ts` entry point to load the mock services depenency injected)).

Go to `localhost:8080/altair` to try out the [GraphQL queries](./src/graphql/README.md).

## Architecture

3 Layers

- Routing/Resolver Layer which focuses on HTTP requests/responses/middlewares and calling services for business logic

- Service Layer which focuses on business logic and logging to carry out the GraphQL queries and mutations, calling the repositories for data fetching and modification.

- Repo Layer (repository) which focuses on data fetching and modifying through the database or HTTP calls to services.
