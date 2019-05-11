import 'dotenv/config';
import express from 'express';

import './db/connect';
import apiV1 from './api/v1';

// Create a new express application instance
const app: express.Application = express();

app.use('/api/v1', apiV1);

app.listen(3000, (): void => {
  console.log('Example app listening on http://localhost:3000');
});
