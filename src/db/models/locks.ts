import { db } from "../index";
import { eq } from "drizzle-orm";
import { locks, tenants } from "../schema";

// Fetch lock state by tenant ID
export const getLockStateByTenantId = async (tenantId: string) => {
  try {
    // Fetch lock state for the tenant
    let result = await db.query.locks.findFirst({
      where: eq(locks.tenantId, tenantId),
      columns: {
        tenantName: true,
        isLocked: true,
        lockTime: true,
      },
    });

    // If no record is found for the tenant, fetch the tenant's firstName and lastName
    if (!result) {
      const tenantRecord = await db.query.tenants.findFirst({
        where: eq(tenants.id, tenantId),
        columns: {
          firstName: true,
          lastName: true,
        },
      });

      if (!tenantRecord) {
        console.error(`No tenant found for tenantId: ${tenantId}`);
        return null;
      }

      // Combine firstName and lastName to form tenantName
      const tenantName = `${tenantRecord.firstName} ${tenantRecord.lastName}`;

      result = await db
        .insert(locks)
        .values({
          tenantId,
          tenantName,
          isLocked: true,
          lockTime: new Date(),
        })
        .returning()
        .then((rows) => rows[0]);
    }

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
    // Check for an existing record
    const existingRecord = await db.query.locks.findFirst({
      where: eq(locks.tenantId, tenantId),
    });

    if (existingRecord) {
      // Update the existing record
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
      // Insert a new record if none exists
      const result = await db
        .insert(locks)
        .values({
          tenantId,
          tenantName,
          isLocked,
          lockTime: new Date(),
        })
        .onConflictDoNothing() // Prevent duplicate records
        .returning();

      return result[0];
    }
  } catch (error) {
    console.error("Error performing upsert operation:", error);
    return null;
  }
};

// Fetch lock details
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
