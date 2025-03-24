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
exports.deleteParkingPermit = exports.extendParkingPermit = exports.getParkingPermitByTenantId = exports.getAllParkingSpaces = exports.createParkingPermit = void 0;
const index_1 = require("../index");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../schema");
const createParkingPermit = (parkingPermit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.insert(schema_1.parkingPermits).values(parkingPermit).returning();
        return result[0];
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.createParkingPermit = createParkingPermit;
const getAllParkingSpaces = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield index_1.db
            .select({
            parking_space: schema_1.parkingSpaces.parkingSpace,
            status: schema_1.parkingSpaces.status,
        })
            .from(schema_1.parkingSpaces)
            .orderBy(schema_1.parkingSpaces.parkingSpace);
        return results;
    }
    catch (err) {
        console.error(err);
        return null;
    }
});
exports.getAllParkingSpaces = getAllParkingSpaces;
const getParkingPermitByTenantId = (tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.select().from(schema_1.parkingPermits).where((0, drizzle_orm_1.eq)(schema_1.parkingPermits.tenantId, tenantId));
        return result[0];
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.getParkingPermitByTenantId = getParkingPermitByTenantId;
const extendParkingPermit = (id, expiresAt) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.update(schema_1.parkingPermits).set({ expiresAt }).where((0, drizzle_orm_1.eq)(schema_1.parkingPermits.id, id));
        return result[0];
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.extendParkingPermit = extendParkingPermit;
const deleteParkingPermit = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.delete(schema_1.parkingPermits).where((0, drizzle_orm_1.eq)(schema_1.parkingPermits.id, id));
        return { success: true };
    }
    catch (error) {
        console.error(error);
        return { success: false };
    }
});
exports.deleteParkingPermit = deleteParkingPermit;
