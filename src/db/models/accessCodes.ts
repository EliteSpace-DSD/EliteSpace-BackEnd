import { db } from '../index';
import { eq } from 'drizzle-orm';
import { accessCodes, AccessCodeInsertType } from '../schema';

export const createAccessCode = async (accessCode: AccessCodeInsertType) => {
    try {
        const result = await db.insert(accessCodes).values(accessCode).returning();
        return result[0];
    } catch (error) {
        return null;
    }
};

export const getAccessCodesByTenantId = async (tenantId: string) => {
    try {
        const result = await db.select().from(accessCodes).where(eq(accessCodes.tenantId, tenantId));
        return result || [];
    } catch (error) {
        return [];
    }
};

export const deleteAccessCode = async (accessCodeId: string) => {
    try {
        const result = await db.delete(accessCodes).where(eq(accessCodes.id, accessCodeId)).returning();
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
};

export const deactivateAccessCode = async (accessCodeId: string) => {
    try {
        const result = await db.update(accessCodes)
            .set({ isActive: false })
            .where(eq(accessCodes.id, accessCodeId))
            .returning();
        return result[0];
    } catch (error) {
        return null;
    }
};