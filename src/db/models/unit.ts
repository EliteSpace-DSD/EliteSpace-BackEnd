import { db } from '../index';
import { eq } from 'drizzle-orm';
import { units, UnitInsertType, unitTenants } from '../schema';

export const createUnit = async (unit: UnitInsertType) => {
    try {
        const result = await db.insert(units).values(unit).returning();
        return result[0];
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getUnitById = async (unitId: string) => {
    try {
        const result = await db.select().from(units).where(eq(units.id, unitId));
        return result[0];
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const updateUnit = async (unitId: string, updates: Partial<UnitInsertType>) => {
    try {
        const result = await db.update(units).set(updates).where(eq(units.id, unitId)).returning();
        return result[0];
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const deleteUnit = async (unitId: string) => {
    try {
        const result = await db.delete(units).where(eq(units.id, unitId));
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
};