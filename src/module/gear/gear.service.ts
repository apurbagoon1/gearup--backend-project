import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import { validateGearAvailability } from "../../utils/gearAvailability";

const createGear = async (
  providerId: string,
  payload: {
    title: string;
    description: string;
    brand: string;
    image: string[];
    pricePerDay: number;
    stock: number;
    categoryId: string;
  },
) => {
  const { stock, pricePerDay } = payload;

  if (stock < 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Stock cannot be negative.");
  }

  if (pricePerDay <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Price per day must be greater than zero.",
    );
  }

  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found.");
  }

  const gear = await prisma.gear.create({
    data: {
      title: payload.title,
      description: payload.description,
      brand: payload.brand,
      image: payload.image,
      pricePerDay: payload.pricePerDay,
      stock: payload.stock,

      providerId,

      categoryId: payload.categoryId,

      isAvailable: validateGearAvailability(stock),
    },
  });

  return gear;
};

const getAllGear = async (query: {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  isAvailable?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}) => {
  const {
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    isAvailable,
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const currentPage = Number(page);
  const perPage = Number(limit);

  const skip = (currentPage - 1) * perPage;

  const allowedSortFields = ["title", "pricePerDay", "createdAt", "stock"];

  const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

  const where: any = {
    AND: [],
  };

  if (search) {
    where.AND.push({
      title: {
        contains: search,
        mode: "insensitive",
      },
    });
  }

  if (category) {
    where.AND.push({
      category: {
        name: category,
      },
    });
  }

  if (brand) {
    where.AND.push({
      brand: {
        equals: brand,
        mode: "insensitive",
      },
    });
  }

  if (isAvailable !== undefined) {
    where.AND.push({
      isAvailable: isAvailable === "true",
    });
  }

  if (minPrice || maxPrice) {
    where.AND.push({
      pricePerDay: {
        gte: minPrice ? Number(minPrice) : undefined,
        lte: maxPrice ? Number(maxPrice) : undefined,
      },
    });
  }

  const [gears, total] = await Promise.all([
    prisma.gear.findMany({
      where,

      include: {
        provider: {
          select: {
            id: true,
            name: true,
          },
        },

        category: true,
      },

      skip,

      take: perPage,

      orderBy: {
        [finalSortBy]: sortOrder === "asc" ? "asc" : "desc",
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

    data: gears,
  };
};

const getGearById = async (id: string) => {
  const gear = await prisma.gear.findUnique({
    where: {
      id,
    },

    include: {
      provider: {
        select: {
          id: true,
          name: true,
        },
      },

      category: true,

      reviews: {
        include: {
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!gear) {
    throw new AppError(httpStatus.NOT_FOUND, "Gear not found.");
  }

  return gear;
};

const updateGear = async (
  providerId: string,
  gearId: string,
  payload: {
    title?: string;
    description?: string;
    brand?: string;
    image?: string[];
    pricePerDay?: number;
    stock?: number;
    categoryId?: string;
  },
) => {
  const gear = await prisma.gear.findUnique({
    where: {
      id: gearId,
    },
  });

  if (!gear) {
    throw new AppError(httpStatus.NOT_FOUND, "Gear not found.");
  }

  if (gear.providerId !== providerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to update this gear.",
    );
  }

  if (payload.stock !== undefined && payload.stock < 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Stock cannot be negative.");
  }

  if (payload.pricePerDay !== undefined && payload.pricePerDay <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Price per day must be greater than zero.",
    );
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
      },
    });

    if (!category) {
      throw new AppError(httpStatus.NOT_FOUND, "Category not found.");
    }
  }

  let isAvailable = gear.isAvailable;

  if (payload.stock !== undefined) {
    isAvailable = validateGearAvailability(payload.stock);
  }

  const updatedGear = await prisma.gear.update({
    where: {
      id: gearId,
    },

    data: {
      title: payload.title,
      description: payload.description,
      brand: payload.brand,
      image: payload.image,
      pricePerDay: payload.pricePerDay,
      stock: payload.stock,

      ...(payload.categoryId && {
        categoryId: payload.categoryId,
      }),

      isAvailable,
    },
  });

  return updatedGear;
};

const deleteGear = async (providerId: string, gearId: string) => {
  const gear = await prisma.gear.findUnique({
    where: {
      id: gearId,
    },
  });

  if (!gear) {
    throw new AppError(httpStatus.NOT_FOUND, "Gear not found.");
  }

  if (gear.providerId !== providerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to delete this gear.",
    );
  }

  await prisma.gear.delete({
    where: {
      id: gearId,
    },
  });

  return null;
};

export const GearService = {
  createGear,
  getAllGear,
  getGearById,
  updateGear,
  deleteGear,
};
