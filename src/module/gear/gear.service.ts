import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";

const createGear = async (
  providerId: string,
  payload: {
    title: string;
    description: string;
    brand: string;
    image: string;
    pricePerDay: number;
    stock: number;
    categoryId: string;
  },
) => {
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
      ...payload,
      providerId,
    },
  });

  return gear;
};

const getAllGear = async (query: {
  search?: string;
  category?: string;
  brand?: string;
}) => {
  const { search, category, brand } = query;

  return prisma.gear.findMany({
    where: {
      AND: [
        search
          ? {
              title: {
                contains: search,
                mode: "insensitive",
              },
            }
          : {},

        category
          ? {
              category: {
                name: category,
              },
            }
          : {},

        brand
          ? {
              brand: {
                equals: brand,
                mode: "insensitive",
              },
            }
          : {},
      ],
    },

    include: {
      provider: {
        select: {
          id: true,
          name: true,
        },
      },

      category: true,
    },
  });
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

export const GearService = {
  createGear,
  getAllGear,
  getGearById,
};
