import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import { createPet } from '../../controllers/pet';
import { PetSchema } from '../../validators/schemas/schemas';
import { validate } from '../../validators/validate';
import { ZodError } from 'zod';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  '/add-pet',
  upload.single('vaccine_photo'),
  async (req, res, next) => {
    const { userId } = req.body;
    const petData = {
      name: req.body.name,
      breed: req.body.breed,
      birth_date: req.body.birth_date,
      size: req.body.size,
    };
    const vaccinePhoto = req.file;

    try {
      let vaccinePhotoUrl = '';

      if (vaccinePhoto) {
        const formData = new FormData();
        formData.append('file', vaccinePhoto.buffer, {
          filename: vaccinePhoto.originalname,
          contentType: vaccinePhoto.mimetype,
          knownLength: vaccinePhoto.size,
        });
        formData.append('folder', 'vaccines');

        const response = await axios.post(
          `${process.env.PUBLIC_API_SERVER}/web/images/upload`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
            },
          }
        );
        console.log(response);

        vaccinePhotoUrl = response.data.downloadURL;
      }

      // Now include vaccine_photo in petData
      const completePetData = {
        ...petData,
        vaccine_photo: vaccinePhotoUrl || '',
      };

      // Validate complete data after all fields are set
      const validatedData = PetSchema.parse(completePetData);
      console.log(validatedData);

      const newPet = await createPet(userId, validatedData);

      res.status(201).json(newPet);
    } catch (error: any) {
      if (error instanceof ZodError) {
        // Handle Zod validation errors
        console.error('Validation error:', error.errors);
        res.status(400).json({ errors: error.errors });
      } else {
        console.error('Error adding pet:', error);
        res
          .status(500)
          .json({ error: error.message || 'Internal Server Error' });
      }
    }
  }
);

export default router;
