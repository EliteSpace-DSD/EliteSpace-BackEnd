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
exports.deleteRequest = exports.updateRequestStatus = exports.getMaintenanceRequests = exports.createMaintenanceRequest = void 0;
const index_1 = require("../index");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../schema");
const unitTenant_1 = require("./unitTenant");
const createMaintenanceRequest = (maintenanceRequest) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!maintenanceRequest.tenantId)
            return null;
        const unitId = yield (0, unitTenant_1.getUnitIdByTenantId)(maintenanceRequest.tenantId);
        const requestObj = Object.assign(Object.assign({}, maintenanceRequest), { unitId: unitId });
        const result = yield index_1.db.insert(schema_1.maintenanceRequests).values(requestObj).returning();
        return result[0];
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.createMaintenanceRequest = createMaintenanceRequest;
const getMaintenanceRequests = (tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const unitId = yield (0, unitTenant_1.getUnitIdByTenantId)(tenantId);
        if (!unitId)
            return [];
        const result = yield index_1.db.select().from(schema_1.maintenanceRequests).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.maintenanceRequests.tenantId, tenantId), (0, drizzle_orm_1.eq)(schema_1.maintenanceRequests.unitId, unitId)));
        return result;
    }
    catch (error) {
        console.error(error);
        return [];
    }
});
exports.getMaintenanceRequests = getMaintenanceRequests;
const updateRequestStatus = (maintenanceRequestId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.update(schema_1.maintenanceRequests).set({ status }).where((0, drizzle_orm_1.eq)(schema_1.maintenanceRequests.id, maintenanceRequestId));
        return result[0];
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.updateRequestStatus = updateRequestStatus;
const deleteRequest = (maintenanceRequestId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.delete(schema_1.maintenanceRequests).where((0, drizzle_orm_1.eq)(schema_1.maintenanceRequests.id, maintenanceRequestId));
        return { success: true };
    }
    catch (error) {
        console.error(error);
        return { success: false };
    }
});
exports.deleteRequest = deleteRequest;
