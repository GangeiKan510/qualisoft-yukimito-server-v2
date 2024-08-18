import { BookingProps, PetProps } from '../types/booking';
import prisma from './db';

export const createBooking = async (body: BookingProps) => {
  try {
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
          create: body.pets.map((pet: PetProps) => ({
            name: pet.name,
            breed: pet.breed,
            birth_date: pet.birth_date,
            size: pet.size,
            vaccine_photo: pet.vaccine_photo,
            userId: body.user_id, // Linking to the correct user
          })),
        },

        raw_pet_data: body.raw_pet_data.map((pet: PetProps) => ({
          name: pet.name,
          breed: pet.breed,
          birth_date: pet.birth_date,
          size: pet.size,
          vaccine_photo: pet.vaccine_photo,
        })),
      },
    });

    return newBooking;
  } catch (error: any) {
    throw new Error(`Failed to create booking: ${error.message || error}`);
  }
};

export const createInstantBooking = async (body: BookingProps) => {
  try {
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
