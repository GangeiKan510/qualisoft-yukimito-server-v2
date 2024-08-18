import { PetProps } from './pet';

export interface BookingProps {
  pet_owner_name: string;
  service: string;
  pets: PetProps[];
  address: string;
  phone_number: string;
  email: string;
  check_in_date: string;
  check_out_date: string;
  user_id: string;
  raw_pet_data: PetProps[];
}
export { PetProps };

