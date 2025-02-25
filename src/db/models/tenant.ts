import { db } from '../index';
import { eq } from 'drizzle-orm';
import { tenants, TenantInsertType } from '../schema';

export const createTenant = async (tenant: TenantInsertType) => {
    try {
        const result = await db.insert(tenants).values(tenant).returning();
        return result[0];
    } catch (error) {
        return null;
    }
};

export const getTenantById = async (tenantId: string) => {
    try {
        const result = await db.select().from(tenants).where(eq(tenants.id, tenantId));
        return result[0];
    } catch (error) {
        return null;
    }
};

export const updateTenant = async (tenantId: string, updates: Partial<TenantInsertType>) => {
    try {
        const result = await db.update(tenants)
            .set(updates)
            .where(eq(tenants.id, tenantId))
            .returning();
        return result[0];
    } catch (error) {
        return null;
    }
};

export const deleteTenant = async (tenantId: string) => {
    try {
        const result = await db.delete(tenants).where(eq(tenants.id, tenantId));
        return { success: true };
    } catch (error) {
        return { success: false };
    }
};