import dotenv from 'dotenv';
import express, { Request, Response, Router } from 'express';
import userRouter from './user';
dotenv.config();

const app: Router = express.Router();

app.use('/users', userRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Web router');
});

export default app;
