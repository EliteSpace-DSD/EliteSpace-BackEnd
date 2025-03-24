import express, { Request, Response } from 'express';
import { getPackagesByTenantId, getPackageById } from '../db/models/packages'
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

router.get('/:packageId', async (req: Request, res: Response) => {
    const packageId = req.params.packageId;
    try {
        const returnedPackage = await getPackageById(packageId);

        if (!returnedPackage) {
            res.status(400).json({message: "Invalid package object"});
            return;
        }

        if (!returnedPackage.lockerCode) {
            res.status(400).json({message: "Invalid package id"});
            return;
        }

        if (!returnedPackage.deliveryTime) {
            res.status(400).json({message: "No delivery time"});
            return;
        }

        const responseData = {
            code: returnedPackage.lockerCode, 
            deliveryTime: returnedPackage.deliveryTime
        };

        res.status(200).json(responseData);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        return;
    }
});

export default router;