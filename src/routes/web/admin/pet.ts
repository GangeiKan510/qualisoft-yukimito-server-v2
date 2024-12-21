import { Request, Response, Router } from 'express';
import { validate } from '../../../validators/validate';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Web file router');
});

export default router;
