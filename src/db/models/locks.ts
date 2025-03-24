import { db } from "../index";
import { eq } from "drizzle-orm";
import { locks, tenants } from "../schema";

// Fetch lock state by tenant ID
export const getLockStateByTenantId = async (tenantId: string | null) => {
  try {
    let result;

    // Handle the "just a user" case separately
    if (tenantId === "guest") {
      result = await db.query.locks.findFirst({
        where: eq(locks.tenantName, "Not a tenant"), // Query by tenantName for "Not a tenant"
        columns: {
          tenantName: true,
          isLocked: true,
          lockTime: true,
        },
      });

      // If no record is found for "Not a tenant", create a default one
      if (!result) {
        result = await db
          .insert(locks)
          .values({
            tenantId: null, // No tenantId
            tenantName: "Not a tenant", // Set tenantName to "Not a tenant"
            isLocked: true, // Default state is Locked
            lockTime: new Date(),
          })
          .onConflictDoNothing() // Prevent duplicate records
          .returning()
          .then((rows) => rows[0]);

        // Fetch the record again if it was inserted
        if (!result) {
          result = await db.query.locks.findFirst({
            where: eq(locks.tenantName, "Not a tenant"),
            columns: {
              tenantName: true,
              isLocked: true,
              lockTime: true,
            },
          });
        }
      }
    } else if (tenantId) {
      // Handle regular tenantId case
      result = await db.query.locks.findFirst({
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
    }

    return result || null;
  } catch (error) {
    console.error("Error fetching lock state:", error);
    return null;
  }
};

// Update or insert lock state for a tenant
export const upsertLockState = async (
  tenantId: string | null,
  tenantName: string,
  isLocked: boolean
) => {
  try {
    // Set tenantId to null if it's "guest/not logged in"
    const normalizedTenantId = tenantId === "guest" ? null : tenantId;

    // Check for an existing record
    const existingRecord = await db.query.locks.findFirst({
      where: normalizedTenantId
        ? eq(locks.tenantId, normalizedTenantId)
        : eq(locks.tenantName, "Not a tenant"), // Handle null or "guest" tenantId
    });

    if (existingRecord) {
      // Update the existing record
      const result = await db
        .update(locks)
        .set({
          isLocked,
          lockTime: new Date(),
        })
        .where(
          normalizedTenantId
            ? eq(locks.tenantId, normalizedTenantId)
            : eq(locks.tenantName, "Not a tenant")
        ) // Handle null or "guest" tenantId
        .returning();

      return result[0];
    } else {
      // Insert a new record if none exists
      const result = await db
        .insert(locks)
        .values({
          tenantId: normalizedTenantId,
          tenantName: normalizedTenantId ? tenantName : "Not a tenant", // Set tenantName to "Not a tenant" for when no tenantId(not logged in)
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

// Fetch lock details and log tenant information
export const getTenantLockDetails = async (tenantId: string | null) => {
  try {
    // Query the locks table for the tenant's lock details
    const result = await db.query.locks.findFirst({
      where: tenantId
        ? eq(locks.tenantId, tenantId)
        : eq(locks.tenantName, "Not a tenant"), //  null tenantId
      columns: {
        tenantName: true,
        isLocked: true,
        lockTime: true,
      },
    });

    if (!result) {
      console.log(
        `No lock details found for tenantId: ${tenantId || "Not a tenant"}`
      );
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
