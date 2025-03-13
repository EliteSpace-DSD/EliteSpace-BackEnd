import express, { Request, Response } from "express";
import { createAccessCode } from "../db/models/accessCodes";
import { validateAccessCodeRequest } from "../middleware/validateRequest";

const router = express.Router();

router.post(
  "/generate",
  validateAccessCodeRequest,
  async (req: Request, res: Response) => {
    const { guestName, timeLimit } = req.body;

    try {
      const randomKey = Math.floor(100000 + Math.random() * 900000).toString();

      const accessCode = {
        code: randomKey,
        guestName,
        timeLimit,
        isActive: true,
        createdAt: new Date(),
      };

      const result = await createAccessCode(accessCode);

      if (result) {
        res.status(201).json({ accessCode: result });
      } else {
        res.status(500).json({ error: "Failed to create access code" });
      }
    } catch (error) {
      console.error("Error in /generate route:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

export default router;
