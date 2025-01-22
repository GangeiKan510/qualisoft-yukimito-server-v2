import { BookingProps, PetProps } from '../types/booking';
import prisma from './db';

export const createBooking = async (body: BookingProps) => {
  try {
    let totalBill = 0;

    const checkInDate = new Date(body.check_in_date);
    const checkOutDate = new Date(body.check_out_date);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    body.pets.forEach((pet: PetProps) => {
      switch (body.service) {
        case 'Errand Care':
          if (
            pet.size === 'XSmall' ||
            pet.size === 'Small' ||
            pet.size === 'Medium'
          ) {
            totalBill += 175;
          } else if (pet.size === 'Large' || pet.size === 'XLarge') {
            totalBill += 200;
          }
          break;

        case 'Day Care':
          if (
            pet.size === 'XSmall' ||
            pet.size === 'Small' ||
            pet.size === 'Medium'
          ) {
            totalBill += 250;
          } else if (pet.size === 'Large' || pet.size === 'XLarge') {
            totalBill += 275;
          }
          break;

        case 'Home Care':
          let homeCareRate = 0;
          switch (pet.size) {
            case 'XSmall':
              homeCareRate = 425;
              break;
            case 'Small':
              homeCareRate = 475;
              break;
            case 'Medium':
              homeCareRate = 525;
              break;
            case 'Large':
              homeCareRate = 575;
              break;
            case 'XLarge':
              homeCareRate = 650;
              break;
          }
          totalBill += homeCareRate * numberOfDays;
          break;

        default:
          throw new Error('Invalid service type');
      }
    });

    const existingPets = await prisma.pet.findMany({
      where: {
        OR: body.pets.map((pet: PetProps) => ({
          name: pet.name,
          breed: pet.breed,
          birth_date: pet.birth_date,
          size: pet.size,
          userId: body.user_id,
        })),
      },
    });

    const petsToLink = existingPets.map((pet) => ({ id: pet.id }));
    const petsToCreate = body.pets.filter(
      (pet: PetProps) =>
        !existingPets.some(
          (existingPet) =>
            existingPet.name === pet.name &&
            existingPet.breed === pet.breed &&
            existingPet.birth_date === pet.birth_date &&
            existingPet.size === pet.size &&
            existingPet.userId === body.user_id
        )
    );

    const newBooking = await prisma.booking.create({
      data: {
        pet_owner_name: body.pet_owner_name,
        service: body.service,
        address: body.address,
        phone_number: body.phone_number,
        email: body.email,
        check_in_date: body.check_in_date,
        check_out_date: body.check_out_date,
        user_id: body.user_id,

        pets: {
          connect: petsToLink,
          create: petsToCreate.map((pet: PetProps) => ({
            name: pet.name,
            breed: pet.breed,
            birth_date: pet.birth_date,
            size: pet.size,
            vaccine_photo: pet.vaccine_photo,
            userId: body.user_id,
          })),
        },

        raw_pet_data: body.raw_pet_data.map((pet: PetProps) => ({
          name: pet.name,
          breed: pet.breed,
          birth_date: pet.birth_date,
          size: pet.size,
          vaccine_photo: pet.vaccine_photo,
        })),

        total_bill: totalBill,
      },
    });

    return newBooking;
  } catch (error: any) {
    throw new Error(`Failed to create booking: ${error.message || error}`);
  }
};

export const createInstantBooking = async (body: BookingProps) => {
  try {
    const totalBill = body.raw_pet_data.reduce((total, pet) => {
      let petPrice = 0;

      switch (body.service) {
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
          petPrice = homeCareRates[pet.size];
          break;
        default:
          break;
      }

      return total + petPrice;
    }, 0);

    const newInstantBooking = await prisma.instantBooking.create({
      data: {
        pet_owner_name: body.pet_owner_name,
        service: body.service,
        address: body.address,
        phone_number: body.phone_number,
        email: body.email,
        check_in_date: body.check_in_date,
        check_out_date: body.check_out_date,
        raw_pet_data: body.raw_pet_data.map((pet: PetProps) => ({
          name: pet.name,
          breed: pet.breed,
          birth_date: pet.birth_date,
          size: pet.size,
          vaccine_photo: pet.vaccine_photo,
        })),
        total_bill: totalBill,
      },
    });

    return newInstantBooking;
  } catch (error: any) {
    throw new Error(
      `Failed to create instant booking: ${error.message || error}`
    );
  }
};

