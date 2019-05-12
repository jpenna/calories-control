import express from 'express';

import UserModel from '../../db/models/users';

export default express.Router()
  // Update
  .put('/:id', async (req, res): Promise<void> => {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        res.status(404);
        throw Error('User not found');
      }
      user.set(req.body);
      const updatedUser = await user.save();
      res.json(updatedUser);
    } catch (err) {
      if (err.message !== 'User not found') res.status(500);
      res.json({
        success: false,
        error: err.message,
      });
    }
  });
