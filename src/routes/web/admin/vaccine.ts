import { Request, Response, Router } from 'express';
import {
  createVaccine,
  getAllVaccines,
  updateVaccineById,
  deleteVaccineById,
} from '../../../controllers/admin/vaccine';

const router = Router();

router.post('/create-vaccine', async (req: Request, res: Response) => {
  try {
    const vaccineData = req.body;

    const newVaccine = await createVaccine(vaccineData);

    if (!newVaccine) {
      return res.status(400).json({ error: 'Failed to create vaccine.' });
    }

    res.status(201).json(newVaccine);
  } catch (error: any) {
    console.error('Error creating vaccine:', error.message || error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

router.get('/all-vaccines', async (req: Request, res: Response) => {
  try {
    const vaccines = await getAllVaccines();
    res.status(200).json(vaccines);
  } catch (error: any) {
    console.error('Error fetching vaccines:', error.message || error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

router.post('/update-vaccine', async (req: Request, res: Response) => {
  const { id, ...vaccineData } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Vaccine ID is required' });
  }

  try {
    const updatedVaccine = await updateVaccineById(id, vaccineData);

    if (!updatedVaccine) {
      return res
        .status(404)
        .json({ error: 'Vaccine not found or not updated' });
    }

    res.status(200).json(updatedVaccine);
  } catch (error: any) {
    console.error('Error updating vaccine:', error.message || error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

router.delete('/delete-vaccine/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Vaccine ID is required' });
  }

  try {
    const deletedVaccine = await deleteVaccineById(id);

    if (!deletedVaccine) {
      return res
        .status(404)
        .json({ error: 'Vaccine not found or already deleted' });
    }

    res.status(200).json(deletedVaccine);
  } catch (error: any) {
    console.error('Error deleting vaccine:', error.message || error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

export default router;
