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
exports.resetAllSmartLockerStatus = exports.deleteSmartLocker = exports.updateSmartLockerStatus = exports.getAllOpenSmartLockers = exports.getOpenSmartLocker = exports.getSmartLockerById = exports.createSmartLocker = void 0;
const index_1 = require("../index");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../schema");
const createSmartLocker = (smartLocker) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.insert(schema_1.smartLockers).values(smartLocker).returning();
        return result[0];
    }
    catch (error) {
        return null;
    }
});
exports.createSmartLocker = createSmartLocker;
const getSmartLockerById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.select().from(schema_1.smartLockers).where((0, drizzle_orm_1.eq)(schema_1.smartLockers.id, id));
        return result[0];
    }
    catch (error) {
        return null;
    }
});
exports.getSmartLockerById = getSmartLockerById;
const getOpenSmartLocker = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.query.smartLockers.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.smartLockers.isOccupied, false),
            columns: {
                id: true,
                lockerNumber: true
            }
        });
        return result;
    }
    catch (error) {
        return null;
    }
});
exports.getOpenSmartLocker = getOpenSmartLocker;
const getAllOpenSmartLockers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.query.smartLockers.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.smartLockers.isOccupied, false),
            columns: {
                id: true,
                lockerNumber: true
            }
        });
        return result || [];
    }
    catch (error) {
        return [];
    }
});
exports.getAllOpenSmartLockers = getAllOpenSmartLockers;
const updateSmartLockerStatus = (id, isOccupied) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.update(schema_1.smartLockers).set({ isOccupied }).where((0, drizzle_orm_1.eq)(schema_1.smartLockers.id, id));
        return result[0];
    }
    catch (error) {
        return null;
    }
});
exports.updateSmartLockerStatus = updateSmartLockerStatus;
const deleteSmartLocker = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.delete(schema_1.smartLockers).where((0, drizzle_orm_1.eq)(schema_1.smartLockers.id, id));
        return { success: true };
    }
    catch (error) {
        console.error(error);
        return { success: false };
    }
});
exports.deleteSmartLocker = deleteSmartLocker;
const resetAllSmartLockerStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.db.update(schema_1.smartLockers).set({ isOccupied: false });
        return { success: true, updatedRows: result };
    }
    catch (error) {
        console.error("Error resetting smart locker statuses:", error);
        return { success: false };
    }
});
exports.resetAllSmartLockerStatus = resetAllSmartLockerStatus;
