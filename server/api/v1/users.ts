import express from 'express';

import UserModel from '../../db/models/users';
import { USERS_EDIT, ROLES } from '../../utils/permissions';

export default express.Router()
  // List users
  .get('/list', async (req, res): Promise<void> => {
    try {
      const requester = req.user;
      const filter = requester.hasPermission(USERS_EDIT) ? {} : { _id: requester.id };
      const users = await UserModel.find(filter);
      res.sendSuccess({ users });
    } catch (err) {
      res.sendError(500, err.message);
    }
  })

  // Requester user
  .get('/me', async (req, res): Promise<void> => {
    try {
      const requester = req.user;
      const user = await UserModel.findById(requester.id);
      res.sendSuccess({ user });
    } catch (err) {
      res.sendError(500, err.message);
    }
  })


  // User by ID
  .get('/roles', (req, res): void => {
    res.sendSuccess({ roles: ROLES });
  })

  // User by ID
  .get('/:id', async (req, res): Promise<void> => {
    try {
      const requester = req.user;
      const canEditUsers = requester.hasPermission(USERS_EDIT);
      if (requester.id !== req.params.id && !canEditUsers) {
        return res.sendError(403, 'You can only see your own account');
      }
      const user = await UserModel.findById(req.params.id);
      res.sendSuccess({ user });
    } catch (err) {
      res.sendError(500, err.message);
    }
  })

  // Update
  .put('/:id', async (req, res): Promise<void> => {
    try {
      // Validate permissions
      const requester = req.user;
      const canEditUsers = requester.hasPermission(USERS_EDIT);
      if (requester.id !== req.params.id && !canEditUsers) {
        return res.sendError(403, 'You can only edit your own account');
      }

      const user = await UserModel.findById(req.params.id);
      if (!user) return res.sendError(404, 'User not found');

      // Only allowed users can edit permissions
      if (!canEditUsers) delete req.body.permissions;
      user.set(req.body);

      const updatedUser = await user.save();
      res.sendSuccess(updatedUser);
    } catch (err) {
      res.sendError(500, err.message);
    }
  });
