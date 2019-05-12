import express from 'express';

import UserModel from '../../db/models/users';
import { USERS_EDIT } from '../../utils/permissions';

export default express.Router()
  // Update
  .put('/:id', async (req, res): Promise<void> => {
    try {
      // Validate permissions
      const requester = req.user;
      if (requester.id !== req.params.id && !requester.hasPermission(USERS_EDIT)) {
        res.status(403).send({
          success: false,
          error: 'You can only edit your own account',
        });
      }

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
