import express from 'express';

import UsersModel from '../../db/models/users';

export default express.Router()
  // Create
  .post('/', async (req, res): Promise<void> => {
    try {
      const userModel = new UsersModel(req.body);
      const { password, ...user } = (await userModel.save()).toObject();
      res.json(user);
    } catch (error) {
      res.status(500);
      res.json({
        success: false,
        error: error.message,
      });
    }
  })

  // Update
  .put('/:id', async (req, res): Promise<void> => {
    try {
      const user = await UsersModel.findById(req.params.id);
      if (!user) {
        res.status(404);
        throw Error('User not found');
      }
      user.set(req.body);
      const { password, ...userData } = (await user.save()).toObject();
      res.json(userData);
    } catch (error) {
      if (error.message !== 'User not found') res.status(500);
      res.json({
        success: false,
        error: error.message,
      });
    }
  });
