import express from 'express';

// Routes
import users from './users';
import auth from './auth';

export default express.Router()
  .use('/', auth)
  .use('/users', users);
