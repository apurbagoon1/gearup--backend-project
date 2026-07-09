import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

const createReview = async (
  customerId: string,
  payload: {
    gearId: string;
    rating: number;
    comment: string;
  },
) => {
  const { gearId, rating, comment } = payload;

  if (!gearId || !comment) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "All fields are required.",
    );
  }

  if (rating < 1 || rating > 5) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rating must be between 1 and 5.",
    );
  }

  const rental = await prisma.rentalOrder.findFirst({
    where: {
      customerId,
      gearId,
      status: "RETURNED",
    },
  });

  if (!rental) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can review only returned rentals.",
    );
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      customerId,
      gearId,
    },
  });

  if (existingReview) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You already reviewed this gear.",
    );
  }

  const review = await prisma.review.create({
    data: {
      customerId,
      gearId,
      rating,
      comment,
    },

    include: {
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return review;
};

export const ReviewService = {
  createReview,
};