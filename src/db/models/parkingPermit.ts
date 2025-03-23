import { db } from "../index";
import { eq } from "drizzle-orm";
import { parkingPermits, ParkingPermitInsertType, parkingSpaces } from "../schema";

export const createParkingPermit = async (parkingPermit: ParkingPermitInsertType) => {
  try {
    const result = await db.insert(parkingPermits).values(parkingPermit).returning();
    return result[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAllParkingSpaces = async () => {
  try {
    const results = await db
      .select({
        parking_space: parkingSpaces.parkingSpace,
        status: parkingSpaces.status,
      })
      .from(parkingSpaces)
      .orderBy(parkingSpaces.parkingSpace);
    return results;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getParkingPermitByTenantId = async (tenantId: string) => {
  try {
    const result = await db.select().from(parkingPermits).where(eq(parkingPermits.tenantId, tenantId));
    return result[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const extendParkingPermit = async (id: string, expiresAt: Date) => {
  try {
    const result = await db.update(parkingPermits).set({ expiresAt }).where(eq(parkingPermits.id, id));
    return result[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteParkingPermit = async (id: string) => {
  try {
    const result = await db.delete(parkingPermits).where(eq(parkingPermits.id, id));
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};
