import express, { Request, Response } from "express";
import {
  getLockStateByTenantId,
  upsertLockState,
  getTenantLockDetails,
} from "../db/models/locks";

const router = express.Router();

// Get lock state by tenant ID
router.get("/lock-state/:tenantId", async (req: Request, res: Response) => {
  const { tenantId } = req.params;

  try {
    const lockState = await getLockStateByTenantId(tenantId);

    if (!lockState) {
      res
        .status(404)
        .json({ message: "Tenant not found or no lock state available" });
      return;
    }

    res.status(200).json(lockState);
  } catch (error) {
    console.error("Error fetching lock state:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update or insert lock state for a tenant
router.post("/lock-state", async (req: Request, res: Response) => {
  const { tenantId, tenantName, isLocked } = req.body;

  if (typeof isLocked !== "boolean") {
    res.status(400).json({ message: "Invalid isLocked value" });
    return;
  }

  try {
    const updatedLockState = await upsertLockState(
      tenantId,
      tenantName,
      isLocked
    );

    if (!updatedLockState) {
      res.status(500).json({ message: "Failed to update lock state" });
      return;
    }

    res.status(200).json({
      message: "Lock state updated successfully",
      data: updatedLockState,
    });
  } catch (error) {
    console.error("Error updating lock state:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get detailed lock information for a tenant
router.get(
  "/tenant-lock-details/:tenantId",
  async (req: Request, res: Response) => {
    const { tenantId } = req.params;

    try {
      const lockDetails = await getTenantLockDetails(tenantId);

      if (!lockDetails) {
        res
          .status(404)
          .json({ message: "Tenant not found or no lock details available" });
        return;
      }

      res.status(200).json(lockDetails);
    } catch (error) {
      console.error("Error fetching tenant lock details:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
