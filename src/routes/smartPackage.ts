import express, { Request, Response } from 'express';
import { requiresAuthentication } from '../middleware/authMiddleware';
import { getPackagesByTenantId } from '../db/models/packages'
import { getTenantInfoByUserId } from '../db/models/tenant'
const router = express.Router();

export interface Package {
    id: string;
    deliveredDateTime: Date | null;
    status: 'delivered' | 'retrieved';
}

// PackagesResponse is now an array of Package objects
export type PackagesResponse = Package[];

router.get('/', async (req: Request, res: Response) => {
        try {
            const packagesArr = await getPackagesByTenantId(req.tenant.id);
            if (!packagesArr) {
                console.error("Unable to properly retrieve packages info");
                return;
            }
            //Front end needs to check the length of the array, if EQUAL 0, then show
            // UI that reflects that

            const responseData: PackagesResponse = packagesArr.map(individualpackage => {
                return {
                    id: individualpackage.id,
                    deliveredDateTime: individualpackage.deliveryTime, 
                    status: individualpackage.status as 'delivered' | 'retrieved'
                };
            });

            res.status(200).json(responseData);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
            return;
        }
});

export default router;