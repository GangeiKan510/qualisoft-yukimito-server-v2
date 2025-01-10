import { UserProps } from '../types/user';
import prisma from './db';
import admin from 'firebase-admin';

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: { pets: true, bookings: true },
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

export const deleteUser = async (userId: string) => {
  try {
    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
      include: { pets: true, bookings: true },
    });

    if (!userToDelete) {
      throw new Error('User not found');
    }

    const firebaseUser = await admin.auth().getUserByEmail(userToDelete.email);
    await admin.auth().deleteUser(firebaseUser.uid);
    console.log(`Firebase account deleted for user: ${userToDelete.email}`);

    if (userToDelete.pets.length > 0) {
      await prisma.pet.deleteMany({
        where: { userId: userId },
      });
      console.log(
        `Deleted ${userToDelete.pets.length} pets for user ${userToDelete.email}`
      );
    }

    if (userToDelete.bookings.length > 0) {
      await prisma.booking.deleteMany({
        where: { user_id: userId },
      });
      console.log(
        `Deleted ${userToDelete.bookings.length} bookings for user ${userToDelete.email}`
      );
    }

    await prisma.user.delete({
      where: { id: userId },
    });
    console.log(`Database entry deleted for user: ${userToDelete.email}`);

    return { message: 'User deleted successfully' };
  } catch (error: any) {
    console.error('Error deleting user:', error);
    throw new Error(`Failed to delete user: ${error.message || error}`);
  }
};
