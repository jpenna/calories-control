import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const saltRounds = 10;

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const schema = new mongoose.Schema({
  name: { type: String, required: true, maxLength: 20 },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v: string): boolean {
        return emailRegex.test(v);
      },
      message: (props: mongoose.Error.ValidatorError): string => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
    set(v: string): string {
      return v;
    },
  },
  permissions: { type: [{ type: String, enum: ['users_edit', 'meals_all'] }] },
});


export default mongoose.model('User', schema);
