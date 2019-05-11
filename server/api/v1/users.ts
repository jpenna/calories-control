import express from 'express';

export default express.Router()
  .post('/registration', (req, res): void => {
    res.send('register');
  });
