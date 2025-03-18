import express, { Request, Response } from "express";
import { runGemini } from "../ai/gemini";
import { createComplaint } from "../db/models/complaint";
import { requiresAuthentication } from "../middleware/authMiddleware";
const router = express.Router();

router.post(
  "/submit-complaint",
  requiresAuthentication,
  async (req: Request, res: Response) => {
    try {
      const { selectedIssue, extraDetails } = req.body;
      // //Pass full object to AI
      const tenantId = req.user.userId;
      const priority = await runGemini(extraDetails);
      const fullComplaint = {
        issueType: "other" as "other" | "noise",
        description: extraDetails,
        priority: "low" as "low" | "medium" | "high",
        tenantId,
        //add tenantId here
      };
      const submittedComplaint = await createComplaint(fullComplaint);
      console.log("Complaint Processed:", fullComplaint);
      //Call AI here
      res.status(200).json({
        message: "Complaint submitted in successfully",
        complaint: fullComplaint,
      });
    } catch (error) {
      console.error("Error processing complaint:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export const complaintRoutes = router;
