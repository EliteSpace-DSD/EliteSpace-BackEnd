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
exports.getUnitIdByTenantId = exports.getPrimaryTenant = exports.getAllUnitTenants = exports.createUnitTenant = void 0;
const index_1 = require("../index");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../schema");
const createUnitTenant = (unitTenant) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.insert(schema_1.unitTenants).values(unitTenant).returning();
        return result[0];
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.createUnitTenant = createUnitTenant;
const getAllUnitTenants = (unitId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tenants = yield index_1.db.query.unitTenants.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.unitTenants.unitId, unitId),
            with: {
                tenant: true,
            }
        });
        return tenants || [];
    }
    catch (error) {
        console.error(error);
        return [];
    }
});
exports.getAllUnitTenants = getAllUnitTenants;
const getPrimaryTenant = (unitId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const primaryTenant = yield index_1.db.query.unitTenants.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.unitTenants.isPrimary, true), (0, drizzle_orm_1.eq)(schema_1.unitTenants.unitId, unitId)),
            with: {
                tenant: true,
            }
        });
        return primaryTenant || null;
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.getPrimaryTenant = getPrimaryTenant;
const getUnitIdByTenantId = (tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const unitId = yield index_1.db.query.unitTenants.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.unitTenants.tenantId, tenantId),
            with: {
                unit: {
                    columns: {
                        id: true,
                    }
                }
            }
        });
        if (!unitId) {
            return null;
        }
        return (_a = unitId.unit) === null || _a === void 0 ? void 0 : _a.id;
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.getUnitIdByTenantId = getUnitIdByTenantId;
