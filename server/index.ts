import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import './db/connect';
import apiV1 from './api/v1';

// Create a new express application instance
const app: express.Application = express();

app.use(cors());

// serve static assets normally
app.use(express.static(`${__dirname}/web/dist`));

app.use(express.json());
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use('/api/v1', apiV1);

// handle every other route with index.html
app.get('*', (req, res): void => {
  res.sendFile(`${__dirname}/web/dist/index.html`);
});

const port = process.env.PORT || 3000;
app.listen(port, (): void => {
  console.log(`Calories app listening on http://localhost:${port}`);
});
