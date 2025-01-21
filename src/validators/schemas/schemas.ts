import { z } from 'zod';

export const CreateClothingRequestBodySchema = z.object({
  name: z.string().nonempty({ message: 'Name is required' }),
  color: z.string().nonempty({ message: 'Color is required' }),
  type: z.string().nonempty({ message: 'Type is required' }),
  imageUrl: z.string().url({ message: 'Image URL must be a valid URL' }),
});

export const UserSchema = z.object({
  email: z.string().email({ message: 'Email must be a valid email address' }),
});

export const UpdateUserSchema = z.object({
  email: z
    .string()
    .email({ message: 'Email must be a valid email address' })
    .optional(),
  name: z.string().nonempty({ message: 'Name cannot be empty' }).optional(),
  phone: z
    .string()
    .nonempty({ message: 'Phone number cannot be empty' })
    .optional(),
  address: z
    .string()
    .nonempty({ message: 'Address cannot be empty' })
    .optional(),
});

export const PetSchema = z.object({
  name: z.string().nonempty({ message: 'Pet name is required' }),
  size: z.string().nonempty({ message: 'Pet size is required' }),
  breed: z.string().nonempty({ message: 'Pet breed is required' }),
  birth_date: z.string().nonempty({ message: 'Pet birth date is required' }),
  vaccine_photo: z
    .string()
    .url({ message: 'Vaccine photo must be a valid URL' }),
});

export const UpdatePetSchema = z.object({
  name: z.string().optional(),
  breed: z.string().optional(),
  birth_date: z.string().optional(),
  size: z.string().optional(),
  vaccine_photo: z.string().optional(),
});

export const BookingSchema = z.object({
  pet_owner_name: z
    .string()
    .nonempty({ message: 'Pet owner name is required' }),
  service: z.string().nonempty({ message: 'Service is required' }),
  address: z.string().nonempty({ message: 'Address is required' }),
  phone_number: z.string().nonempty({ message: 'Phone number is required' }),
  email: z.string().email({ message: 'Email must be a valid email address' }),
  check_in_date: z.string().nonempty({ message: 'Check-in date is required' }),
  check_out_date: z
    .string()
    .nonempty({ message: 'Check-out date is required' }),
  user_id: z.string().nonempty({ message: 'User ID is required' }),
  pets: z
    .array(PetSchema)
    .nonempty({ message: 'At least one pet is required' }),
  raw_pet_data: z.array(PetSchema).optional(),
});

export const InstantBookingSchema = z.object({
  pet_owner_name: z
    .string()
    .nonempty({ message: 'Pet owner name is required' }),
  service: z.string().nonempty({ message: 'Service is required' }),
  address: z.string().nonempty({ message: 'Address is required' }),
  phone_number: z.string().nonempty({ message: 'Phone number is required' }),
  email: z.string().email({ message: 'Email must be a valid email address' }),
  check_in_date: z.string().nonempty({ message: 'Check-in date is required' }),
  check_out_date: z
    .string()
    .nonempty({ message: 'Check-out date is required' }),
  raw_pet_data: z.array(PetSchema).optional(),
});

export const BookingIdSchema = z.object({
  bookingId: z.string().uuid({ message: 'Booking ID must be a valid UUID' }),
});

export const UpdateBookingDatesSchema = z.object({
  bookingId: z.string().uuid(),
  checkInDate: z.string().optional(),
  checkOutDate: z.string().optional(),
});

export const AdditionalServiceSchema = z.object({
  bookingId: z.string().uuid(),
  title: z.string().min(1),
  amount: z.number().min(1),
});

export const RemoveAdditionalServiceSchema = z.object({
  bookingId: z.string().uuid(),
  serviceId: z.string().uuid(),
});
