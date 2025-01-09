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

export const getUsersWithNonDefaultRole = async () => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          not: 1,
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return users;
  } catch (error) {
    console.error('Error fetching users with non-default role:', error);
    throw new Error('Failed to fetch users');
  }
};
