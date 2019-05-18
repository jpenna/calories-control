import mongoose from 'mongoose';

import * as utils from '../../utils';

interface MealInterface extends mongoose.Document {
  eatenAt: Date;
  name: string;
  calories: number;
  notes: string;
  user: mongoose.Types.ObjectId;
}

function transform(doc: MealInterface, ret: { _id: string }): void {
  /* eslint-disable no-param-reassign */
  delete ret._id;
  /* eslint-enable */
}

const MealSchema = new mongoose.Schema({
  eatenAt: {
    type: Date,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    maxLength: 30,
    trim: true,
  },
  calories: {
    type: Number,
    required: true,
    min: 0,
  },
  notes: {
    type: String,
    maxlength: 100,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
}, {
  toObject: {
    virtuals: true,
    versionKey: false,
    transform,
  },
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform,
  },
});

MealSchema.pre<MealInterface>('save', function (next): void {
  const meal = this;
  // only hash the password if it has been modified (or is new)
  if (!meal.isModified('eatenAt')) return next();

  meal.eatenAt = utils.adjustTimezone(meal.eatenAt);
  next();
});

MealSchema.index({ user: 1, eatenAt: -1 });


export default mongoose.model<MealInterface>('Meal', MealSchema);
