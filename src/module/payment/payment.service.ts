import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { PaymentProvider } from "../../../generated/prisma/client";

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

    currency: "usd",

    automatic_payment_methods: {
      enabled: true,
    },
  });

  const payment = await prisma.payment.create({
    data: {
      rentalOrderId: rental.id,

      amount: rental.totalAmount,

      method: "CARD",

      provider: PaymentProvider.STRIPE,

      transactionId: paymentIntent.id,

      status: "PENDING",
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,

    payment,
  };
};

export const PaymentService = {
  createPaymentIntent,
};
