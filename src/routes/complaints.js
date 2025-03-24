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
exports.complaintRoutes = void 0;
const express_1 = __importDefault(require("express"));
const gemini_1 = require("../ai/gemini");
const router = express_1.default.Router();
router.post("/submit-complaint", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { selectedIssue, extraDetails } = req.body;
        //Pass full object to AI
        const priority = yield (0, gemini_1.runGemini)(extraDetails);
        const fullComplaint = {
            selectedIssue,
            extraDetails,
            priority,
        };
        console.log("Complaint Processed:", fullComplaint);
        //Call AI here
        res.status(200).json({
            message: "Complaint submitted in successfully",
            complaint: fullComplaint,
        });
    }
    catch (error) {
        console.error("Error processing complaint:", error);
        res.status(500).json({ message: "Server error" });
    }
}));
exports.complaintRoutes = router;
