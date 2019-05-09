// lib/app.ts
import express from 'express';

// Create a new express application instance
const app: express.Application = express();

app.get('/', (req, res): void => {
  res.send('Hello World!');
});

app.listen(3000, (): void => {
  console.log('Example app listening on http://localhost:3000');
});
