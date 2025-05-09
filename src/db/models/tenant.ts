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

export const getTenantByUserId = async (userId: string) => {
    try {
        const result = await db.query.tenants.findFirst({
            where: eq(tenants.userId, userId),
            columns: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
            },
            with: {
                unitTenants: {
                    columns: {
                        id: true,
                    },
                    with: {
                        leases: true
                    }
                }
            }
        });
        return result;

    } catch (error) {
        return null;
    }
};

export const getTenantByEmail = async (tenantEmail: string) => {
    try {
        const result = await db.select().from(tenants).where(eq(
            tenants.email, tenantEmail
        ));

        if (!result) {
            return;
        };

        return result[0];
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch tenant by email');
    };
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

export const getTenantInfoByUserId = async (userId: string) => {
    try {
        const result = await db
            .select({
                id: tenants.id, 
                firstName: tenants.firstName,
                lastName: tenants.lastName,
                email: tenants.email,
            })
            .from(tenants)
            .where(eq(tenants.userId, userId));

        return result[0] ?? null;
    } catch (error) {
        console.error("Error fetching tenant info:", error); // More descriptive error log
        return null;
    }
};
