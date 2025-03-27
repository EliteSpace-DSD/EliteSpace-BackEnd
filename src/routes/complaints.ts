/**
 * Issuetype is deprecaited, remains due to DB needing specific column
 */

import express, { Request, Response } from "express";
import { runGemini } from "../ai/gemini";
import { createComplaint, getAllComplaints } from "../db/models/complaint";
const router = express.Router();

type ComplaintCategory =
  | "noise"
  | "maintenance"
  | "building_issues"
  | "neighbor_disputes"
  | "package_issues"
  | "other";
interface Complaint {
  complaintCategory: ComplaintCategory;
  complaintTitle: string;
  issueType: "other";
  description: string;
  priority: string;
  img?: string;
}
router.post("/submit-complaint", async (req: Request, res: Response) => {
  try {
    const { selectedIssue, extraDetails } = req.body;

    //Pass full object to AI
    let priority = "";
    if (extraDetails === undefined) {
      console.error("Error: extraDetails is undefined");
    } else {
      priority = await runGemini(extraDetails);
    }
    const fullComplaint: Complaint = {
      complaintCategory: selectedIssue.category,
      complaintTitle: selectedIssue.subCategory,
      issueType: "other",
      description: extraDetails,
      priority,
    };
    console.log(fullComplaint);
    const complaint = await createComplaint(fullComplaint);
    res.status(200).json({
      message: "Complaint submitted in successfully",
      complaint: fullComplaint,
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error processing complaint:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/get-complaints", async (req: Request, res: Response) => {
  try {
    const complaints = await getAllComplaints();
    res.status(200).json({ complaints });
  } catch (error) {}
});
export const complaintRoutes = router;
