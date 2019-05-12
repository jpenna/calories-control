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
  })

  .get('/list', async (req, res): Promise<void> => {
    try {
      const requester = req.user;
      // eslint-disable-next-line object-curly-newline
      const { limit, skip, from, until, userId: mealUserId } = req.query;

      if (mealUserId && requester.id !== mealUserId && !requester.hasPermission(MEALS_ALL)) {
        return res.sendError(403, 'You can\'t list meals of others.');
      }

      const queryFilters: { eatenAt?: { [key: string]: Date }; user?: string } = {};
      if (from) queryFilters.eatenAt = { $gte: new Date(from) };
      if (until) queryFilters.eatenAt = { ...queryFilters.eatenAt, $lte: new Date(until) };
      if (mealUserId || !requester.hasPermission(MEALS_ALL)) {
        queryFilters.user = mealUserId || requester.id;
      }

      const meals = await MealModel.find(queryFilters)
        .lean()
        .limit(+limit || 10)
        .skip(+skip || 0)
        .sort({ eatenAt: 1 });

      res.sendSuccess({ meals });
    } catch (err) {
      res.sendError(500, err.message);
    }
  });
