/**
 * Issuetype is deprecaited, remains due to DB needing specific column
 */

import { db } from "../index";
import { eq } from "drizzle-orm";
import { ComplaintInsertType, complaints } from "../schema";

export const createComplaint = async (complaint: ComplaintInsertType) => {
  try {
    console.log("Inserting complaint:", complaint);
    const result = await db.insert(complaints).values(complaint).returning();
    console.log("Insert result:", result);
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
  priority: string
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

export const getAllComplaints = async () => {
  try {
    const result = await db.select().from(complaints); // Fetch all complaints
    return result || [];
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return [];
  }
};
