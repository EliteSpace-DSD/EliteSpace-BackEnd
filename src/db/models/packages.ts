import { db } from '../index';
import { eq, and } from 'drizzle-orm';
import { packages, PackageInsertType } from '../schema';

export const createPackage = async (packageDetails: PackageInsertType) => {
    const result = await db.insert(packages).values(packageDetails).returning();
    return result[0];
};

export const getPackageById = async (packageId: string) => {
    const result = await db.select().from(packages).where(eq(packages.id, packageId));
    return result[0];
};

export const getPackagesByTenantId = async (tenantId: string) => {
    const result = await db.query.packages.findMany({
        where: and(
            eq(packages.tenantId, tenantId),
            eq(packages.status, 'delivered')
        ),
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
};
