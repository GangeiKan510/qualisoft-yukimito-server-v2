import prisma from '../db';

export const getBookings = async () => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { pets: true, user: true },
    });
    return bookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw new Error('Failed to fetch bookings');
  }
};

export const acceptBooking = async (bookingId: string) => {
  try {
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'accepted' },
    });

    if (!updatedBooking) {
      throw new Error('Booking not found');
    }

    return updatedBooking;
  } catch (error) {
    console.error('Error accepting booking:', error);
    throw new Error('Failed to accept booking');
  }
};

export const rejectBooking = async (bookingId: string) => {
  try {
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'rejected' },
    });

    if (!updatedBooking) {
      throw new Error('Booking not found');
    }

    return updatedBooking;
  } catch (error) {
    console.error('Error rejecting booking:', error);
    throw new Error('Failed to reject booking');
  }
};

export const deleteBooking = async (bookingId: string) => {
  try {
    const deletedBooking = await prisma.booking.delete({
      where: { id: bookingId },
    });

    if (!deletedBooking) {
      throw new Error('Booking not found');
    }

    return deletedBooking;
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw new Error('Failed to delete booking');
  }
};
