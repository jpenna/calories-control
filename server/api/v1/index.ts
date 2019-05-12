import express from 'express';

// Routes
import users from './users';
import auth from './auth';

declare module 'express-serve-static-core' {
  interface Response {
    sendError: (status: number, errorMessage: string) => void;
    sendSuccess: (payload: { [key: string]: any }) => void;
  }
}

export default express.Router()
  .use('/', (req, res, next): void => {
    res.sendError = (status, errorMessage): void => {
      res.status(status).json({
        success: false,
        errorMessage,
      });
    };
    res.sendSuccess = (payload): void => {
      res.json({
        success: true,
        ...payload,
      });
    };
    next();
  })
  .use('/', auth)
  .use('/users', users);
