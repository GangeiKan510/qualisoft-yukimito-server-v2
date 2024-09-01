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
