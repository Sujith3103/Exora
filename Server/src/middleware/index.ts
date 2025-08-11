import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { AuthUserPayload } from '..';

export const AuthenticateMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authorization header is missing or malformed',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as AuthUserPayload; // type assertion
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};