export const getAllBookings = async () => {
  try {
    const regularBookings = await prisma.booking.findMany({
      include: {
        pets: true,
      },
    });

    const instantBookings = await prisma.instantBooking.findMany();

    const allBookings = [
      ...regularBookings.map((booking) => ({
        ...booking,
        type: 'regular',
      })),
      ...instantBookings.map((booking) => ({
        ...booking,
        type: 'instant',
      })),
    ];

    return allBookings;
  } catch (error: any) {
    throw new Error(`Failed to get all bookings: ${error.message || error}`);
  }
};

export const getAvailability = async () => {
  try {
    const regularBookings = await prisma.booking.findMany({
      include: {
        pets: true,
      },
    });

    const instantBookings = await prisma.instantBooking.findMany();

    const regularPetsCount = regularBookings.reduce(
      (count, booking) => count + booking.pets.length,
      0
    );

    const instantPetsCount = instantBookings.reduce(
      (count, booking) => count + booking.raw_pet_data.length,
      0
    );

    const totalPetsCount = regularPetsCount + instantPetsCount;

    const isAvailable = totalPetsCount < 36;

    return isAvailable;
  } catch (error: any) {
    throw new Error(`Failed to check availability: ${error.message || error}`);
  }
};

export const deleteBooking = async (bookingId: string) => {
  try {
    const deletedBooking = await prisma.booking.delete({
      where: { id: bookingId },
    });

    return { success: true, message: 'Booking deleted successfully.' };
  } catch (error: any) {
    try {
      const deletedInstantBooking = await prisma.instantBooking.delete({
        where: { id: bookingId },
      });

      return {
        success: true,
        message: 'Instant booking deleted successfully.',
      };
    } catch (instantError: any) {
      throw new Error(
        `Failed to delete booking: ${error.message || instantError.message}`
      );
    }
  }
};

export const updateBookingDate = async (
  bookingId: string,
  updateData: Partial<BookingProps> & { service: 'Day Care' | 'Errand Care' | 'Home Care' }
) => {
  try {
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { 
        status: true, 
        service: true, 
        check_in_date: true,
        pets: true, 
      },
    });

    if (!existingBooking) {
      throw new Error('Booking not found');
    }

    if (existingBooking.status === 'accepted' || existingBooking.status === 'rejected') {
      throw new Error(`Cannot update booking. Current status: ${existingBooking.status}`);
    }

    const checkInDate = new Date(updateData.check_in_date || existingBooking.check_in_date);
    if (isNaN(checkInDate.getTime())) {
      throw new Error('Invalid check-in date');
    }

    let checkOutDate: Date;
    let totalBill = 0;

    if (updateData.service === 'Day Care') {
      checkOutDate = new Date(checkInDate.getTime() + 10 * 60 * 60 * 1000);

      existingBooking.pets?.forEach((pet: PetProps) => {
        if (pet.size === 'Small' || pet.size === 'Medium') {
          totalBill += 250;
        } else if (pet.size === 'Large' || pet.size === 'XLarge') {
          totalBill += 275;
        }
      });
      
    } else if (updateData.service === 'Errand Care') {
      checkOutDate = new Date(checkInDate.getTime() + 4 * 60 * 60 * 1000);

      existingBooking.pets?.forEach((pet: PetProps) => {
        if (pet.size === 'Small' || pet.size === 'Medium') {
          totalBill += 175;
        } else if (pet.size === 'Large' || pet.size === 'XLarge') {
          totalBill += 200;
        }
      });

    } else if (updateData.service === 'Home Care') {
      if (!updateData.check_out_date) {
        throw new Error('Check-out date is required for Home Care');
      }
      checkOutDate = new Date(updateData.check_out_date);
      if (isNaN(checkOutDate.getTime())) {
        throw new Error('Invalid check-out date');
      }

      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
      const numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      const homeCareRates: Record<string, number> = {
        XSmall: 425,
        Small: 475,
        Medium: 525,
        Large: 575,
        XLarge: 650,
      };

      existingBooking.pets?.forEach((pet: PetProps) => {
        const rate = homeCareRates[pet.size];
        if (rate) {
          totalBill += rate * numberOfDays;
        } else {
          console.error(`Invalid pet size: ${pet.size}`);
        }
      });
    } else {
      throw new Error('Invalid service type');
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        check_in_date: checkInDate.toISOString(),
        check_out_date: checkOutDate.toISOString(),
        total_bill: totalBill,
        updatedAt: new Date().toISOString(),
      },
    });

    return updatedBooking;
  } catch (error: any) {
    console.error('Error updating booking:', error);
    throw new Error(`Failed to update booking: ${error.message || error}`);
  }
};







