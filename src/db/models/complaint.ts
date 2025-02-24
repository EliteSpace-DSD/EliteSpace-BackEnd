import { db } from '../index';
import { eq } from 'drizzle-orm';
import { ComplaintInsertType, complaints } from '../schema';

export const createComplaint = async (complaint: ComplaintInsertType) => {
    const result = await db.insert(complaints).values(complaint).returning();
    return result[0];
};

export const getComplaintsByTenantId = async (tenantId: string) => {
    const result = await db.select().from(complaints).where(eq(complaints.tenantId, tenantId));
    return result;
};

export const updateComplaintPriority = async (complaintId: string, priority: string) => {
    const result = await db.update(complaints).set({ priority }).where(eq(complaints.id, complaintId));
    return result[0];
};

export const deleteComplaint = async (complaintId: string) => {
    const result = await db.delete(complaints).where(eq(complaints.id, complaintId));
    return result[0];
};
