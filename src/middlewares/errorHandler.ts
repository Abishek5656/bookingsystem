import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/responseHandler';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const message = err.message || 'Internal Server Error';

  sendError(res, statusCode, message, process.env.NODE_ENV === 'development' ? err.stack : undefined);
};
