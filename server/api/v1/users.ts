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
        return res.sendError(403, 'You can only edit your own account');
      }

      const user = await UserModel.findById(req.params.id);
      if (!user) throw Error('User not found');
      user.set(req.body);
      const updatedUser = await user.save();
      res.json(updatedUser);
    } catch (err) {
      if (err.message !== 'User not found') res.sendError(404, err.message);
      res.sendError(500, err.message);
    }
  });
