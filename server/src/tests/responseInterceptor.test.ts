import request from 'supertest';
import express from 'express';
import { name } from '../../package.json';
import responseInterceptor from '../interceptors/response.interceptor';

describe('Response Interceptor', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(responseInterceptor(name));

    app.get('/test', (req, res) => {
      res.json({ productId: '123', name: 'Product A' });
    });

    app.get('/error', (req, res) => {
      res.status(400).json({ error: 'Bad Request' });
    });
  });

  it('should return the formatted response for success', async () => {
    const response = await request(app)
      .get('/test')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({
      service: name,
      statusCode: 200,
      data: {
        productId: '123',
        name: 'Product A'
      },
      timestamp: expect.any(String)
    });
  });

  it('should not format error responses', async () => {
    const response = await request(app)
      .get('/error')
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toEqual({
      error: 'Bad Request'
    });
  });
});