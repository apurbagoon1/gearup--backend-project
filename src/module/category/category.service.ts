import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";

const createCategory = async (payload: {
  name: string;
  description?: string;
}) => {
  const { name, description } = payload;

  const existingCategory = await prisma.category.findUnique({
    where: {
      name,
    },
  });

  if (existingCategory) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Category already exists.",
    );
  }

  return prisma.category.create({
    data: {
      name,
      description,
    },
  });
};

const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Category not found.",
    );
  }

  return category;
};

const updateCategory = async (
  id: string,
  payload: {
    name?: string;
    description?: string;
  },
) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Category not found.",
    );
  }

  if (payload.name) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: payload.name,
        NOT: {
          id,
        },
      },
    });

    if (existingCategory) {
      throw new AppError(
        httpStatus.CONFLICT,
        "Category already exists.",
      );
    }
  }

  return prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Category not found.",
    );
  }

  return prisma.category.delete({
    where: {
      id,
    },
  });
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};