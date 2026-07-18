import ApiError from "../../shared/exceptions/apiError.js";
import prisma from "../../config/db.js";
import bcrypt from "bcrypt";

export const registerUser = async (
  firstName: string,
  lastName: string | undefined,
  email: string,
  password: string,
  phone: string | undefined,
) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName: lastName ?? null,
      email,
      passwordHash: hashedPassword,
      phone: phone ?? null,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      phone: true,
      isVerified: true,
    },
  });
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: { email, deletedAt: null },
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  if (!user.passwordHash) {
    throw new ApiError(401, "This account uses Google Login. Please sign in with Google.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    phone: user.phone,
    isVerified: user.isVerified,
  };
};

export const logoutUser = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      refreshToken: null,
    },
  });
};

import { getAuth } from "../../config/firebase.js";

export const loginWithGoogle = async (idToken: string) => {
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    
    if (!decodedToken.email) {
      throw new ApiError(400, "Invalid Firebase token: Email is missing");
    }
    
    const email = decodedToken.email;
    const nameParts = decodedToken.name ? decodedToken.name.split(" ") : [];
    const firstName = nameParts.length > 0 ? nameParts[0] : "User";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : null;
    
    let user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      // create a new user
      user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          isVerified: true,
        },
      });
    } else if (user.deletedAt) {
      throw new ApiError(403, "Account is disabled");
    }
    
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone,
      isVerified: user.isVerified,
    };
  } catch (error: any) {
    console.error("Firebase auth error:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, "Authentication failed with Google Firebase");
  }
};
  
