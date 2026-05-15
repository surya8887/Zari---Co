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
