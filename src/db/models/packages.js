"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAllPackages = exports.updatePackageStatus = exports.getPackagesByTenantId = exports.getPackageById = exports.createPackage = void 0;
const index_1 = require("../index");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../schema");
const createPackage = (packageDetails) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.insert(schema_1.packages).values(packageDetails).returning();
        return result[0];
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.createPackage = createPackage;
const getPackageById = (packageId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.select().from(schema_1.packages).where((0, drizzle_orm_1.eq)(schema_1.packages.id, packageId));
        return result[0];
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.getPackageById = getPackageById;
const getPackagesByTenantId = (tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.query.packages.findMany({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.packages.tenantId, tenantId)),
            orderBy: [
                (0, drizzle_orm_1.sql) `CASE WHEN ${schema_1.packages.status} = 'delivered' THEN 0 ELSE 1 END ASC`,
                (0, drizzle_orm_1.asc)(schema_1.packages.deliveryTime)
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
    }
    catch (error) {
        console.error(error);
        return [];
    }
});
exports.getPackagesByTenantId = getPackagesByTenantId;
const updatePackageStatus = (packageId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db
            .update(schema_1.packages)
            .set({ status })
            .where((0, drizzle_orm_1.eq)(schema_1.packages.id, packageId))
            .returning();
        return result[0] || null;
    }
    catch (error) {
        console.error("Error updating package status:", error);
        return null;
    }
});
exports.updatePackageStatus = updatePackageStatus;
const removeAllPackages = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.delete(schema_1.packages);
        return result; // Return the number of deleted rows (if applicable)
    }
    catch (error) {
        console.error("Error removing all packages:", error);
        return null;
    }
});
exports.removeAllPackages = removeAllPackages;
