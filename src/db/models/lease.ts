import { db } from '../index';
import { eq, and } from 'drizzle-orm';
import { leases, unitTenants, LeaseInsertType } from '../schema';

export const createLease = async (lease: LeaseInsertType) => {
    const result = await db.insert(leases).values(lease);
    return result;
};

export const getLeaseById = async (leaseId: string) => {
    const result = await db.select().from(leases).where(eq(leases.id, leaseId));
    return result;
};

export const getLeasesByTenantId = async (tenantId: string) => {
    const result = await db.query.unitTenants.findMany({
        where: eq(unitTenants.tenantId, tenantId),
        with: {
            unit: true,
            leases: true,
        },
    });
    return result;
};

export const getActiveLease = async (tenantsId: string) => {
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
        return;
    }

    const result = await db.query.leases.findFirst({
        where: and(
            eq(leases.unitTenantsId, unitTenantId.id),
            eq(leases.status, 'active')
        )
    });

    if (!result) {
        return;
    }

    return result;
}

export const deleteLease = async (leaseId: string) => {
    const result = await db.delete(leases).where(eq(leases.id, leaseId));
    return result;
};