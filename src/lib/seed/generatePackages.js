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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../db/index");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const tenant_1 = require("../../db/models/tenant");
const smartLocker_1 = require("../../db/models/smartLocker");
const packages_1 = require("../../db/models/packages");
const getTenantIdViaEmail = () => __awaiter(void 0, void 0, void 0, function* () {
    const email = process.env.EMAIL;
    if (!email) {
        console.error("EMAIL environment variable is not set");
    }
    else {
        const tenantInfo = yield (0, tenant_1.getTenantByEmail)(email);
        if (!tenantInfo) {
            console.error("Not a valid tenant email");
            return null;
        }
        else {
            return tenantInfo.id;
        }
    }
});
const createTwoSeedPackages = (threeAvailableLockers, tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    for (let lockerId of threeAvailableLockers) {
        yield (0, smartLocker_1.updateSmartLockerStatus)(lockerId, true);
    }
    const timeStampTwo = new Date(); // Current date and time
    const timeStampOne = new Date(); // Current date and time
    const timeStampThree = new Date(); // Current date and time
    // Subtract 5 hours
    timeStampOne.setHours(timeStampOne.getHours() - 5);
    timeStampThree.setHours(timeStampThree.getHours() - 10);
    const packageOneDetails = {
        tenantId: tenantId,
        lockerId: threeAvailableLockers[0],
        lockerCode: '8e3K9s',
        status: 'retrieved',
        deliveryTime: timeStampOne
    };
    const packageTwoDetails = {
        tenantId: tenantId,
        lockerId: threeAvailableLockers[1],
        lockerCode: '0zk238',
        status: 'delivered',
        deliveryTime: timeStampTwo
    };
    const packageThreeDetails = {
        tenantId: tenantId,
        lockerId: threeAvailableLockers[2],
        lockerCode: 'ys3ldZ',
        status: 'delivered',
        deliveryTime: timeStampThree
    };
    yield (0, packages_1.createPackage)(packageThreeDetails);
    yield (0, packages_1.createPackage)(packageOneDetails);
    yield (0, packages_1.createPackage)(packageTwoDetails);
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const email = process.env.EMAIL;
    const tenantId = yield getTenantIdViaEmail();
    if (!tenantId) {
        console.error("None-existing tenant id");
    }
    else {
        // console.log(tenantId);
        let availableLockers = yield (0, smartLocker_1.getAllOpenSmartLockers)();
        if (availableLockers.length < 2) {
            console.log("Less than 2 lockers left, unable to create seed data for 2 packages");
        }
        else {
            const threeAvailableLockers = [availableLockers[0].id, availableLockers[1].id, availableLockers[2].id];
            yield createTwoSeedPackages(threeAvailableLockers, tenantId);
        }
    }
    yield index_1.client.end();
});
main();
