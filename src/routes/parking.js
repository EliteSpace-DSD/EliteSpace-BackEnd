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
const router = express_1.default.Router();
const parkingPermit_1 = require("../db/models/parkingPermit");
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parkingSpaces = yield (0, parkingPermit_1.getAllParkingSpaces)();
        res.status(200).json(parkingSpaces);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
        return;
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { guestName, licensePlate, parkingId } = req.body;
    if (!guestName || !licensePlate || !parkingId) {
        res.status(400).json({ error: 'Guest, license plate, and a parking selection are all required.' });
        return;
    }
    const parkingPermit = {
        tenantId: req.user.userId,
        guestName,
        licensePlate,
        parkingSpace: parkingId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    };
    try {
        const result = yield (0, parkingPermit_1.createParkingPermit)(parkingPermit);
        if (!result) {
            res.status(400).json({ error: 'Failed to create a parking permit.' });
            return;
        }
        res.status(200).json({
            message: `Parking request for ${guestName} with license plate ${licensePlate} received.`,
        });
        return;
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
        return;
    }
}));
exports.default = router;
