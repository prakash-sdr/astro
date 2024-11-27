import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError.errorHandler';

interface IAppError {
  service: string;
  message: string;
  statusCode: number;
  timestamp: string;
  stack?: string;
}

const exceptionInterceptor = (serviceName: string) => {
  return (err: AppError, req: Request, res: Response, next: NextFunction) => {
    const errorResponse: IAppError = {
      service: serviceName,
      message: err.message || 'Internal Server Error',
      statusCode: err.statusCode || 500,
      timestamp: new Date().toISOString()
    };

    if (process.env.NODE_ENV !== 'production') {
      errorResponse.stack = err.stack;
    }

    if (process.env.NODE_ENV !== 'test') {
      console.error(`[${serviceName}]:`, err);
    }

    res.status(errorResponse.statusCode).json(errorResponse);
  };
};

export default exceptionInterceptor;