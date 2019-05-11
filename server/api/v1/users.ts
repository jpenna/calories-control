import express from 'express';

import UsersModel from '../../db/models/users';

export default express.Router()
  .post('/registration', async (req, res): Promise<void> => {
    try {
      const userModel = new UsersModel(req.body);
      const user = await userModel.save();
      res.send(user);
    } catch (error) {
      res.send({
        success: false,
        error: error.message,
      });
    }
  });
