import express, { Request, Response } from "express";
const router = express.Router();

router.post("/submit-complaint", async (req: Request, res: Response) => {
  try {
    // const { complaint } = req.body;
    // console.log(complaint);
    console.log("Complaint submitted");
    //Call AI here
    res.status(200).json({ message: "Complaint submitted in successfully" });
  } catch (error) {}
});

export const complaintRoutes = router;
