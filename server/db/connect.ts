import mongoose from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
mongoose.connect(process.env.MONGO_URL!, {
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
