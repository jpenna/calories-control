import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export interface UserInterface extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  permissions: ['users_edit' | 'meals_all'];
}

// TODO lock account if too many login attempts
// check ref: http://devsmash.com/blog/implementing-max-login-attempts-with-mongoose
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
    match: [EMAIL_REGEX, '{VALUE} is not a valid email!'],
  },
  password: {
    type: String,
    required: true,
  },
  permissions: { type: [{ type: String, enum: ['users_edit', 'meals_all'] }] },
}, { versionKey: false });

UserSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

UserSchema.pre<UserInterface>('save', function (next): void {
  const user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.hash(user.password, SALT_ROUNDS, (err, hash): void => {
    user.password = hash;
    next();
  });
});


export default mongoose.model('User', UserSchema);
