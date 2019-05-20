import mongoose from 'mongoose';

const mongoPort = process.env.MONGO_PORT ? `:${process.env.MONGO_PORT}` : '';

mongoose.connect(`mongodb://${process.env.MONGO_HOST}${mongoPort}`, {
  useNewUrlParser: true, // mongodb
  useCreateIndex: true, // mongodb
  useFindAndModify: false, // mongodb
  dbName: process.env.MONGO_DB,
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PASSWORD,
})
  .then(
    (): void => console.log('MongoDB connected!'),
    console.error.bind(console, 'MongoDB connection error:'),
  );

mongoose.set('debug', true);
