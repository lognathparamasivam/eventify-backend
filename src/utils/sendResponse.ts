import { Request, Response } from "express";
import { ErrorResponse } from "./ErrorResponse";


export const sendSuccess = (
  req: Request,
  res: Response,
  data?: object | null,
  count?: number
) => {
  return res.status(200).json({
    success: true,
    count: count,
    data: data,
  });
};


export const sendError = (req: Request, res: Response,error: ErrorResponse) => {
  return res.status(error.status).json({
    success: false,
    error: {
      error: true,
      message: error.message,
      path: req.baseUrl,
    },
  });
};
