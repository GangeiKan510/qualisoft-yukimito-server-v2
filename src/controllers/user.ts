import { UserProps } from '../types/user';
import prisma from './db';

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const createUser = async (body: UserProps) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        email: body.email,
      },
    });

    return newUser;
  } catch (error: any) {
    throw new Error(`Failed to create user: ${error.message || error}`);
  }
};

export const updateUser = async (
  email: string,
  updateData: Partial<UserProps>
) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        name: updateData.name,
        phone: updateData.phone,
        address: updateData.address,
        updatedAt: new Date(),
      },
    });

    return updatedUser;
  } catch (error: any) {
    console.error('Error updating user:', error);
    throw new Error(`Failed to update user: ${error.message || error}`);
  }
};
