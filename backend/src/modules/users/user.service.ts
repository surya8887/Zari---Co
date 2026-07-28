import prisma from "../../config/db.js";
import ApiError from "../../shared/exceptions/apiError.js";

/**
 * @desc Get all active users with pagination
 * @param {number} page - Current page number
 * @param {number} limit - Number of records per page
 * @returns {Promise<{ users: Array, total: number }>}
 */
export const getAllUsers = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: { deletedAt: null },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where: { deletedAt: null } }),
  ]);

  return { users, total };
};

/**
 * @desc Get a single user by ID
 * @param {string} id - User UUID
 * @returns {Promise<Object>}
 */
export const getUserById = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: { id, deletedAt: null },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export const deleteUserById = async (id: string) => {
  const userExists = await prisma.user.findFirst({
    where: { id, deletedAt: null },
  });

  if (!userExists) {
    throw new ApiError(404, "User not found or already deleted");
  }

  const deletedUser = await prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      deletedAt: true,
    },
  });

  return deletedUser;
};

/**
 * @desc Update a user's role (SuperAdmin only)
 * @param {string} id - User UUID
 * @param {string} role - New role ("user", "admin", "superadmin")
 * @returns {Promise<Object>}
 */
export const updateUserRole = async (id: string, role: string) => {
  const userExists = await prisma.user.findFirst({
    where: { id, deletedAt: null },
  });

  if (!userExists) {
    throw new ApiError(404, "User not found or deleted");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { role: role as any }, // Assuming prisma enum maps from string or we cast to any
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};
