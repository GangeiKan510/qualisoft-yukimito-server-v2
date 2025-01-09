import prisma from '../db';
import { Vaccine } from '../../types/vaccine';

export const createVaccine = async (vaccineData: Vaccine) => {
  try {
    const newVaccine = await prisma.vaccine.create({
      data: {
        name: vaccineData.name,
        manufacturer: vaccineData.manufacturer,
        batch_number: vaccineData.batch_number,
        expiry_date: vaccineData.expiry_date,
        date_administered: vaccineData.date_administered,
      },
    });

    return newVaccine;
  } catch (error: any) {
    console.error('Error creating vaccine:', error);
    throw new Error(`Failed to create vaccine: ${error.message || error}`);
  }
};

export const getAllVaccines = async () => {
  try {
    const vaccines = await prisma.vaccine.findMany();
    return vaccines;
  } catch (error: any) {
    console.error('Error fetching vaccines:', error);
    throw new Error(`Failed to fetch vaccines: ${error.message || error}`);
  }
};

export const updateVaccineById = async (
  vaccineId: string,
  vaccineData: Partial<Vaccine>
) => {
  try {
    const updateData: Partial<Vaccine> = {
      name: vaccineData.name,
      manufacturer: vaccineData.manufacturer,
      batch_number: vaccineData.batch_number,
      expiry_date: vaccineData.expiry_date,
      date_administered: vaccineData.date_administered,
    };

    Object.keys(updateData).forEach(
      (key) =>
        updateData[key as keyof Vaccine] === undefined &&
        delete updateData[key as keyof Vaccine]
    );

    const updatedVaccine = await prisma.vaccine.update({
      where: { id: vaccineId },
      data: updateData,
    });

    return updatedVaccine;
  } catch (error: any) {
    console.error('Error updating vaccine:', error);
    throw new Error(`Failed to update vaccine: ${error.message || error}`);
  }
};

export const deleteVaccineById = async (vaccineId: string) => {
  try {
    const deletedVaccine = await prisma.vaccine.delete({
      where: { id: vaccineId },
    });

    return deletedVaccine;
  } catch (error: any) {
    console.error('Error deleting vaccine:', error);
    throw new Error(`Failed to delete vaccine: ${error.message || error}`);
  }
};
