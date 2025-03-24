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
const express_1 = __importDefault(require("express"));
const packages_1 = require("../db/models/packages");
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const packagesArr = yield (0, packages_1.getPackagesByTenantId)(req.tenant.id);
        if (!packagesArr) {
            console.error("Unable to properly retrieve packages info");
            return;
        }
        //Front end needs to check the length of the array, if EQUAL 0, then show
        // UI that reflects that
        const responseData = packagesArr.map(individualpackage => {
            return {
                id: individualpackage.id,
                deliveredDateTime: individualpackage.deliveryTime,
                status: individualpackage.status
            };
        });
        res.status(200).json(responseData);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
        return;
    }
}));
router.get('/:packageId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const packageId = req.params.packageId;
    try {
        const returnedPackage = yield (0, packages_1.getPackageById)(packageId);
        if (!returnedPackage) {
            res.status(400).json({ message: "Invalid package object" });
            return;
        }
        if (!returnedPackage.lockerCode) {
            res.status(400).json({ message: "Invalid package id" });
            return;
        }
        if (!returnedPackage.deliveryTime) {
            res.status(400).json({ message: "No delivery time" });
            return;
        }
        const responseData = {
            code: returnedPackage.lockerCode,
            deliveryTime: returnedPackage.deliveryTime
        };
        res.status(200).json(responseData);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
        return;
    }
}));
exports.default = router;
