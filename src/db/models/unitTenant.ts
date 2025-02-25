import { db } from '../index';
import { eq, and } from 'drizzle-orm';
import { unitTenants, UnitTenantInsertType } from '../schema';

export const createUnitTenant = async (unitTenant: UnitTenantInsertType) => {
    try {
        const result = await db.insert(unitTenants).values(unitTenant).returning();
        return result[0];
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getAllUnitTenants = async (unitId: string) => {
    try {
        const tenants = await db.query.unitTenants.findMany({
            where: eq(unitTenants.unitId, unitId),
            with: {
                tenant: true,
            }
        });
        return tenants || [];
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getPrimaryTenant = async (unitId: string) => {
    try {
        const primaryTenant = await db.query.unitTenants.findFirst({
            where: and(
                eq(unitTenants.isPrimary, true),
                eq(unitTenants.unitId, unitId),
            ),
            with: {
                tenant: true,
            }
        });
        return primaryTenant || null;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getUnitIdByTenantId = async (tenantId: string) => {
    try {
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
    } catch (error) {
        console.error(error);
        return null;
    }
};