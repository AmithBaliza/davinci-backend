import { Prisma } from "@prisma/client";
import prisma from "../../config/database";
import { firebaseAuth } from "../../config/firebase";
import logger from "../../config/logger";
import cacheService from "../../services/cache.service";

export const createUser = async (data: Prisma.UserCreateInput) => {
  // Invalidate user caches when creating new user
  await cacheService.invalidatePattern("users:*");

  return prisma.user.create({
    data,
  });
};

export const getUsers = async (filters?: {
  role?: string;
  language?: string;
  gender?: string;
  isPrivacyPolicyEnabled?: boolean;
  ambientMusic?: boolean;
  communicationEnabled?: boolean;
  limit?: number;
  offset?: number;
}) => {
  // Create cache key based on filters
  const cacheKey = `users:list:${JSON.stringify(filters || {})}`;

  return cacheService.withCache(
    cacheKey,
    async () => {
      const where: Prisma.UserWhereInput = {};

      if (filters?.role) {
        where.role = filters.role as any;
      }
      if (filters?.language) {
        where.language = filters.language as any;
      }
      if (filters?.gender) {
        where.gender = filters.gender as any;
      }
      if (filters?.isPrivacyPolicyEnabled !== undefined) {
        where.isPrivacyPolicyEnabled = filters.isPrivacyPolicyEnabled;
      }
      if (filters?.ambientMusic !== undefined) {
        where.ambientMusic = filters.ambientMusic;
      }
      if (filters?.communicationEnabled !== undefined) {
        where.communicationEnabled = filters.communicationEnabled;
      }

      return prisma.user.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        take: filters?.limit || 100,
        skip: filters?.offset || 0,
      });
    },
    600, // Cache for 10 minutes (user lists change frequently)
  );
};

export const getUserById = async (id: string) => {
  const cacheKey = `user:id:${id}`;

  return cacheService.withCache(
    cacheKey,
    async () => {
      return prisma.user.findUnique({
        where: { id },
      });
    },
    1800, // Cache for 30 minutes
  );
};

export const getUserByFirebaseUid = async (firebaseUid: string) => {
  const cacheKey = `user:firebase:${firebaseUid}`;

  return cacheService.withCache(
    cacheKey,
    async () => {
      return prisma.user.findUnique({
        where: { firebaseUid },
      });
    },
    3600, // Cache for 1 hour (critical for authentication performance)
  );
};

export const getUserByEmail = async (email: string) => {
  return prisma.user.findFirst({
    where: { email },
  });
};

export const updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
  // Invalidate user caches
  await cacheService.del(`user:id:${id}`);
  await cacheService.invalidatePattern("users:list:*");

  return prisma.user.update({
    where: { id },
    data,
  });
};

export const updateUserByFirebaseUid = async (
  firebaseUid: string,
  data: Prisma.UserUpdateInput,
) => {
  // Invalidate user caches
  await cacheService.del(`user:firebase:${firebaseUid}`);
  await cacheService.invalidatePattern("users:list:*");

  return prisma.user.update({
    where: { firebaseUid },
    data,
  });
};

export const deleteUser = async (id: string) => {
  // Invalidate user caches
  await cacheService.del(`user:id:${id}`);
  await cacheService.invalidatePattern("users:list:*");

  return prisma.user.delete({ where: { id } });
};

export const deleteUserByFirebaseUid = async (firebaseUid: string) => {
  // Invalidate user caches
  await cacheService.del(`user:firebase:${firebaseUid}`);
  await cacheService.invalidatePattern("users:list:*");

  return prisma.user.delete({ where: { firebaseUid } });
};

// Sync user data from Firebase to local database
export const syncUserFromFirebase = async (firebaseUid: string) => {
  try {
    // Get user data from Firebase
    const firebaseUser = await firebaseAuth.getUser(firebaseUid);

    // Check if user already exists in our database
    let user = await getUserByFirebaseUid(firebaseUid);

    if (user) {
      // Update existing user with latest Firebase data
      user = await updateUserByFirebaseUid(firebaseUid, {
        email: firebaseUser.email || user.email,
        name: firebaseUser.displayName || user.name,
      });
      logger.info(`User synced from Firebase: ${firebaseUid}`);
    } else {
      // Create new user from Firebase data
      user = await createUser({
        id: firebaseUid,
        firebaseUid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        // Set defaults for other fields
        ambientMusic: true,
        communicationEnabled: true,
        isPrivacyPolicyEnabled: false,
        language: "en",
        role: "USER",
        notificationCount: 0,
      });
      logger.info(`New user created from Firebase: ${firebaseUid}`);
    }

    return user;
  } catch (error) {
    logger.error(`Failed to sync user from Firebase: ${firebaseUid}`, error);
    throw error;
  }
};

// Get user statistics
export const getUserStats = async () => {
  const [totalUsers, activeUsers, usersByRole, usersByLanguage] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          communicationEnabled: true,
        },
      }),
      prisma.user.groupBy({
        by: ["role"],
        _count: {
          role: true,
        },
      }),
      prisma.user.groupBy({
        by: ["language"],
        _count: {
          language: true,
        },
      }),
    ]);

  return {
    totalUsers,
    activeUsers,
    usersByRole: usersByRole.reduce((acc, item) => {
      acc[item.role] = item._count.role;
      return acc;
    }, {} as Record<string, number>),
    usersByLanguage: usersByLanguage.reduce((acc, item) => {
      acc[item.language] = item._count.language;
      return acc;
    }, {} as Record<string, number>),
  };
};

// Increment notification count
export const incrementNotificationCount = async (firebaseUid: string) => {
  return prisma.user.update({
    where: { firebaseUid },
    data: {
      notificationCount: {
        increment: 1,
      },
    },
  });
};

// Reset notification count
export const resetNotificationCount = async (firebaseUid: string) => {
  return prisma.user.update({
    where: { firebaseUid },
    data: {
      notificationCount: 0,
    },
  });
};
