import express from 'express';

import MealModel from '../../db/models/meals';
import { MEALS_ALL } from '../../utils/permissions';

export default express.Router()
  // Create meal
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

  // List meals
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

      const [meals, count] = await Promise.all([
        await MealModel.find(queryFilters)
          .limit(+limit || 20)
          .skip(+skip || 0)
          .sort({ eatenAt: 1 }),
        await MealModel.countDocuments(queryFilters),
      ]);

      res.sendSuccess({ meals, count, skipped: +skip || 0 });
    } catch (err) {
      res.sendError(500, err.message);
    }
  })

  // Update meal
  .put('/:mealId', async (req, res): Promise<void> => {
    try {
      const requester = req.user;

      const whereClause = {
        _id: req.params.mealId,
        user: requester.hasPermission(MEALS_ALL) ? null : req.user.id,
      };
      if (!whereClause.user) delete whereClause.user;

      // eslint-disable-next-line object-curly-newline
      const meal = await MealModel.findOneAndUpdate(whereClause, req.body, { new: true });

      if (!meal) return res.sendError(404, 'Meal not found or you don\'t have permission to update it.');
      res.sendSuccess({ meal });
    } catch (err) {
      res.sendError(500, err.message);
    }
  })

  // Remove meals
  .delete('/:mealId', async (req, res): Promise<void> => {
    try {
      const requester = req.user;

      const whereClause = {
        _id: req.params.mealId,
        user: requester.hasPermission(MEALS_ALL) ? null : req.user.id,
      };
      if (!whereClause.user) delete whereClause.user;

      // eslint-disable-next-line object-curly-newline
      const meal = await MealModel.findOneAndRemove(whereClause, { select: 'id' }).lean();

      if (!meal) return res.sendError(404, 'Meal not found or you don\'t have permission to delete it.');

      res.sendSuccess({ mealId: meal._id });
    } catch (err) {
      res.sendError(500, err.message);
    }
  })

  // Get single meal
  .get('/:mealId', async (req, res): Promise<void> => {
    try {
      const requester = req.user;
      // eslint-disable-next-line object-curly-newline
      const { mealId } = req.params;
      const meal = await MealModel.findById(mealId);

      if (!meal) return res.sendError(404, 'Meal not found.');
      if (!meal.user.equals(requester.id) && !requester.hasPermission(MEALS_ALL)) {
        return res.sendError(403, 'You can\'t fetch meals of others.');
      }

      res.sendSuccess({ meal });
    } catch (err) {
      res.sendError(500, err.message);
    }
  });
