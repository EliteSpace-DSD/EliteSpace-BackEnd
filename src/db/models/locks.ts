import { db } from "../index";
import { eq } from "drizzle-orm";
import { locks } from "../schema";

// Fetch lock state by tenant ID
export const getLockStateByTenantId = async (tenantId: string) => {
  try {
    const result = await db.query.locks.findFirst({
      where: eq(locks.tenantId, tenantId),
      columns: {
        tenantName: true,
        isLocked: true,
        lockTime: true,
      },
    });

    return result || null;
  } catch (error) {
    console.error("Error fetching lock state:", error);
    return null;
  }
};

// Update or insert lock state for a tenant
export const upsertLockState = async (
  tenantId: string,
  tenantName: string,
  isLocked: boolean
) => {
  try {
    const existingRecord = await db.query.locks.findFirst({
      where: eq(locks.tenantId, tenantId),
    });

    if (existingRecord) {
      const result = await db
        .update(locks)
        .set({
          isLocked,
          lockTime: new Date(),
        })
        .where(eq(locks.tenantId, tenantId))
        .returning();

      return result[0];
    } else {
      const result = await db
        .insert(locks)
        .values({
          tenantId,
          tenantName,
          isLocked,
          lockTime: new Date(),
        })
        .returning();

      return result[0];
    }
  } catch (error) {
    console.error("Error performing upsert operation:", error);
    return null;
  }
};

// Fetch lock details and log tenant information
export const getTenantLockDetails = async (tenantId: string) => {
  try {
    // Query the locks table for the tenant's lock details
    const result = await db.query.locks.findFirst({
      where: eq(locks.tenantId, tenantId),
      columns: {
        tenantName: true,
        isLocked: true,
        lockTime: true,
      },
    });

    if (!result) {
      console.log(`No lock details found for tenantId: ${tenantId}`);
      return null;
    }

    // Log tenant details
    console.log(`Tenant Lock Details:`, {
      tenantName: result.tenantName,
      isLocked: result.isLocked,
      lockStatus: result.isLocked ? "Locked" : "Unlocked",
      lockTime: result.lockTime,
    });

    return {
      tenantName: result.tenantName,
      isLocked: result.isLocked,
      lockStatus: result.isLocked ? "Locked" : "Unlocked",
      lockTime: result.lockTime,
    };
  } catch (error) {
    console.error("Error fetching tenant lock details:", error);
    return null;
  }
};
