import { Prisma } from '@prisma/client';
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

    const calculatePetPrice = (
      pet: { size: string },
      service: string,
      numberOfDays: number
    ) => {
      let petPrice = 0;

      switch (service) {
        case 'Errand Care':
          petPrice = pet.size === 'Large' || pet.size === 'XLarge' ? 200 : 175;
          break;
        case 'Day Care':
          petPrice = pet.size === 'Large' || pet.size === 'XLarge' ? 275 : 250;
          break;
        case 'Home Care':
          const homeCareRates: Record<string, number> = {
            XSmall: 425,
            Small: 475,
            Medium: 525,
            Large: 575,
            XLarge: 650,
          };
          petPrice = homeCareRates[pet.size] * numberOfDays;
          break;
        default:
          break;
      }

      return petPrice;
    };

    const calculateTotalBill = (
      pets: { size: string }[],
      service: string,
      checkInDate: string,
      checkOutDate: string
    ) => {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      const numberOfDays = Math.max(
        1,
        Math.ceil(
          Math.abs(checkOut.getTime() - checkIn.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      );

      let totalBill = 0;
      pets.forEach((pet) => {
        totalBill += calculatePetPrice(pet, service, numberOfDays);
      });

      return totalBill;
    };

    const validatePetsArray = (
      pets: Prisma.JsonValue[]
    ): { size: string }[] => {
      if (!Array.isArray(pets)) return [];
      return pets.filter(
        (pet): pet is { size: string } =>
          typeof pet === 'object' &&
          pet !== null &&
          'size' in pet &&
          typeof pet.size === 'string'
      );
    };

    const handleCheckOutDateCalculation = (
      service: string,
      checkInDate?: string
    ): string | undefined => {
      if (!checkInDate) return undefined;

      const checkInDateTime = new Date(checkInDate);

      if (service === 'Errand Care') {
        return new Date(
          checkInDateTime.getTime() + 4 * 60 * 60 * 1000
        ).toISOString();
      } else if (service === 'Day Care') {
        return new Date(
          checkInDateTime.getTime() + 10 * 60 * 60 * 1000
        ).toISOString();
      }

      return undefined;
    };

    if (bookingType === 'regular') {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { pets: true },
      });
      if (!booking) throw new Error('Booking not found');

      const calculatedCheckOutDate =
        handleCheckOutDateCalculation(booking.service, checkInDate) ||
        checkOutDate ||
        booking.check_out_date;

      const totalBill = calculateTotalBill(
        booking.pets,
        booking.service,
        checkInDate || booking.check_in_date,
        calculatedCheckOutDate
      );

      return await prisma.booking.update({
        where: { id: bookingId },
        data: {
          ...(checkInDate && { check_in_date: checkInDate }),
          ...(calculatedCheckOutDate && {
            check_out_date: calculatedCheckOutDate,
          }),
          total_bill: totalBill,
        },
      });
    }

    if (bookingType === 'instant') {
      const booking = await prisma.instantBooking.findUnique({
        where: { id: bookingId },
        select: {
          raw_pet_data: true,
          service: true,
          check_in_date: true,
          check_out_date: true,
        },
      });
      if (!booking) throw new Error('Booking not found');

      const calculatedCheckOutDate =
        handleCheckOutDateCalculation(booking.service, checkInDate) ||
        checkOutDate ||
        booking.check_out_date;

      const pets = validatePetsArray(
        booking.raw_pet_data as Prisma.JsonValue[]
      );
      const totalBill = calculateTotalBill(
        pets,
        booking.service,
        checkInDate || booking.check_in_date,
        calculatedCheckOutDate
      );

      return await prisma.instantBooking.update({
        where: { id: bookingId },
        data: {
          ...(checkInDate && { check_in_date: checkInDate }),
          ...(calculatedCheckOutDate && {
            check_out_date: calculatedCheckOutDate,
          }),
          total_bill: totalBill,
        },
      });
    }
  } catch (error) {
    console.error('Error updating booking dates and prices:', error);
    throw new Error('Failed to update booking dates and prices');
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
