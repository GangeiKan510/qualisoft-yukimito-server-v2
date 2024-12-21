import prisma from '../db';

export const getAllPets = async () => {
  try {
    const pets = await prisma.pet.findMany({
      include: { User: true, Booking: true },
    });
    return pets;
  } catch (error) {
    console.error('Error fetching pets:', error);
    throw new Error('Failed to fetch pets');
  }
};

export const updatePetDetails = async (
  petId: string,
  updateData: Partial<{
    name: string;
    breed: string;
    birth_date: string;
    size: string;
    vaccine_photo: string;
  }>
) => {
  try {
    const updatedPet = await prisma.pet.update({
      where: { id: petId },
      data: updateData,
    });

    if (!updatedPet) {
      throw new Error('Pet not found');
    }

    return updatedPet;
  } catch (error) {
    console.error('Error updating pet:', error);
    throw new Error('Failed to update pet');
  }
};

export const markPetAsVaccinated = async (petId: string) => {
  try {
    const updatedPet = await prisma.pet.update({
      where: { id: petId },
      data: { is_vaccinated: true },
    });

    if (!updatedPet) {
      throw new Error('Pet not found');
    }

    return updatedPet;
  } catch (error) {
    console.error('Error marking pet as vaccinated:', error);
    throw new Error('Failed to mark pet as vaccinated');
  }
};

export const deletePet = async (petId: string) => {
  try {
    const deletedPet = await prisma.pet.delete({
      where: { id: petId },
    });

    if (!deletedPet) {
      throw new Error('Pet not found');
    }

    return deletedPet;
  } catch (error) {
    console.error('Error deleting pet:', error);
    throw new Error('Failed to delete pet');
  }
};
