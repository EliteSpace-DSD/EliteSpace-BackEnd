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
exports.requiresAuthentication = void 0;
const authClient_1 = require("../authClient");
const tenant_1 = require("../db/models/tenant");
const requiresAuthentication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies['sb-access-token'];
        if (!token) {
            res.status(401).json({ message: "Unauthorized. No session found." });
            return;
        }
        const { data, error } = yield authClient_1.authClient.auth.getUser(token);
        if (error || !data.user) {
            res.status(401).json({ message: "Invalid or expired session." });
            return;
        }
        //  Adding user property (object) to request object
        req.user = {
            userId: data.user.id,
            email: data.user.email
        };
        const tenantInfo = yield (0, tenant_1.getTenantInfoByUserId)(data.user.id);
        if (!tenantInfo) {
            res.status(401).json({ message: "unable to find tenant in query" });
            return;
        }
        req.tenant = {
            id: tenantInfo.id,
            firstName: tenantInfo.firstName,
            lastName: tenantInfo.lastName,
            email: tenantInfo.email
        };
        next();
    }
    catch (err) {
        console.error('Auth middleware error:', err);
        res.status(500).json({ message: 'Server error' });
        return;
    }
});
exports.requiresAuthentication = requiresAuthentication;
