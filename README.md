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

## Try this demo with an example frontend

Clone this example [frontend repo](https://github.com/alfredlucero/twsg-frontend-template), follow the installation instructions, and start it up while pointing to this backend server also running in another terminal instance. Go to `localhost:3000/` and see the example query being used to render a table.
