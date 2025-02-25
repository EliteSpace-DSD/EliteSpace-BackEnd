import { db } from '../index';
import { eq, and } from 'drizzle-orm';
import { smartLockers, SmartLockerInsertType } from '../schema';

export const createSmartLocker = async (smartLocker: SmartLockerInsertType) => {
    try {
        const result = await db.insert(smartLockers).values(smartLocker).returning();
        return result[0];
    } catch (error) {
        return null;
    }
};

export const getSmartLockerById = async (id: string) => {
    try {
        const result = await db.select().from(smartLockers).where(eq(smartLockers.id, id));
        return result[0];
    } catch (error) {
        return null;
    }
};

export const getOpenSmartLocker = async () => {
    try {
        const result = await db.query.smartLockers.findFirst({
            where: eq(smartLockers.isOccupied, false),
            columns: {
                id: true,
                lockerNumber: true
            }
        });
        return result;
    } catch (error) {
        return null;
    }
};

export const getAllOpenSmartLockers = async () => {
    try {
        const result = await db.query.smartLockers.findMany({
            where: eq(smartLockers.isOccupied, false),
            columns: {
                id: true,
                lockerNumber: true
            }
        });
        return result || [];
    } catch (error) {
        return [];
    }
};

export const updateSmartLockerStatus = async (id: string, isOccupied: boolean) => {
    try {
        const result = await db.update(smartLockers).set({ isOccupied }).where(eq(smartLockers.id, id));
        return result[0];
    } catch (error) {
        return null;
    }
};

export const deleteSmartLocker = async (id: string) => {
    try {
        const result = await db.delete(smartLockers).where(eq(smartLockers.id, id));
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
};