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
      // const tenantId = req.tenant
      // //Pass full object to AI
      console.log(selectedIssue, extraDetails);
      const priority = await runGemini(extraDetails, selectedIssue);
      console.log("Priority:", priority);
      const fullComplaint = {
        issueType: "other" as "other" | "noise",
        description: extraDetails,
        priority: priority as "low" | "medium" | "high",
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
