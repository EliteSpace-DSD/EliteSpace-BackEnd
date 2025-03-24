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
const tenant_1 = require("../../db/models/tenant");
const packages_1 = require("../../db/models/packages");
const smartLocker_1 = require("../../db/models/smartLocker");
const index_1 = require("../../db/index");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const email = process.env.EMAIL;
    const tenantId = yield getTenantIdViaEmail();
    if (!tenantId) {
        console.error("Non-existing tenant ID");
        yield index_1.client.end();
        return;
    }
    const packages = yield (0, packages_1.getPackagesByTenantId)(tenantId);
    if (packages.length === 0) {
        console.error("No existing package!");
        yield index_1.client.end();
        return;
    }
    const STATUS = "retrieved";
    const pickUpPackageId = packages[0].id;
    const updatedPackage = yield (0, packages_1.updatePackageStatus)(pickUpPackageId, STATUS);
    if (!updatedPackage) {
        console.error("Unable to update package status");
        yield index_1.client.end();
        return;
    }
    if (updatedPackage.lockerId) {
        yield (0, smartLocker_1.updateSmartLockerStatus)(updatedPackage.lockerId, false);
        console.log("Package pickup status update complete!");
    }
    else {
        console.error("Unable to update locker status");
    }
    yield index_1.client.end();
});
main();
