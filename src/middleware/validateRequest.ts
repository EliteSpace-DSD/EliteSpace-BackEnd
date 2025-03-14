import { Request, Response, NextFunction } from "express";

export const validateAccessCodeRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { guestName, timeLimit } = req.body;

  if (!guestName || !timeLimit) {
    res.status(400).json({ error: "Guest name and time limit are required" });
    return;
  }

  if (isNaN(Number(timeLimit)) || Number(timeLimit) <= 0) {
    res.status(400).json({ error: "Time limit must be a positive number" });
    return;
  }

  next();
};
