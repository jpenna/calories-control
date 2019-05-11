import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  roles: [String],
});

export default mongoose.model('User', schema);
