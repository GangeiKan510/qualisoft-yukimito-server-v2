import { Request, Response, Router } from 'express';
import {
  getUsersWithNonDefaultRole,
  modifyUserRole,
  deleteUser,
  getAllUsersWithDetails,
} from '../../../controllers/admin/user';

const router = Router();

router.get('/non-default-role-users', async (req: Request, res: Response) => {
  try {
    const users = await getUsersWithNonDefaultRole();
    res.status(200).json(users);
  } catch (error: any) {
    console.error(
      'Error fetching users with non-default role:',
      error.message || error
    );
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});
router.post('/modify-user-role', async (req: Request, res: Response) => {
  const { email, newRole } = req.body;

  if (!email || newRole === undefined) {
    return res.status(400).json({ error: 'Email and new role are required' });
  }

  try {
    const updatedUser = await modifyUserRole(email, newRole);

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error('Error modifying user role:', error.message || error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

router.delete('/delete-user', async (req: Request, res: Response) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const deletedUser = await deleteUser(id as string);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ error: 'User not found or already deleted' });
    }

    res.status(200).json(deletedUser);
  } catch (error: any) {
    console.error('Error deleting user:', error.message || error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

router.get('/get-all-users', async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersWithDetails();
    res.status(200).json(users);
  } catch (error: any) {
    console.error(
      'Error fetching all users with details:',
      error.message || error
    );
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

export default router;
