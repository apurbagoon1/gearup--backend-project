import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../errors/AppError";

import { ReviewService } from "./review.service";

const createReview = catchAsync(async (req, res) => {
  const { gearId, rating, comment } = req.body;

  if (!gearId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Gear id is required.",
    );
  }

  const result =
    await ReviewService.createReview(
      req.user!.userId,
      {
        gearId,
        rating,
        comment,
      },
    );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review created successfully.",
    data: result,
  });
});

export const ReviewController = {
  createReview,
};