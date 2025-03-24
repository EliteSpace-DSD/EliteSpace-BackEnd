"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAccessCodeRequest = void 0;
const validateAccessCodeRequest = (req, res, next) => {
    const { guestName, timeLimit } = req.body;
    if (!guestName || !timeLimit) {
        res.status(400).json({ error: "Guest name and time limit are required" });
        return;
    }
    if (isNaN(Number(timeLimit)) || Number(timeLimit) <= 0) {
        res.status(400).json({ error: "Time limit must be greater than zero" });
        return;
    }
    next();
};
exports.validateAccessCodeRequest = validateAccessCodeRequest;
