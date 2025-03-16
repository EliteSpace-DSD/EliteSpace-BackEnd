import express, { Request, Response } from 'express';
import { requiresAuthentication } from '../middleware/authMiddleware';
import { getPackagesByTenantId } from '../db/models/packages'
import { getTenantInfoByUserId } from '../db/models/tenant'
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
        try {
            const result = await getPackagesByTenantId(req.tenant.id);
            console.log(result);
            res.send("CHECK POINT 1, non-functional smartPackage endpoint");
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
            return;
        }
});

export default router;