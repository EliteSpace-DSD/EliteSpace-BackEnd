import { db } from '../index';
import { eq, and } from 'drizzle-orm';
import { MaintenanceRequestInsertType, maintenanceRequests, MaintenanceStatus, IssueType } from '../schema';
import { getUnitIdByTenantId } from './unitTenant';

export const createMaintenanceRequest = async (maintenanceRequest: MaintenanceRequestInsertType) => {
    try {
        if (!maintenanceRequest.tenantId) return null;

        const unitId = await getUnitIdByTenantId(maintenanceRequest.tenantId);
        const requestObj = {
            ...maintenanceRequest,
            unitId: unitId,
        }

        const result = await db.insert(maintenanceRequests).values(requestObj).returning();
        return result[0];
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getMaintenanceRequests = async (tenantId: string) => {
    try {
        const unitId = await getUnitIdByTenantId(tenantId);
        if (!unitId) return [];

        const result = await db.select().from(maintenanceRequests).where(
            and(
                eq(maintenanceRequests.tenantId, tenantId),
                eq(maintenanceRequests.unitId, unitId),
            )
        );

        return result;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const updateRequestStatus = async (maintenanceRequestId: string, status: MaintenanceStatus) => {
    try {
        const result = await db.update(maintenanceRequests).set({ status }).where(eq(maintenanceRequests.id, maintenanceRequestId));
        return result[0];
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const deleteRequest = async (maintenanceRequestId: string) => {
    try {
        const result = await db.delete(maintenanceRequests).where(eq(maintenanceRequests.id, maintenanceRequestId));
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
};
