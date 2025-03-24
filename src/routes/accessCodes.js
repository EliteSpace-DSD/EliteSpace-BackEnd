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
const accessCodes_1 = require("../db/models/accessCodes");
const validateRequest_1 = require("../middleware/validateRequest");
const crypto_1 = __importDefault(require("crypto"));
const router = express_1.default.Router();
router.post("/generate", validateRequest_1.validateAccessCodeRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { guestName, timeLimit, tenantId } = req.body;
    try {
        const randomKey = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedCode = crypto_1.default
            .createHash("sha256")
            .update(randomKey)
            .digest("hex");
        const accessCode = {
            tenantId,
            type: "guest",
            hashedCode,
            expiresAt: new Date(Date.now() + Number(timeLimit) * 60 * 1000),
            isActive: true,
            createdAt: new Date(),
        };
        const result = yield (0, accessCodes_1.createAccessCode)(accessCode);
        if (result) {
            res
                .status(201)
                .json({ accessCode: Object.assign(Object.assign({}, result), { unhashedCode: randomKey }) });
        }
        else {
            res.status(500).json({ error: "Failed to create access code" });
        }
    }
    catch (error) {
        console.error("Error in /generate route:", error);
        res.status(500).json({ error: "Server error" });
    }
}));
exports.default = router;
