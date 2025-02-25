import { db } from '../index';
import { eq, and } from 'drizzle-orm';
import { leases, unitTenants, LeaseInsertType } from '../schema';

export const createLease = async (lease: LeaseInsertType) => {
    try {
        const result = await db.insert(leases).values(lease).returning();
        return result[0];
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getLeaseById = async (leaseId: string) => {
    try {
        const result = await db.select().from(leases).where(eq(leases.id, leaseId));
        return result[0];
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getLeasesByTenantId = async (tenantId: string) => {
    try {
        const result = await db.query.unitTenants.findMany({
            where: eq(unitTenants.tenantId, tenantId),
            with: {
                unit: true,
                leases: true,
            },
        });
        return result || [];
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getActiveLease = async (tenantsId: string) => {
    try {
        const unitTenantId = await db.query.unitTenants.findFirst({
            where: and(
                eq(unitTenants.tenantId, tenantsId),
                eq(unitTenants.isPrimary, true)
            ),
            columns: {
                id: true,
            }
        });

        if (!unitTenantId) {
            return null;
        }

        const result = await db.query.leases.findFirst({
            where: and(
                eq(leases.unitTenantsId, unitTenantId.id),
                eq(leases.status, 'active')
            )
        });

        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const deleteLease = async (leaseId: string) => {
    try {
        const result = await db.delete(leases).where(eq(leases.id, leaseId)).returning();
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
};