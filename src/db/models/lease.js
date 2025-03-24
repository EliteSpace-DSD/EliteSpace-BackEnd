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
exports.updateLease = exports.deleteLease = exports.getActiveLease = exports.getLeasesByTenantId = exports.getLeaseById = exports.createLease = void 0;
const index_1 = require("../index");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../schema");
const createLease = (lease) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.insert(schema_1.leases).values(lease).returning();
        return result[0];
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.createLease = createLease;
const getLeaseById = (leaseId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.select().from(schema_1.leases).where((0, drizzle_orm_1.eq)(schema_1.leases.id, leaseId));
        return result[0];
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.getLeaseById = getLeaseById;
const getLeasesByTenantId = (tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.query.unitTenants.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.unitTenants.tenantId, tenantId),
            with: {
                unit: true,
                leases: true,
            },
        });
        return result || [];
    }
    catch (error) {
        console.error(error);
        return [];
    }
});
exports.getLeasesByTenantId = getLeasesByTenantId;
const getActiveLease = (tenantsId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const unitTenantId = yield index_1.db.query.unitTenants.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.unitTenants.tenantId, tenantsId), (0, drizzle_orm_1.eq)(schema_1.unitTenants.isPrimary, true)),
            columns: {
                id: true,
            }
        });
        if (!unitTenantId) {
            return null;
        }
        const result = yield index_1.db.query.leases.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.leases.unitTenantsId, unitTenantId.id), (0, drizzle_orm_1.eq)(schema_1.leases.status, 'active'))
        });
        return result;
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.getActiveLease = getActiveLease;
const deleteLease = (leaseId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.delete(schema_1.leases).where((0, drizzle_orm_1.eq)(schema_1.leases.id, leaseId)).returning();
        return { success: true };
    }
    catch (error) {
        console.error(error);
        return { success: false };
    }
});
exports.deleteLease = deleteLease;
const updateLease = (leaseId, lease) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.update(schema_1.leases).set(lease).where((0, drizzle_orm_1.eq)(schema_1.leases.id, leaseId)).returning();
        return result[0];
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.updateLease = updateLease;
