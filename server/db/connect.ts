import mongoose from 'mongoose';

const dbPort = process.env.MONGO_PORT ? `:${process.env.MONGO_PORT}` : '';
const dbUri = `${process.env.MONGO_PROTOCOL || 'mongodb'}://${process.env.MONGO_HOST}${dbPort}`;
const options = {
  useNewUrlParser: true, // mongodb
  useCreateIndex: true, // mongodb
  useFindAndModify: false, // mongodb
  dbName: process.env.MONGO_DB,
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PASSWORD,
};

const database = mongoose.connection;

database.on('connecting', (): void => console.log('Connecting to MongoDB...'));
database.on('connected', (): void => console.log('MongoDB connected!'));
database.on('error', (error): void => console.error(`Error in MongoDb connection: ${error}`));
database.once('open', (): void => console.log('MongoDB connection opened!'));
database.on('reconnected', (): void => console.log('MongoDB reconnected!'));
database.on('disconnected', (): void => console.log('MongoDB disconnected!'));

if (process.env.NODE_ENV !== 'production') {
  mongoose.set('debug', true);
}

mongoose.connect(dbUri, options);
