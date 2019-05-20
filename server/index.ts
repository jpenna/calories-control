import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import './db/connect';
import apiV1 from './api/v1';

// Create a new express application instance
const app: express.Application = express();

app.use(cors());

app.use(express.json());
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use('/api/v1', apiV1);

app.listen(3000, (): void => {
  console.log('Calories app listening on http://localhost:3000');
});
