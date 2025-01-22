import { Prisma } from '@prisma/client';
import prisma from '../db';

export const getBookings = async () => {
  try {
    const [regularBookings, instantBookings] = await Promise.all([
      prisma.booking.findMany({
        include: { pets: true, user: true, additionalServices: true },
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

    const calculateTotalBillForHomeCare = (
      pets: { size: string }[],
      checkInDate: string,
      checkOutDate: string
    ) => {
      const homeCareRates: Record<string, number> = {
        XSmall: 425,
        Small: 475,
        Medium: 525,
        Large: 575,
        XLarge: 650,
      };

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
        const rate = homeCareRates[pet.size] || 0;
        totalBill += rate * numberOfDays;
      });

      return totalBill;
    };

    const validatePetsArray = (
      pets: Prisma.JsonValue[]
    ): { size: string }[] => {
      if (!Array.isArray(pets)) return [];

      return pets.filter((pet): pet is { size: string } => {
        return (
          typeof pet === 'object' &&
          pet !== null &&
          !Array.isArray(pet) &&
          'size' in pet &&
          typeof (pet as { size: string }).size === 'string'
        );
      });
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

      let totalBill = booking.total_bill;

      if (booking.service === 'Home Care') {
        totalBill = calculateTotalBillForHomeCare(
          booking.pets,
          checkInDate || booking.check_in_date,
          calculatedCheckOutDate
        );
      }

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
          total_bill: true,
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

      let totalBill = booking.total_bill;

      if (booking.service === 'Home Care') {
        totalBill = calculateTotalBillForHomeCare(
          pets,
          checkInDate || booking.check_in_date,
          calculatedCheckOutDate
        );
      }

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
export const checkInPets = async (bookingId: string) => {
  try {
    const bookingType = await getBookingType(bookingId);

    if (bookingType === 'regular') {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });
      if (!booking) throw new Error('Booking not found');

      return await prisma.booking.update({
        where: { id: bookingId },
        data: {
          pets_checked_in: true,
        },
      });
    }

    if (bookingType === 'instant') {
      const booking = await prisma.instantBooking.findUnique({
        where: { id: bookingId },
      });
      if (!booking) throw new Error('Booking not found');

      return await prisma.instantBooking.update({
        where: { id: bookingId },
        data: {
          pets_checked_in: true,
        },
      });
    }

    throw new Error('Booking type not supported');
  } catch (error) {
    console.error('Error checking in pets:', error);
    throw new Error('Failed to check in pets');
  }
};

export const addAdditionalService = async (
  bookingId: string,
  title: string
) => {
  try {
    const serviceRates: Record<string, Record<string, number>> = {
      'Errand Care': {
        'Small & Medium': 175,
        'Large & X-Large': 200,
      },
      'Day Care': {
        'Small & Medium': 250,
        'Large & X-Large': 275,
      },
    };

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (!serviceRates[title]) {
      throw new Error(`Service '${title}' is not recognized.`);
    }

    const petSizeGroups: Record<string, string[]> = {
      'Small & Medium': ['XSmall', 'Small', 'Medium'],
      'Large & X-Large': ['Large', 'XLarge'],
    };

    const rawPetData = booking.raw_pet_data as { size: string }[];
    if (!rawPetData || rawPetData.length === 0) {
      throw new Error('No pets found in the booking.');
    }

    let totalServiceAmount = 0;
    const unmatchedPets: string[] = [];

    rawPetData.forEach((pet) => {
      const petSizeCategory = Object.keys(petSizeGroups).find((group) =>
        petSizeGroups[group].includes(pet.size)
      );
      if (petSizeCategory && serviceRates[title][petSizeCategory]) {
        totalServiceAmount += serviceRates[title][petSizeCategory];
      } else {
        unmatchedPets.push(pet.size);
      }
    });

    if (totalServiceAmount === 0) {
      throw new Error(
        `No applicable rate found for the pets in this booking. Unmatched pet sizes: ${unmatchedPets.join(
          ', '
        )}`
      );
    }

    await prisma.additionalService.create({
      data: {
        title,
        amount: totalServiceAmount,
        bookingId,
      },
    });

    const updatedTotalBill = booking.total_bill + totalServiceAmount;

    await prisma.booking.update({
      where: { id: bookingId },
      data: { total_bill: updatedTotalBill },
    });

    return {
      message: `Added ${title} service successfully`,
      totalBill: updatedTotalBill,
    };
  } catch (error) {
    console.error('Error adding additional service:', error);
    throw new Error('Failed to add additional service');
  }
};

export const removeAdditionalService = async (
  bookingId: string,
  serviceId: string
) => {
  try {
    return await prisma.$transaction(async (prisma) => {
      const service = await prisma.additionalService.findUnique({
        where: { id: serviceId },
        include: { booking: true },
      });

      if (!service || service.bookingId !== bookingId) {
        throw new Error(
          'Additional service not found or does not belong to the specified booking.'
        );
      }

      const updatedTotalBill = Math.max(
        0,
        service.booking.total_bill - service.amount
      );

      await prisma.booking.update({
        where: { id: bookingId },
        data: { total_bill: updatedTotalBill },
      });

      await prisma.additionalService.delete({
        where: { id: serviceId },
      });

      return {
        message: 'Additional service removed successfully.',
        totalBill: updatedTotalBill,
      };
    });
  } catch (error) {
    console.error('Error removing additional service:', error);
    throw new Error('Failed to remove additional service.');
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
