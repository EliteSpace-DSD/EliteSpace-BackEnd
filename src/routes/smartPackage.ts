import express, { Request, Response } from 'express';
import { requiresAuthentication } from '../middleware/authMiddleware';
import { getPackagesByTenantId } from '../db/models/packages'
import { getTenantInfoByUserId } from '../db/models/tenant'
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
        try {
            const authUserId = req.user.userId;
            //NOTE: wont be getting tenantId if i introduce it to middleware
            let result = await getTenantInfoByUserId(authUserId);
            console.log(result);
            // const tenantId: string | null = await getTenantInfoByUserId(authUserId);
            // if (!tenantId) {
            //     res.status(200).json({message: "invalid tenant id"});
            //     return;
            // }
            // const result = await getPackagesByTenantId(tenantId);
            // console.log(result);
            res.send("CHECK POINT 1, non-functional smartPackage endpoint");
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
            return;
        }
});

export default router;