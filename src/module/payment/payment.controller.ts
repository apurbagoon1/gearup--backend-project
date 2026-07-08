import catchAsync from "../../utils/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";
import AppError from "../../errors/AppError";

const createPaymentIntent =
  catchAsync(async (req, res) => {

    const { rentalId } = req.body;

    if (!rentalId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Rental id is required.",
      );
    }

    const result =
      await PaymentService.createPaymentIntent(
        req.user!.userId,
        rentalId,
      );

    sendResponse(res, {

      statusCode: httpStatus.OK,

      success: true,

      message:
        "Payment intent created successfully.",

      data: result,

    });

  });


export const PaymentController = {
  createPaymentIntent,
};