import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw error; // Let the caller handle error (invalid/expired token)
  }
};

export const AuthenticateMiddleware = (req: any, res: any, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authorization header is missing or malformed',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token, process.env.JWT_SECRET!);
    // Attach payload info to request for downstream use
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};
