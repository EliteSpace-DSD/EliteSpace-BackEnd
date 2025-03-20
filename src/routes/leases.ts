import express, { Request, Response } from 'express';
import { getTenantByUserId } from '../db/models/tenant';
import { updateLease } from '../db/models/lease';

const router = express.Router();

router.get('/view', async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const tenant = await getTenantByUserId(userId);

    if (!tenant) {
        res.status(404).json({ message: 'Tenant not found' });
        return;
    };

    const leases = tenant.unitTenants[0].leases;
    const renewalLease = leases.filter(lease => {
        return lease.status === 'pending';
    });

    if (!renewalLease.length) {
        res.status(404).json({ message: 'No pending renewals.' });
        return;
    }
    res.status(200).json(renewalLease);
    return;
});

router.post('/sign', async (req: Request, res: Response) => {
    const leaseId = req.body.leaseId;
    const lease = await updateLease(leaseId, { status: 'active', signature: true, signedAt: new Date() });

    if (!lease) {
        res.status(404).json({ message: 'Lease not found' });
        return;
    };

    res.status(200).json({ message: 'Lease signed successfully.' });
    return;
});

export default router;