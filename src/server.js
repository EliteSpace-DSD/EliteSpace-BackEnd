"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = __importDefault(require("./config/config"));
const morgan_1 = __importDefault(require("morgan")); // Http request logger, help debug
const cors_1 = __importDefault(require("cors"));
const authMiddleware_1 = require("./middleware/authMiddleware");
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const leases_1 = __importDefault(require("./routes/leases"));
const complaints_1 = require("./routes/complaints");
const parking_1 = __importDefault(require("./routes/parking"));
const accessCodes_1 = __importDefault(require("./routes/accessCodes"));
const smartPackage_1 = __importDefault(require("./routes/smartPackage"));
// Configuration
const app = (0, express_1.default)();
const HOST = config_1.default.HOST;
const PORT = config_1.default.PORT;
app.use(express_1.default.json());
app.use((0, morgan_1.default)("common"));
app.use((0, cookie_parser_1.default)()); // Enables reading cookies from req.cookies
// Allows request from frontend AND local
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://elitespace.netlify.app", "https://elitespace-dev.netlify.app"],
    credentials: true,
}));
// Use routes
app.use("/auth", auth_1.default);
app.use("/leases", authMiddleware_1.requiresAuthentication, leases_1.default);
app.use("/parking", authMiddleware_1.requiresAuthentication, parking_1.default);
app.use("/complaints", complaints_1.complaintRoutes);
app.use("/accessCodes", accessCodes_1.default);
app.use('/smartpackage', authMiddleware_1.requiresAuthentication, smartPackage_1.default);
// Listener
app.listen(PORT, HOST, () => {
    console.log(`Elite Space App is listening on port ${PORT} of ${HOST}!`);
});
