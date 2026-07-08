import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import {
  PaymentProvider,
  PaymentStatus,
  RentalStatus,
} from "../../../generated/prisma/client";

const createPaymentIntent = async (customerId: string, rentalId: string) => {
  const rental = await prisma.rentalOrder.findFirst({
    where: {
      id: rentalId,
      customerId,
    },

    include: {
      payment: true,
    },
  });

  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental not found.");
  }

  if (rental.payment) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment already exists for this rental.",
    );
  }

  if (rental.status !== "CONFIRMED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rental must be confirmed before payment.",
    );
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(rental.totalAmount * 100),

    currency: "bdt",

    metadata: {
      rentalId,
      customerId,
    },
  });

  const payment = await prisma.payment.create({
    data: {
      rentalOrderId: rental.id,

      amount: rental.totalAmount,

      method: "CARD",

      provider: PaymentProvider.STRIPE,

      transactionId: paymentIntent.id,

      status: PaymentStatus.PENDING,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,

    payment,
  };
};

const confirmPayment = async (customerId: string, paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },

    include: {
      rentalOrder: true,
    },
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found.");
  }

  if (payment.rentalOrder.customerId !== customerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to confirm this payment.",
    );
  }

  if (payment.status === PaymentStatus.COMPLETED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment already completed.");
  }

  if (payment.rentalOrder.status !== RentalStatus.CONFIRMED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rental is not ready for payment.",
    );
  }

  return prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: {
        id: payment.id,
      },

      data: {
        status: PaymentStatus.COMPLETED,

        paidAt: new Date(),
      },
    });

    await tx.rentalOrder.update({
      where: {
        id: payment.rentalOrderId,
      },

      data: {
        status: RentalStatus.PAID,
      },
    });

    return updatedPayment;
  });
};

export const PaymentService = {
  createPaymentIntent,
  confirmPayment,
};
