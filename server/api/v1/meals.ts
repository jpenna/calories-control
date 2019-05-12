import express from 'express';

import MealModel from '../../db/models/meals';

export default express.Router()
  .post('/new', async (req, res): Promise<void> => {
    try {
      const meal = { user: req.user.id, ...req.body };
      const model = new MealModel(meal);
      const savedMeal = await model.save();
      res.sendSuccess({ meal: savedMeal });
    } catch (err) {
      res.sendError(500, err.message);
    }
  });
