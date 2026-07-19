import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/responseHandler';

export interface AuthRequest extends Request {
  user?: { id: string; role: 'Organizer' | 'Customer' };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 401, 'Not authorized to access this route');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: 'Organizer' | 'Customer' };
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, 401, 'Not authorized to access this route');
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, 403, `User role ${req.user?.role} is not authorized to access this route`);
    }
    next();
  };
};
