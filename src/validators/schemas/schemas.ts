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
  closet_id: z.string().nonempty({ message: 'Closet ID is required' }),
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
