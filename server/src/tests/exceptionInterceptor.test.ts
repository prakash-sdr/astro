import request from 'supertest';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { name } from '../../package.json';
import AppError from '../utils/appError.errorHandler';
import exceptionInterceptor from '../interceptors/exception.interceptor';

describe('Exception Interceptor', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();

    app.use(express.json());

    app.get('/custom-error', (req, res) => {
      throw new AppError('Product not found', StatusCodes.NOT_FOUND);
    });

    app.get('/standard-error', (req, res) => {
      throw new Error('Standard error occurred');
    });

    app.get('/async-error', async (req, res, next) => {
      try {
        await Promise.reject(new AppError('Async error', StatusCodes.BAD_REQUEST));
      } catch (error) {
        next(error);
      }
    });

    app.use(exceptionInterceptor(name));
  });

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should format custom AppError properly', async () => {
    const response = await request(app)
      .get('/custom-error')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.NOT_FOUND);

    expect(response.body).toMatchObject({
      service: name,
      message: 'Product not found',
      statusCode: StatusCodes.NOT_FOUND,
      timestamp: expect.any(String)
    });

    if (process.env.NODE_ENV !== 'production') {
      expect(response.body).toHaveProperty('stack');
    }
  });

  it('should handle standard Error properly', async () => {
    const response = await request(app)
      .get('/standard-error')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.INTERNAL_SERVER_ERROR);

    expect(response.body).toMatchObject({
      service: name,
      message: 'Standard error occurred',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      timestamp: expect.any(String)
    });

    if (process.env.NODE_ENV !== 'production') {
      expect(response.body).toHaveProperty('stack');
    }
  });

  it('should handle async errors properly', async () => {
    const response = await request(app)
      .get('/async-error')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST);

    expect(response.body).toMatchObject({
      service: name,
      message: 'Async error',
      statusCode: StatusCodes.BAD_REQUEST,
      timestamp: expect.any(String)
    });

    if (process.env.NODE_ENV !== 'production') {
      expect(response.body).toHaveProperty('stack');
    }
  });

  describe('Production Environment', () => {
    const originalEnv = process.env.NODE_ENV;

    beforeAll(() => {
      process.env.NODE_ENV = 'production';
    });

    afterAll(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it('should exclude stack trace in production', async () => {
      const response = await request(app)
        .get('/custom-error')
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND);

      expect(response.body).toEqual({
        service: name,
        message: 'Product not found',
        statusCode: StatusCodes.NOT_FOUND,
        timestamp: expect.any(String)
      });

      expect(response.body).not.toHaveProperty('stack');
    });
  });
});