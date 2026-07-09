import httpStatus from "http-status";

import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

import { UserStatus } from "../../../generated/prisma/client";

const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      photo: true,
      createdAt: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateUserStatus = async (
  userId: string,
  status: UserStatus,
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found.",
    );
  }

  return prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      status,
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });
};

const getAllGear = async (query: {
  page?: string;
  limit?: string;
  category?: string;
}) => {
  const {
    page = "1",
    limit = "10",
    category,
  } = query;

  const currentPage = Number(page);
  const perPage = Number(limit);

  const skip = (currentPage - 1) * perPage;

  const where: any = {};

  if (category) {
    where.category = {
      name: category,
    };
  }

  const [gear, total] = await Promise.all([
    prisma.gear.findMany({
      where,

      include: {
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        category: true,
      },

      skip,

      take: perPage,

      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.gear.count({
      where,
    }),
  ]);

  return {
    meta: {
      page: currentPage,
      limit: perPage,
      total,
      totalPage: Math.ceil(total / perPage),
    },

    data: gear,
  };
};

const getAllRentals = async (query: {
  page?: string;
  limit?: string;
  status?: string;
}) => {
  const {
    page = "1",
    limit = "10",
    status,
  } = query;

  const currentPage = Number(page);
  const perPage = Number(limit);

  const skip = (currentPage - 1) * perPage;

  const where: any = {};

  if (status) {
    where.status = status;
  }

  const [rentals, total] = await Promise.all([
    prisma.rentalOrder.findMany({
      where,

      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        gear: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },

        payment: true,
      },

      skip,

      take: perPage,

      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.rentalOrder.count({
      where,
    }),
  ]);

  return {
    meta: {
      page: currentPage,
      limit: perPage,
      total,
      totalPage: Math.ceil(total / perPage),
    },

    data: rentals,
  };
};

export const AdminService = {
  getAllUsers,
  updateUserStatus,
  getAllGear,
  getAllRentals,
};