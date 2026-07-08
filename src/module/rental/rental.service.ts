import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";

const createRental = async (
  customerId: string,
  payload: {
    gearId: string;
    startDate: string;
    endDate: string;
    quantity: number;
  },
) => {
  const { gearId, startDate, endDate, quantity } = payload;

  if (!gearId || !startDate || !endDate) {
    throw new AppError(httpStatus.BAD_REQUEST, "All fields are required.");
  }

  if (quantity <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Quantity must be greater than zero.",
    );
  }

  const gear = await prisma.gear.findUnique({
    where: {
      id: gearId,
    },
    select:{
        id:true,
        stock:true,
        isAvailable:true,
        pricePerDay:true
    }
  });

  if (!gear) {
    throw new AppError(httpStatus.NOT_FOUND, "Gear not found.");
  }

  if (!gear.isAvailable) {
    throw new AppError(httpStatus.BAD_REQUEST, "Gear is not available.");
  }

  if (quantity > gear.stock) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Requested quantity exceeds available stock.",
    );
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "End date must be after start date.",
    );
  }

  const totalDays = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  const totalAmount = totalDays * quantity * gear.pricePerDay;

  const rental = await prisma.rentalOrder.create({
    data: {
      customerId,
      gearId,
      startDate: start,
      endDate: end,
      quantity,
      totalAmount,
    },
  });

  await prisma.gear.update({
    where: {
      id: gear.id,
    },
    data: {
      stock: {
        decrement: quantity,
      },
    },
  });

  const remainingStock = gear.stock - quantity;

  if (remainingStock === 0) {
    await prisma.gear.update({
      where: {
        id: gear.id,
      },
      data: {
        isAvailable: false,
      },
    });
  }

  return rental;
};

const getMyRentals = async (customerId: string) => {
  return prisma.rentalOrder.findMany({
    where: {
      customerId,
    },

    include: {
      gear: true,
      payment: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

const getRentalById = async (customerId: string, rentalId: string) => {
  const rental = await prisma.rentalOrder.findFirst({
    where: {
      id: rentalId,
      customerId,
    },

    include: {
      gear: true,
      payment: true,
    },
  });

  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental not found.");
  }

  return rental;
};

export const RentalService = {
  createRental,
  getMyRentals,
  getRentalById,
};
