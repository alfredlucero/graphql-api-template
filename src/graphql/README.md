# GraphQLAPI

## getExamples

Getting example data

Usage:

```js
// Query
query GetExamples {
  getExamples {
    id
    message
  }
}
// Responses:
{
  "data": {
    "getExamples": [
      {
        "id": 1,
        "message": "Example 1"
      },
      {
        "id": 1,
        "message": "Example 2"
      }
    ]
  }
}
```
