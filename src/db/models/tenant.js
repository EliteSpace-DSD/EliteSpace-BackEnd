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
exports.getTenantInfoByUserId = exports.deleteTenant = exports.updateTenant = exports.getTenantByEmail = exports.getTenantByUserId = exports.getTenantById = exports.createTenant = void 0;
const index_1 = require("../index");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../schema");
const createTenant = (tenant) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.insert(schema_1.tenants).values(tenant).returning();
        return result[0];
    }
    catch (error) {
        return null;
    }
});
exports.createTenant = createTenant;
const getTenantById = (tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.select().from(schema_1.tenants).where((0, drizzle_orm_1.eq)(schema_1.tenants.id, tenantId));
        return result[0];
    }
    catch (error) {
        return null;
    }
});
exports.getTenantById = getTenantById;
const getTenantByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.query.tenants.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.tenants.userId, userId),
            columns: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
            },
            with: {
                unitTenants: {
                    columns: {
                        id: true,
                    },
                    with: {
                        leases: true
                    }
                }
            }
        });
        return result;
    }
    catch (error) {
        return null;
    }
});
exports.getTenantByUserId = getTenantByUserId;
const getTenantByEmail = (tenantEmail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.select().from(schema_1.tenants).where((0, drizzle_orm_1.eq)(schema_1.tenants.email, tenantEmail));
        if (!result) {
            return;
        }
        ;
        return result[0];
    }
    catch (error) {
        throw new Error('Failed to fetch tenant by email');
    }
    ;
});
exports.getTenantByEmail = getTenantByEmail;
const updateTenant = (tenantId, updates) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.update(schema_1.tenants)
            .set(updates)
            .where((0, drizzle_orm_1.eq)(schema_1.tenants.id, tenantId))
            .returning();
        return result[0];
    }
    catch (error) {
        return null;
    }
});
exports.updateTenant = updateTenant;
const deleteTenant = (tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.delete(schema_1.tenants).where((0, drizzle_orm_1.eq)(schema_1.tenants.id, tenantId));
        return { success: true };
    }
    catch (error) {
        return { success: false };
    }
});
exports.deleteTenant = deleteTenant;
const getTenantInfoByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield index_1.db
            .select({
            id: schema_1.tenants.id,
            firstName: schema_1.tenants.firstName,
            lastName: schema_1.tenants.lastName,
            email: schema_1.tenants.email,
        })
            .from(schema_1.tenants)
            .where((0, drizzle_orm_1.eq)(schema_1.tenants.userId, userId));
        return (_a = result[0]) !== null && _a !== void 0 ? _a : null;
    }
    catch (error) {
        console.error("Error fetching tenant info:", error); // More descriptive error log
        return null;
    }
});
exports.getTenantInfoByUserId = getTenantInfoByUserId;
