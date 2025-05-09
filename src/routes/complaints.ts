/**
 * Issuetype is deprecaited, remains due to DB needing specific column
 */

import express, { Request, Response } from "express";
import { runGemini, runEscalateComplaints } from "../ai/gemini";
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

type Complaints = {
  id: string;
  tenantId: string | null;
  issueType: string;
  complaintCategory: string;
  complaintTitle: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  resolvedAt: string | null | Date;
  updatedAt: string | Date;
  createdAt: string | Date;
};

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
    //Returns all complaints from DB
    const complaints = await getAllComplaints();
    const stringifyComplaints = JSON.stringify(complaints);
    
    //Send string to AI
    //AI will return a string of updated complaints
    //Turn string to JSON

    const escalatedComplaints = await runEscalateComplaints(
      stringifyComplaints
    );
    res.status(200).json({ complaints: escalatedComplaints });
  } catch (error) {
    console.error("Error getting complaints:", error);
    res.status(500).json({ message: "Server error" });
  }
});
export const complaintRoutes = router;
