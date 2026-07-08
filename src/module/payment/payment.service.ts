import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createPaymentIntent = async (
  customerId: string,
  rentalId: string,
) => {

};

export const PaymentService = {
  createPaymentIntent,
};