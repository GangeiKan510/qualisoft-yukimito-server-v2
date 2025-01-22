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
  getAvailability,
  deleteBooking,
  updateBookingDate
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

// Endpoint for checking availability
router.get('/availability', async (req: Request, res: Response) => {
  try {
    const isAvailable = await getAvailability();
    res.status(200).json({ available: isAvailable });
  } catch (error: any) {
    console.error('Error checking availability:', error.message || error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

router.delete('/delete-booking', async (req: Request, res: Response) => {
  const { bookingId } = req.query;

  if (!bookingId) {
    return res.status(400).json({ error: 'Booking ID is required' });
  }

  try {
    const result = await deleteBooking(bookingId as string);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error deleting booking:', error.message || error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

router.post('/update-booking-date', async (req, res) => {
  const { bookingId, check_in_date, check_out_date, service } = req.body;

  try {
    if (!bookingId || !service || !check_in_date) {
      return res.status(400).json({ error: 'Missing required fields: bookingId, serviceType, check_in_date' });
    }

    if (!['Day Care', 'Errand Care', 'Home Care'].includes(service)) {
      return res.status(400).json({ error: 'Invalid service type. Allowed values: day care, errand care, home care' });
    }

    const updatedBooking = await updateBookingDate(bookingId, {
      service,
      check_in_date,
      check_out_date,
    });

    return res.status(200).json(updatedBooking);
  } catch (error: any) {
    console.error('Error in /update-booking-date endpoint:', error);
    return res.status(500).json({ error: error.message || 'An error occurred' });
  }
});

export default router;
