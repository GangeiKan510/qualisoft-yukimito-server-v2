import prisma from '../db';

export const getBookings = async () => {
  try {
    const [regularBookings, instantBookings] = await Promise.all([
      prisma.booking.findMany({
        include: { pets: true, user: true },
      }),
      prisma.instantBooking.findMany(),
    ]);

    return {
      regularBookings,
      instantBookings,
    };
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw new Error('Failed to fetch bookings');
  }
};

const getBookingType = async (bookingId: string) => {
  const regularBooking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });
  if (regularBooking) return 'regular';

  const instantBooking = await prisma.instantBooking.findUnique({
    where: { id: bookingId },
  });
  if (instantBooking) return 'instant';

  throw new Error('Booking not found');
};

export const acceptBooking = async (bookingId: string) => {
  try {
    const bookingType = await getBookingType(bookingId);

    if (bookingType === 'regular') {
      return await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'accepted' },
      });
    }

    if (bookingType === 'instant') {
      return await prisma.instantBooking.update({
        where: { id: bookingId },
        data: { status: 'accepted' },
      });
    }
  } catch (error) {
    console.error('Error accepting booking:', error);
    throw new Error('Failed to accept booking');
  }
};

export const rejectBooking = async (bookingId: string) => {
  try {
    const bookingType = await getBookingType(bookingId);

    if (bookingType === 'regular') {
      return await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'rejected' },
      });
    }

    if (bookingType === 'instant') {
      return await prisma.instantBooking.update({
        where: { id: bookingId },
        data: { status: 'rejected' },
      });
    }
  } catch (error) {
    console.error('Error rejecting booking:', error);
    throw new Error('Failed to reject booking');
  }
};
export const updateBookingDates = async (
  bookingId: string,
  { checkInDate, checkOutDate }: { checkInDate?: string; checkOutDate?: string }
) => {
  try {
    const bookingType = await getBookingType(bookingId);

    if (bookingType === 'regular') {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });
      if (!booking) throw new Error('Booking not found');

      let calculatedCheckOutDate = checkOutDate;

      if (checkInDate && booking.service !== 'Home Care') {
        const checkInDateTime = new Date(checkInDate);

        if (booking.service === 'Errand Care') {
          calculatedCheckOutDate = new Date(
            checkInDateTime.getTime() + 4 * 60 * 60 * 1000
          ).toISOString();
        } else if (booking.service === 'Day Care') {
          calculatedCheckOutDate = new Date(
            checkInDateTime.getTime() + 10 * 60 * 60 * 1000
          ).toISOString();
        }
      }

      if (checkOutDate && booking.service !== 'Home Care') {
        throw new Error(
          'Check-out date changes are only allowed manually for home care service'
        );
      }

      return await prisma.booking.update({
        where: { id: bookingId },
        data: {
          ...(checkInDate && { check_in_date: checkInDate }),
          ...(calculatedCheckOutDate && {
            check_out_date: calculatedCheckOutDate,
          }),
        },
      });
    }

    if (bookingType === 'instant') {
      const booking = await prisma.instantBooking.findUnique({
        where: { id: bookingId },
      });
      if (!booking) throw new Error('Booking not found');

      let calculatedCheckOutDate = checkOutDate;

      if (checkInDate && booking.service !== 'Home Care') {
        const checkInDateTime = new Date(checkInDate);

        if (booking.service === 'Errand Care') {
          calculatedCheckOutDate = new Date(
            checkInDateTime.getTime() + 4 * 60 * 60 * 1000
          ).toISOString();
        } else if (booking.service === 'Dayy Care') {
          calculatedCheckOutDate = new Date(
            checkInDateTime.getTime() + 10 * 60 * 60 * 1000
          ).toISOString();
        }
      }

      if (checkOutDate && booking.service !== 'Home Care') {
        throw new Error(
          'Check-out date changes are only allowed manually for home care service'
        );
      }

      return await prisma.instantBooking.update({
        where: { id: bookingId },
        data: {
          ...(checkInDate && { check_in_date: checkInDate }),
          ...(calculatedCheckOutDate && {
            check_out_date: calculatedCheckOutDate,
          }),
        },
      });
    }
  } catch (error) {
    console.error('Error updating booking dates:', error);
    throw new Error('Failed to update booking dates');
  }
};

export const deleteBooking = async (bookingId: string) => {
  try {
    const bookingType = await getBookingType(bookingId);

    if (bookingType === 'regular') {
      return await prisma.booking.delete({
        where: { id: bookingId },
      });
    }

    if (bookingType === 'instant') {
      return await prisma.instantBooking.delete({
        where: { id: bookingId },
      });
    }
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw new Error('Failed to delete booking');
  }
};
