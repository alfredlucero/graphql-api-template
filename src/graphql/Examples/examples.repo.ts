/*
  The Repo/Repository aka Data Access Layer/Data Access Object is where we will wrap how we're fetching and updating data in the database
  or send HTTP requests to on prem or AWS service endpoints
  These repos are the lowermost level and will be passed into the service business logic layer
*/
// import db from "../../db";

// We often will get the DB or service endpoint type that our service layer will adapt
export interface ExampleDb {
  id: number;
  message: string;
}

// We will code against the repo interfaces and we can dependency inject objects that align with this repo interface
// in the services so we can test our service layer aboves
export interface ExamplesRepo {
  getExamples: () => Promise<ExampleDb[]>;
}

export const examplesRepoDefault: ExamplesRepo = {
  getExamples: async () => {
    return [
      {
        id: 1,
        message: 'Example 1',
      },
      {
        id: 1,
        message: 'Example 2',
      },
    ];
  },
};
