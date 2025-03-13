import { Request, Response, NextFunction } from "express";

export const validateAccessCodeRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { guestName, timeLimit } = req.body;

  if (!guestName || !timeLimit) {
    return res
      .status(400)
      .json({ error: "Guest name and time limit are required" });
  }

  if (isNaN(Number(timeLimit)) || Number(timeLimit) <= 0) {
    return res
      .status(400)
      .json({ error: "Time limit must be a positive number" });
  }

  next();
};
