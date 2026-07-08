import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import { RentalStatus } from "../../../generated/prisma/client";

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
    select: {
      id: true,
      providerId: true,
      stock: true,
      isAvailable: true,
      pricePerDay: true,
    },
  });

  const start = new Date(startDate);
  const end = new Date(endDate);

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (start < today) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Start date cannot be in the past.",
    );
  }

  if (end <= start) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "End date must be after start date.",
    );
  }

  const existingRental = await prisma.rentalOrder.findFirst({
    where: {
      gearId,

      status: {
        in: ["PLACED", "CONFIRMED", "PAID", "PICKED_UP"],
      },

      OR: [
        {
          startDate: {
            lte: end,
          },

          endDate: {
            gte: start,
          },
        },
      ],
    },
  });

  if (existingRental) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This gear is already booked for the selected dates.",
    );
  }

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

  const totalDays = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  const totalAmount = totalDays * quantity * gear.pricePerDay;

  return prisma.$transaction(async (tx) => {
    const rental = await tx.rentalOrder.create({
      data: {
        customerId,
        gearId,
        startDate: start,
        endDate: end,
        quantity,
        totalAmount,
      },
    });

    const updatedGear = await tx.gear.update({
      where: {
        id: gear.id,
      },

      data: {
        stock: {
          decrement: quantity,
        },
      },
    });

    await tx.gear.update({
      where: {
        id: gear.id,
      },

      data: {
        isAvailable: updatedGear.stock > 0,
      },
    });

    return rental;
  });
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

const updateRentalStatus = async (
  providerId: string,
  rentalId: string,
  status: RentalStatus,
) => {
  const rental = await prisma.rentalOrder.findUnique({
    where: {
      id: rentalId,
    },

    include: {
      gear: true,
    },
  });

  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental not found.");
  }

  if (rental.gear.providerId !== providerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to update this rental.",
    );
  }

  const validTransitions: Record<RentalStatus, RentalStatus[]> = {
    PLACED: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PAID"],
    PAID: ["PICKED_UP"],
    PICKED_UP: ["RETURNED"],
    RETURNED: [],
    CANCELLED: [],
  };

  const allowed = validTransitions[rental.status];

  if (!allowed.includes(status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot change status from ${rental.status} to ${status}.`,
    );
  }

  return prisma.$transaction(async (tx) => {
    const updatedRental = await tx.rentalOrder.update({
      where: {
        id: rentalId,
      },

      data: {
        status,
      },

      include: {
        gear: true,
        payment: true,
      },
    });

    if (status === RentalStatus.CANCELLED || status === RentalStatus.RETURNED) {
      const updatedGear = await tx.gear.update({
        where: {
          id: rental.gearId,
        },

        data: {
          stock: {
            increment: rental.quantity,
          },
        },
      });

      await tx.gear.update({
        where: {
          id: rental.gearId,
        },

        data: {
          isAvailable: updatedGear.stock > 0,
        },
      });
    }

    return updatedRental;
  });
};

export const RentalService = {
  createRental,
  getMyRentals,
  getRentalById,
  updateRentalStatus,
};
