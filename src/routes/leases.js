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
const lease_1 = require("../db/models/lease");
const router = express_1.default.Router();
router.get('/view', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const tenant = yield (0, tenant_1.getTenantByUserId)(userId);
    if (!tenant) {
        res.status(404).json({ message: 'Tenant not found' });
        return;
    }
    ;
    const leases = tenant.unitTenants[0].leases;
    const renewalLease = leases.filter(lease => {
        return lease.status === 'pending';
    });
    if (!renewalLease.length) {
        res.status(200).json({ message: 'No pending renewals.' });
        return;
    }
    const tenantLeaseDetails = Object.assign(Object.assign({}, tenant), renewalLease[0]);
    res.status(200).json(tenantLeaseDetails);
    return;
}));
router.post('/sign', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const leaseId = req.body.leaseId;
    const lease = yield (0, lease_1.updateLease)(leaseId, { status: 'active', signature: true, signedAt: new Date() });
    if (!lease) {
        res.status(404).json({ message: 'Lease not found' });
        return;
    }
    ;
    res.status(200).json({ message: 'Lease signed successfully.' });
    return;
}));
exports.default = router;
