import { db } from '../index';
import { eq, and } from 'drizzle-orm';
import { unitTenants, UnitTenantInsertType } from '../schema';

export const createUnitTenant = async (unitTenant: UnitTenantInsertType) => {
    const result = await db.insert(unitTenants).values(unitTenant).returning();
    return result[0];
};

export const getAllUnitTenants = async (unitId: string) => {
    const tenants = await db.query.unitTenants.findMany({
        where: eq(unitTenants.unitId, unitId),
        with: {
            tenant: true,
        }
    });
    return tenants;
};

export const getPrimaryTenant = async (unitId: string) => {
    const primaryTenant = await db.query.unitTenants.findFirst({
        where: and(
            eq(unitTenants.isPrimary, true),
            eq(unitTenants.unitId, unitId),
        ),
        with: {
            tenant: true,
        }
    });
    return primaryTenant;
};

export const getUnitIdByTenantId = async (tenantId: string) => {
    const unitId = await db.query.unitTenants.findFirst({
        where: eq(unitTenants.tenantId, tenantId),
        with: {
            unit: {
                columns: {
                    id: true,
                }
            }
        }
    });

    if (!unitId) {
        return null;
    }

    return unitId.unit?.id;
};