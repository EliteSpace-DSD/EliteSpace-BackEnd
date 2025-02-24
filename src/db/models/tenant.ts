import { db } from '../index';
import { eq } from 'drizzle-orm';
import { tenants, TenantInsertType } from '../schema';

export const createTenant = async (tenant: TenantInsertType) => {
    const result = await db.insert(tenants).values(tenant).returning();
    return result[0];
};

export const getTenantById = async (tenantId: string) => {
    const result = await db.select().from(tenants).where(eq(tenants.id, tenantId));
    return result[0];
};

export const updateTenant = async (tenantId: string, updates: Partial<TenantInsertType>) => {
    const result = await db.update(tenants)
        .set(updates)
        .where(eq(tenants.id, tenantId))
        .returning();
    return result[0];
};

export const deleteTenant = async (tenantId: string) => {
    await db.delete(tenants).where(eq(tenants.id, tenantId));
    return;
};