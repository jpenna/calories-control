import mongoose from 'mongoose';

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
  password: { type: String, required: true },
  roles: { type: [String] },
});

export default mongoose.model('User', schema);
