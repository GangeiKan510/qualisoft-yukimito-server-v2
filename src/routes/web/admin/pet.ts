import { Request, Response, Router } from 'express';
import {
  getAllPets,
  updatePetDetails,
  markPetAsVaccinated,
  deletePet,
} from '../../../controllers/admin/pets';

const router = Router();

router.get('/all-pets', async (req: Request, res: Response) => {
  try {
    const pets = await getAllPets();
    res.status(200).json(pets);
  } catch (error: any) {
    console.error('Error fetching pets:', error.message || error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

router.post('/update-pet', async (req: Request, res: Response) => {
  const { id, ...updateData } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Pet ID is required' });
  }

  try {
    const updatedPet = await updatePetDetails(id, updateData);

    if (!updatedPet) {
      return res.status(404).json({ error: 'Pet not found or not updated' });
    }

    res.status(200).json(updatedPet);
  } catch (error: any) {
    console.error('Error updating pet:', error.message || error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

router.post('/mark-vaccinated', async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Pet ID is required' });
  }

  try {
    const updatedPet = await markPetAsVaccinated(id);

    if (!updatedPet) {
      return res.status(404).json({ error: 'Pet not found or not updated' });
    }

    res.status(200).json(updatedPet);
  } catch (error: any) {
    console.error('Error marking pet as vaccinated:', error.message || error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

router.delete('/delete-pet', async (req: Request, res: Response) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Pet ID is required' });
  }

  try {
    const deletedPet = await deletePet(id as string);

    if (!deletedPet) {
      return res
        .status(404)
        .json({ error: 'Pet not found or already deleted' });
    }

    res.status(200).json(deletedPet);
  } catch (error: any) {
    console.error('Error deleting pet:', error.message || error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

export default router;
