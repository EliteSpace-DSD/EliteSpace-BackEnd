import { db } from '../index';
import { eq } from 'drizzle-orm';
import { parkingPermits, ParkingPermitInsertType } from '../schema';

export const createParkingPermit = async (parkingPermit: ParkingPermitInsertType) => {
    const result = await db.insert(parkingPermits).values(parkingPermit).returning();
    return result[0];
};

export const getParkingPermitByTenantId = async (tenantId: string) => {
    const result = await db.select().from(parkingPermits).where(eq(parkingPermits.tenantId, tenantId));
    return result[0];
};

export const extendParkingPermit = async (id: string, expiresAt: Date) => {
    const result = await db.update(parkingPermits).set({ expiresAt }).where(eq(parkingPermits.id, id));
    return result[0];
};

export const deleteParkingPermit = async (id: string) => {
    const result = await db.delete(parkingPermits).where(eq(parkingPermits.id, id));
    return result[0];
};