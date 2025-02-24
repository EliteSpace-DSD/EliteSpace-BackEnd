import { db } from '../index';
import { eq } from 'drizzle-orm';
import { units, UnitInsertType, unitTenants } from '../schema';

export const createUnit = async (unit: UnitInsertType) => {
    const result = await db.insert(units).values(unit).returning();
    return result[0];
};

export const getUnitById = async (unitId: string) => {
    const result = await db.select().from(units).where(eq(units.id, unitId));
    return result[0];
};

export const updateUnit = async (unitId: string, updates: Partial<UnitInsertType>) => {
    const result = await db.update(units).set(updates).where(eq(units.id, unitId)).returning();
    return result[0];
};

export const deleteUnit = async (unitId: string) => {
    const result = await db.delete(units).where(eq(units.id, unitId));
    return result[0];
};