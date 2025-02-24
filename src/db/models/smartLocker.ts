import { db } from '../index';
import { eq, and } from 'drizzle-orm';
import { smartLockers, SmartLockerInsertType } from '../schema';

export const createSmartLocker = async (smartLocker: SmartLockerInsertType) => {
    const result = await db.insert(smartLockers).values(smartLocker).returning();
    return result[0];
};

export const getSmartLockerById = async (id: string) => {
    const result = await db.select().from(smartLockers).where(eq(smartLockers.id, id));
    return result[0];
};

export const getOpenSmartLocker = async () => {
    const result = await db.query.smartLockers.findFirst({
        where: eq(smartLockers.isOccupied, false),
        columns: {
            id: true,
            lockerNumber: true
        }
    });
    return result;
};

export const getAllOpenSmartLockers = async () => {
    const result = await db.query.smartLockers.findMany({
        where: eq(smartLockers.isOccupied, false),
        columns: {
            id: true,
            lockerNumber: true
        }
    });
    return result;
};

export const updateSmartLockerStatus = async (id: string, isOccupied: boolean) => {
    const result = await db.update(smartLockers).set({ isOccupied }).where(eq(smartLockers.id, id));
    return result[0];
};

export const deleteSmartLocker = async (id: string) => {
    const result = await db.delete(smartLockers).where(eq(smartLockers.id, id));
    return result[0];
};