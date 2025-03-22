import { db } from "../index";
import { eq } from "drizzle-orm";
import { ComplaintInsertType, complaints } from "../schema";

export const createComplaint = async (complaint: ComplaintInsertType) => {
  try {
    const result = await db.insert(complaints).values(complaint).returning();
    return result[0] || null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getComplaintsByTenantId = async (tenantId: string) => {
  try {
    const result = await db
      .select()
      .from(complaints)
      .where(eq(complaints.tenantId, tenantId));
    return result || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const updateComplaintPriority = async (
  complaintId: string,
  priority: "Low" | "Medium" | "High"
) => {
  try {
    const result = await db
      .update(complaints)
      .set({ priority })
      .where(eq(complaints.id, complaintId));
    return result[0] || null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteComplaint = async (complaintId: string) => {
  try {
    const result = await db
      .delete(complaints)
      .where(eq(complaints.id, complaintId));
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};
