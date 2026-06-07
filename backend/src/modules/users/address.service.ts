import prisma from "../../config/db.js";
import ApiError from "../../shared/exceptions/apiError.js";
import type { CreateAddressInput, UpdateAddressInput } from "./address.validation.js";

// Create a new shipping/billing address for user
export const createUserAddress = async (userId: string, data: CreateAddressInput) => {
  // Check if user exists
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists) {
    throw new ApiError(404, "User account not found");
  }

  // If isDefault is true, reset all other user addresses to isDefault: false
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    });
  } else {
    // If this is the user's very first address, force it to be default
    const addressCount = await prisma.address.count({ where: { userId } });
    if (addressCount === 0) {
      data.isDefault = true;
    }
  }

  return prisma.address.create({
    data: {
      userId,
      line1: data.line1,
      line2: data.line2 ?? null,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      countryCode: data.countryCode,
      isDefault: data.isDefault ?? false
    }
  });
};

// Retrieve all addresses belonging to the authenticated user
export const getUserAddresses = async (userId: string) => {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
};

// Get a specific address by ID, verifying user ownership
export const getAddressById = async (id: string, userId: string) => {
  const address = await prisma.address.findUnique({ where: { id } });
  if (!address) {
    throw new ApiError(404, "Address not found");
  }
  if (address.userId !== userId) {
    throw new ApiError(403, "Forbidden: Access denied to other users' address books");
  }
  return address;
};

// Update an address, resetting others if marked as default
export const updateUserAddress = async (id: string, userId: string, data: UpdateAddressInput) => {
  // Verify ownership
  const existing = await getAddressById(id, userId);

  // If isDefault is changing to true, reset others
  if (data.isDefault === true) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    });
  } else if (data.isDefault === false && existing.isDefault) {
    // If trying to set default to false but it is the default, prevent it unless there's only one address
    const totalAddresses = await prisma.address.count({ where: { userId } });
    if (totalAddresses > 1) {
      throw new ApiError(400, "Cannot unset default address. Set another address as default instead.");
    }
  }

  // Map updates safely to avoid exactOptionalPropertyTypes mismatches
  const updateData: Record<string, any> = {};
  if (data.line1 !== undefined) updateData.line1 = data.line1;
  if (data.line2 !== undefined) updateData.line2 = data.line2 ?? null;
  if (data.city !== undefined) updateData.city = data.city;
  if (data.state !== undefined) updateData.state = data.state;
  if (data.zipCode !== undefined) updateData.zipCode = data.zipCode;
  if (data.countryCode !== undefined) updateData.countryCode = data.countryCode;
  if (data.isDefault !== undefined) updateData.isDefault = data.isDefault;

  return prisma.address.update({
    where: { id },
    data: updateData
  });
};

// Delete an address, auto-promoting the next sibling to default if deleted was default
export const deleteUserAddress = async (id: string, userId: string) => {
  // Verify ownership
  const addressToDelete = await getAddressById(id, userId);

  const deleted = await prisma.address.delete({
    where: { id }
  });

  // Safeguard: If the deleted address was default, promote the next sibling to default
  if (addressToDelete.isDefault) {
    const nextAddress = await prisma.address.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
    if (nextAddress) {
      await prisma.address.update({
        where: { id: nextAddress.id },
        data: { isDefault: true }
      });
    }
  }

  return deleted;
};
