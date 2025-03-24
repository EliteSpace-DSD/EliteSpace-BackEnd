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
exports.deactivateAccessCode = exports.deleteAccessCode = exports.getAccessCodesByTenantId = exports.createAccessCode = void 0;
const index_1 = require("../index");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../schema");
const createAccessCode = (accessCode) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.insert(schema_1.accessCodes).values(accessCode).returning();
        return result[0];
    }
    catch (error) {
        return null;
    }
});
exports.createAccessCode = createAccessCode;
const getAccessCodesByTenantId = (tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db
            .select()
            .from(schema_1.accessCodes)
            .where((0, drizzle_orm_1.eq)(schema_1.accessCodes.tenantId, tenantId));
        return result || [];
    }
    catch (error) {
        return [];
    }
});
exports.getAccessCodesByTenantId = getAccessCodesByTenantId;
const deleteAccessCode = (accessCodeId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db
            .delete(schema_1.accessCodes)
            .where((0, drizzle_orm_1.eq)(schema_1.accessCodes.id, accessCodeId))
            .returning();
        return { success: true };
    }
    catch (error) {
        console.error(error);
        return { success: false };
    }
});
exports.deleteAccessCode = deleteAccessCode;
const deactivateAccessCode = (accessCodeId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db
            .update(schema_1.accessCodes)
            .set({ isActive: false })
            .where((0, drizzle_orm_1.eq)(schema_1.accessCodes.id, accessCodeId))
            .returning();
        return result[0];
    }
    catch (error) {
        return null;
    }
});
exports.deactivateAccessCode = deactivateAccessCode;
