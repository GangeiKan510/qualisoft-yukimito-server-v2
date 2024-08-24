import dotenv from 'dotenv';
import express, { Request, Response, Router } from 'express';
import userRouter from './user';
import bookingRouter from './booking';
import petsRouter from './pet';

import uploadRouter from './upload';
dotenv.config();

const app: Router = express.Router();

app.use('/users', userRouter);
app.use('/booking', bookingRouter);
app.use('/pets', petsRouter);

app.use('/images', uploadRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Web router');
});

export default app;
