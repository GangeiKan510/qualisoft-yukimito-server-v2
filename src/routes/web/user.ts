import { Request, Response, Router } from 'express';
import { createUser, getUserByEmail, updateUser } from '../../controllers/user';
import { UpdateUserSchema, UserSchema } from '../../validators/schemas/schemas';
import { validate } from '../../validators/validate';

const router = Router();

router.post('/get-me', async (req: Request, res: Response, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await getUserByEmail(email);

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    next(error);
  }
});

router.post(
  '/create-user',
  validate(UserSchema),
  async (req: Request, res: Response, next) => {
    try {
      const userData = req.body;

      console.log('Received data:', userData);

      const newUser = await createUser(userData);

      if (!newUser) {
        // In case newUser is undefined or null
        return res.status(400).json({ error: 'Failed to create user.' });
      }

      res.status(201).json(newUser);
    } catch (error: any) {
      console.error('Error creating user:', error.message || error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }
);

router.post(
  '/update-user',
  validate(UpdateUserSchema),
  async (req: Request, res: Response, next) => {
    try {
      const { email, ...updateData } = req.body;

      const updatedUser = await updateUser(email, updateData);

      res.status(200).json(updatedUser);
    } catch (error: any) {
      console.error('Error updating user:', error.message || error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }
);

router.get('/', (req: Request, res: Response) => {
  res.send('Web file router');
});

export default router;
