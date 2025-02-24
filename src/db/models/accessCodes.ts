import { db } from '../index';
import { eq } from 'drizzle-orm';
import { accessCodes, AccessCodeInsertType } from '../schema';

export const createAccessCode = async (accessCode: AccessCodeInsertType) => {
    const result = await db.insert(accessCodes).values(accessCode)
    return result[0];
};

export const getAccessCodesByTenantId = async (tenantId: string) => {
    const result = await db.select().from(accessCodes).where(eq(accessCodes.tenantId, tenantId));
    return result;
};

export const deleteAccessCode = async (accessCodeId: string) => {
    const result = await db.delete(accessCodes).where(eq(accessCodes.id, accessCodeId));
    return result[0];
};

export const deactivateAccessCode = async (accessCodeId: string) => {
    const result = await db.update(accessCodes).set({ isActive: false }).where(eq(accessCodes.id, accessCodeId));
    return result[0];
};