import { Request, Response, Router } from 'express';
import { validate } from '../../../validators/validate';
import {
  getBookings,
  acceptBooking,
  rejectBooking,
  deleteBooking,
} from '../../../controllers/admin/booking';
import { BookingIdSchema } from '../../../validators/schemas/schemas';

const router = Router();

router.get('/bookings', async (req: Request, res: Response) => {
  try {
    const allBookings = await getBookings();
    res.status(200).json(allBookings);
  } catch (error: any) {
    console.error('Error fetching bookings:', error.message || error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

router.post(
  '/accept-booking',
  validate(BookingIdSchema),
  async (req: Request, res: Response) => {
    const { bookingId } = req.body;

    try {
      const result = await acceptBooking(bookingId);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error accepting booking:', error.message || error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }
);

router.post(
  '/reject-booking',
  validate(BookingIdSchema),
  async (req: Request, res: Response) => {
    const { bookingId } = req.body;

    try {
      const result = await rejectBooking(bookingId);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error rejecting booking:', error.message || error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }
);

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
export default router;
