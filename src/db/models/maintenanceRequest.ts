import { db } from '../index';
import { eq, and } from 'drizzle-orm';
import { MaintenanceRequestInsertType, maintenanceRequests, MaintenanceStatus, IssueType } from '../schema';
import { getUnitIdByTenantId } from './unitTenant';

export const createMaintenanceRequest = async (maintenanceRequest: MaintenanceRequestInsertType) => {
    if (!maintenanceRequest.tenantId) return;

    const unitId = await getUnitIdByTenantId(maintenanceRequest.tenantId);
    const requestObj = {
        ...maintenanceRequest,
        unitId: unitId,
    }

    const result = await db.insert(maintenanceRequests).values(requestObj).returning();
    return result[0];
};

export const getMaintenanceRequests = async (tenantId: string) => {
    const unitId = await getUnitIdByTenantId(tenantId);
    if (!unitId) return;

    const result = await db.select().from(maintenanceRequests).where(
        and(
            eq(maintenanceRequests.tenantId, tenantId),
            eq(maintenanceRequests.unitId, unitId),
        )
    );

    return result;
};

export const updateRequestStatus = async (maintenanceRequestId: string, status: MaintenanceStatus) => {
    const result = await db.update(maintenanceRequests).set({ status }).where(eq(maintenanceRequests.id, maintenanceRequestId));
    return result[0];
};


export const deleteRequest = async (maintenanceRequestId: string) => {
    const result = await db.delete(maintenanceRequests).where(eq(maintenanceRequests.id, maintenanceRequestId));
    return result[0];
};
