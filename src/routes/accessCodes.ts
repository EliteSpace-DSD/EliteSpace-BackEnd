import express, { Request, Response } from "express";
import { createAccessCode } from "../db/models/accessCodes";
import { validateAccessCodeRequest } from "../middleware/validateRequest";
import crypto from "crypto";
const router = express.Router();

router.post(
  "/generate",
  validateAccessCodeRequest,
  async (req: Request, res: Response) => {
    const { guestName, timeLimit, tenantId } = req.body;

    try {
      const randomKey = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedCode = crypto
        .createHash("sha256")
        .update(randomKey)
        .digest("hex");

      const accessCode = {
        tenantId,
        type: "guest" as "guest",
        hashedCode,
        expiresAt: new Date(Date.now() + Number(timeLimit) * 60 * 1000),
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
