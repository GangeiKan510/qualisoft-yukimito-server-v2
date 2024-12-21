import prisma from '../db';

export const modifyUserRole = async (userId: string, newRole: number) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  } catch (error) {
    console.error('Error modifying user role:', error);
    throw new Error('Failed to modify user role');
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    if (!deletedUser) {
      throw new Error('User not found');
    }

    return deletedUser;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
};

export const createAdminAccount = async (
  email: string,
  name: string,
  phone: string,
  address: string
) => {
  try {
    const newAdmin = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        address,
        role: 2,
      },
    });

    return newAdmin;
  } catch (error) {
    console.error('Error creating admin account:', error);
    throw new Error('Failed to create admin account');
  }
};
