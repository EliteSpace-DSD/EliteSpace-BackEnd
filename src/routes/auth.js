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
const tenant_1 = require("../db/models/tenant");
const authFunctions_1 = require("../authClient/authFunctions");
const router = express_1.default.Router();
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, phone, dob, first_name } = req.body;
        const isExistingTenant = yield (0, tenant_1.getTenantByEmail)(email);
        if (!isExistingTenant) {
            res.status(404).json({
                message: "Unable to register account. Contact Elite Space Leasing.",
            });
            return;
        }
        const { data, error } = yield (0, authFunctions_1.signUpNewUser)(email, password, first_name);
        if (error) {
            const errorMsg = error.code === "weak_password" ? "Password not strong enough. Must be atleast 6 characters." : "Error signing up";
            res.status(500).json({ message: errorMsg });
            return;
        }
        if (data.user) {
            const { error: dbError } = yield (0, authFunctions_1.linkUserToTenant)(email, data.user.id, phone, dob);
            if (dbError) {
                res.status(500).json({ message: "Server error" });
            }
            res.status(200).json({ message: "Account registered." });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
        return;
    }
}));
router.post("/forgot-password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const { data, error } = yield (0, authFunctions_1.initiatePasswordReset)(email);
        if (error) {
            res.status(400).json({ message: "something went wrong" });
            return;
        }
        res.status(200).json({ message: "Password reset email sent." });
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
        return;
    }
}));
router.post("/update-password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield (0, authFunctions_1.updatePassword)(req, res);
    if (error) {
        console.log(error);
        res.status(400).json({ message: "Not authorized. Unable to reset password." });
        return;
    }
    res.status(200).json({ message: "Password reset successfully." });
    return;
}));
router.get("/confirm", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token_hash, type, next } = req.query;
        const ERROR_PAGE_URL = process.env.ERROR_PAGE_URL;
        /*
          query parameters are typed in Express as string | ParsedQs (when query param is an obj) | (string | ParsedQs[]). This last one represents an array of those types. These values are passed to to verifyOtp, which expects only a string type that matches specific enums. So there is a type mismatch. Using type narrowing here to ensure that the
          variables are the expected type before calling verifyOtp to prevent crashing the server*/
        if (typeof token_hash === "string" && typeof type === "string" && type === "recovery") {
            const error = yield (0, authFunctions_1.verifyOtp)({ type, token_hash, req, res });
            if (!error) {
                if (next) {
                    res.redirect(303, `${next}`);
                    return;
                }
            }
        }
        res.redirect(303, ERROR_PAGE_URL);
        return;
    });
});
// Note: users needs to click confirm on their confirmation email before being able to sign in
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const { data, error } = yield (0, authFunctions_1.signInWithEmail)(email, password);
        if (error) {
            res.status(401).json({ message: "Invalid email or password. Please try again." });
            return;
        }
        // Set session cookie (for persistence)
        const { session } = data;
        if (!session) {
            res.status(500).json({ message: "failed to retrieve session." });
            return;
        }
        // access token expires_in by default is 3600 seconds, * 1000 = 3600000 milliseconds = 1 hour
        res.cookie("sb-access-token", session.access_token, {
            httpOnly: true, //Prevents JS access
            // secure: true, // only sent over HTTPS, set as true only in production
            sameSite: "strict",
            maxAge: session.expires_in * 1000,
        });
        res.status(200).json({ message: "Signed in successfully" });
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
        return;
    }
}));
router.post("");
router.post("/signout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const error = yield (0, authFunctions_1.signout)();
        if (error) {
            res.status(401).json({ message: "Sign out error." });
            return;
        }
        res.status(200).json({ message: "Signed out successfully" });
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
        return;
    }
}));
router.get("/reset-test", (req, res) => {
    res.redirect("http://localhost:5173/update-password");
});
exports.default = router;
