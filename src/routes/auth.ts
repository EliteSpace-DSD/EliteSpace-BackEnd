import express, { Request, Response } from 'express';
import { getTenantByEmail } from '../db/models/tenant';
import { signUpNewUser, linkUserToTenant } from '../authClient/authFunctions';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const isExistingTenant = await getTenantByEmail(email);

        if (!isExistingTenant) {
            res.status(404).json({ message: 'Unable to register account. Contact Elite Space Leasing.' });
            return;
        };

        const { data, error } = await signUpNewUser(email, password);

        if (error) {
            res.status(500).json({ message: 'Error signing up.' });
            return;
        };

        if (data.user) {
            const { error: dbError } = await linkUserToTenant(email, data.user.id);

            if (dbError) {
                res.status(500).json({ message: 'Server error' });
            };

            res.status(200).json({ message: 'Account registered.' });
            return;
        };
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        return;
    };
});

export default router;