import { Request, Response, Router } from 'express';
import {
  BookingSchema,
  InstantBookingSchema,
} from '../../validators/schemas/schemas';
import { validate } from '../../validators/validate';
import {
  createBooking,
  createInstantBooking,
  getAllBookings,
} from '../../controllers/booking';

const router = Router();

// Endpoint for creating a regular Booking
router.post(
  '/create-booking',
  validate(BookingSchema),
  async (req: Request, res: Response, next) => {
    try {
      const bookingData = req.body;

      console.log('Received data:', bookingData);

      const newBooking = await createBooking(bookingData);

      if (!newBooking) {
        return res.status(400).json({ error: 'Failed to create booking.' });
      }

      res.status(201).json(newBooking);
    } catch (error: any) {
      console.error('Error creating booking:', error.message || error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }
);

// Endpoint for creating an Instant Booking
router.post(
  '/create-instant-booking',
  validate(InstantBookingSchema),
  async (req: Request, res: Response, next) => {
    try {
      const bookingData = req.body;

      console.log('Received data:', bookingData);

      const newInstantBooking = await createInstantBooking(bookingData);

      if (!newInstantBooking) {
        return res
          .status(400)
          .json({ error: 'Failed to create instant booking.' });
      }

      res.status(201).json(newInstantBooking);
    } catch (error: any) {
      console.error('Error creating instant booking:', error.message || error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }
);

// Endpoint for getting all bookings (both regular and instant)
router.get('/bookings', async (req: Request, res: Response) => {
  try {
    const allBookings = await getAllBookings();
    res.status(200).json(allBookings);
  } catch (error: any) {
    console.error('Error fetching bookings:', error.message || error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

router.get('/', (req: Request, res: Response) => {
  res.send('Web file router');
});

export default router;
