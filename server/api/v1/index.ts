import express from 'express';

// Routes
import users from './users';
import auth from './auth';

declare module 'express-serve-static-core' {
  interface Response {
    sendError: (status: number, errorMessage: string) => void;
  }
}

export default express.Router()
  .use('/', (req, res, next): void => {
    res.sendError = (status: number, errorMessage: string): void => {
      res.status(status).json({
        success: false,
        errorMessage,
      });
    };
    next();
  })
  .use('/', auth)
  .use('/users', users);
