import { db } from '../index';
import { eq, and, asc, sql } from 'drizzle-orm';
import { packages, PackageInsertType, PackageStatus } from '../schema';

export const createPackage = async (packageDetails: PackageInsertType) => {
    try {
        const result = await db.insert(packages).values(packageDetails).returning();
        return result[0];
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getPackageById = async (packageId: string) => {
    try {
        const result = await db.select().from(packages).where(eq(packages.id, packageId));
        return result[0];
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getPackagesByTenantId = async (tenantId: string) => {
    try {
        const result = await db.query.packages.findMany({
            where: and(
                eq(packages.tenantId, tenantId)
            ),
            orderBy: [
                sql`CASE WHEN ${packages.status} = 'delivered' THEN 0 ELSE 1 END ASC`,
                asc(packages.deliveryTime)
            ],
            with: {
                smartLocker: {
                    columns: {
                        id: true,
                        lockerNumber: true
                    }
                }
            }
        });
        return result;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const updatePackageStatus = async (packageId: string, status: PackageStatus) => {
    try {
        const result = await db
            .update(packages)
            .set({ status })
            .where(eq(packages.id, packageId))
            .returning();

        return result[0] || null;
    } catch (error) {
        console.error("Error updating package status:", error);
        return null;
    }
};

export const removeAllPackages = async () => {
    try {
        const result = await db.delete(packages);
        return result; // Return the number of deleted rows (if applicable)
    } catch (error) {
        console.error("Error removing all packages:", error);
        return null;
    }
};

