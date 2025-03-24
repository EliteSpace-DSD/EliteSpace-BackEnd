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
exports.deleteComplaint = exports.updateComplaintPriority = exports.getComplaintsByTenantId = exports.createComplaint = void 0;
const index_1 = require("../index");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../schema");
const createComplaint = (complaint) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.insert(schema_1.complaints).values(complaint).returning();
        return result[0] || null;
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.createComplaint = createComplaint;
const getComplaintsByTenantId = (tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.select().from(schema_1.complaints).where((0, drizzle_orm_1.eq)(schema_1.complaints.tenantId, tenantId));
        return result || [];
    }
    catch (error) {
        console.error(error);
        return [];
    }
});
exports.getComplaintsByTenantId = getComplaintsByTenantId;
const updateComplaintPriority = (complaintId, priority) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.update(schema_1.complaints).set({ priority }).where((0, drizzle_orm_1.eq)(schema_1.complaints.id, complaintId));
        return result[0] || null;
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.updateComplaintPriority = updateComplaintPriority;
const deleteComplaint = (complaintId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.delete(schema_1.complaints).where((0, drizzle_orm_1.eq)(schema_1.complaints.id, complaintId));
        return { success: true };
    }
    catch (error) {
        console.error(error);
        return { success: false };
    }
});
exports.deleteComplaint = deleteComplaint;
