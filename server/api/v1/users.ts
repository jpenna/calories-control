import express from 'express';

import UsersModel from '../../db/models/users';

export default express.Router()
  // Create
  .post('/', async (req, res): Promise<void> => {
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
  })

  // Update
  .put('/:id', async (req, res): Promise<void> => {
    try {
      const opts = { new: true, runValidators: true };
      const user = await UsersModel.findByIdAndUpdate(req.params.id, req.body, opts);
      res.send(user);
    } catch (error) {
      res.send({
        success: false,
        error: error.message,
      });
    }
  });
