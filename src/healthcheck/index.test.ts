import request from 'supertest';
import { createGraphQLApp } from '../app';

describe('Healthcheck', () => {
  test('should return back 200 Ok', async () => {
    const { app } = createGraphQLApp({});
    await request(app)
      .get('/healthcheck')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({ message: 'Ok' });
      });
  });
});
