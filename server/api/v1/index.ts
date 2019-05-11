import express from 'express';

// Routes
import users from './users';

export default express.Router()
  .use('/users', users);
