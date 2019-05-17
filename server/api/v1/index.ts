import express, { RequestHandler } from 'express';

// Routes
import users from './users';
import auth from './auth';
import meals from './meals';

declare module 'express-serve-static-core' {
  interface Response {
    sendError: (status: number, errorMessage: string, code?: number) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendSuccess: (payload: { [key: string]: any }) => void;
  }
}

// Add response methods for ease of use
const sugarMethods: RequestHandler = (req, res, next): void => {
  res.sendError = (status, errorMessage, code): void => {
    res.status(status).json({
      success: false,
      errorMessage,
      code,
    });
  };
  res.sendSuccess = (payload): void => {
    res.json({
      success: true,
      ...payload,
    });
  };
  next();
};

export default express.Router()
  .use('/', sugarMethods)
  .use('/', auth)
  .use('/meals', meals)
  .use('/users', users);
