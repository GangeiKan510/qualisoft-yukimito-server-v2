import prisma from './db';
import { PetProps } from '../types/pet';

export const createPet = async (userId: string, petData: PetProps) => {
  try {
    const newPet = await prisma.pet.create({
      data: {
        name: petData.name,
        breed: petData.breed,
        birth_date: petData.birth_date,
        size: petData.size,
        vaccine_photo: petData.vaccine_photo || '',
        userId: userId,
      },
    });

    return newPet;
  } catch (error: any) {
    console.error('Error creating pet:', error);
    throw new Error(`Failed to create pet: ${error.message || error}`);
  }
};

export const getAllPetsByUserId = async (userId: string) => {
  try {
    const pets = await prisma.pet.findMany({
      where: {
        userId: userId,
      },
    });

    return pets;
  } catch (error: any) {
    console.error('Error fetching pets:', error);
    throw new Error(`Failed to fetch pets: ${error.message || error}`);
  }
};

export const deletePetById = async (petId: string) => {
  try {
    const deletedPet = await prisma.pet.delete({
      where: {
        id: petId,
      },
    });

    return deletedPet;
  } catch (error: any) {
    console.error('Error deleting pet:', error);
    throw new Error(`Failed to delete pet: ${error.message || error}`);
  }
};
