import mongoose from 'mongoose';

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

export default mongoose.model<MealInterface>('Meal', MealSchema);
