import dotenv from 'dotenv';
import express, { Request, Response, Router } from 'express';
import bookingRouter from './booking';
import petRouter from './pet';

dotenv.config();

const app: Router = express.Router();

app.use(express.json());

app.use('/booking', bookingRouter);
app.use('/pet', petRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Admin Routes');
});

export default app;
