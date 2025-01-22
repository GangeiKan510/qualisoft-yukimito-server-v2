import { Request, Response, Router } from 'express';
import { validate } from '../../../validators/validate';
import {
  getBookings,
  acceptBooking,
  rejectBooking,
  deleteBooking,
  updateBookingDates,
  checkInPets,
  addAdditionalService,
  removeAdditionalService,
} from '../../../controllers/admin/booking';
import {
  AdditionalServiceSchema,
  BookingIdSchema,
  RemoveAdditionalServiceSchema,
  UpdateBookingDatesSchema,
} from '../../../validators/schemas/schemas';

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

router.post(
  '/update-booking-dates',
  validate(UpdateBookingDatesSchema),
  async (req: Request, res: Response) => {
    const { bookingId, checkInDate, checkOutDate } = req.body;

    try {
      const result = await updateBookingDates(bookingId, {
        checkInDate,
        checkOutDate,
      });
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error updating booking dates:', error.message || error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }
);

router.post(
  '/check-in-pets',
  validate(BookingIdSchema),
  async (req: Request, res: Response) => {
    const { bookingId } = req.body;

    try {
      const result = await checkInPets(bookingId);
      res.status(200).json({
        message: 'Pets successfully checked in.',
        updatedBooking: result,
      });
    } catch (error: any) {
      console.error('Error checking in pets:', error.message || error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }
);

router.post(
  '/add-additional-service',
  validate(AdditionalServiceSchema),
  async (req: Request, res: Response) => {
    const { bookingId, title } = req.body;

    try {
      const result = await addAdditionalService(bookingId, title);
      res.status(200).json({
        message: 'Additional service added successfully.',
        result,
      });
    } catch (error: any) {
      console.error('Error adding additional service:', error.message || error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }
);

router.post(
  '/remove-additional-service',
  validate(RemoveAdditionalServiceSchema),
  async (req: Request, res: Response) => {
    const { bookingId, serviceId } = req.body;

    try {
      const updatedBooking = await removeAdditionalService(
        bookingId,
        serviceId
      );
      res.status(200).json({
        message: 'Additional service removed successfully.',
        updatedBooking,
      });
    } catch (error: any) {
      console.error(
        'Error removing additional service:',
        error.message || error
      );
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
