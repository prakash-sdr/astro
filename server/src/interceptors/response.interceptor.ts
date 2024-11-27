import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

const responseInterceptor = (serviceName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);

    res.json = (body: any) => {
      if (res.headersSent) {
        return originalJson(body); // Skip if headers are already sent
      }

      if (res.statusCode >= StatusCodes.BAD_REQUEST) {
        return originalJson(body); // Do not modify error responses
      }

      const formattedResponse = {
        service: serviceName,
        data: body,
        statusCode: res.statusCode,
        timestamp: new Date().toISOString(),
      };

      return originalJson(formattedResponse);
    };

    res.send = (body: any) => {
      if (res.headersSent) {
        return originalSend(body); // Skip if headers are already sent
      }

      if (res.statusCode >= StatusCodes.BAD_REQUEST) {
        return originalSend(body); // Do not modify error responses
      }

      if (typeof body === 'string' || Buffer.isBuffer(body)) {
        return originalSend(body); // Do not modify plain text or buffers
      }

      const formattedResponse = {
        service: serviceName,
        data: body,
        statusCode: res.statusCode,
        timestamp: new Date().toISOString(),
      };

      return originalSend(formattedResponse);
    };

    next();
  };
};

export default responseInterceptor;
