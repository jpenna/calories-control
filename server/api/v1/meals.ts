import express from 'express';

import MealModel from '../../db/models/meals';
import { MEALS_ALL } from '../../utils/permissions';

export default express.Router()
  .post('/new', async (req, res): Promise<void> => {
    try {
      const requester = req.user;
      const mealUserId = req.body.userId;

      if (mealUserId && requester.id !== mealUserId && !requester.hasPermission(MEALS_ALL)) {
        return res.sendError(403, 'You can\'t add meals to others.');
      }

      const meal = { user: mealUserId || req.user.id, ...req.body };
      const model = new MealModel(meal);
      const savedMeal = await model.save();
      res.sendSuccess({ meal: savedMeal });
    } catch (err) {
      res.sendError(500, err.message);
    }
  });
