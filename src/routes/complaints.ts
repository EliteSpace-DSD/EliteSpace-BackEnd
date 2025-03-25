import express, { Request, Response } from "express";
import { runGemini } from "../ai/gemini";
const router = express.Router();

router.post("/submit-complaint", async (req: Request, res: Response) => {
  try {
    console.log("CHECKPOINT 3");
    const { selectedIssue, extraDetails } = req.body;
    console.log(selectedIssue);
    console.log(extraDetails);
    //Pass full object to AI
    const priority = await runGemini(extraDetails);
    console.log("CHECKPOINT 4");
    const fullComplaint = {
      selectedIssue,
      extraDetails,
      priority,
    };
    console.log("Complaint Processed:", fullComplaint);
    //Call AI here
    res.status(200).json({
      message: "Complaint submitted in successfully",
      complaint: fullComplaint,
      statusCode: 200
    });

  } catch (error) {
    console.error("Error processing complaint:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export const complaintRoutes = router;
