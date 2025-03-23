import express, { Request, Response } from 'express';
import {createPackages} from "../lib/seed/generatePackages";
import {retrievePackage} from "../lib/seed/emulatePickUpOnePackage";

const router = express.Router();

router.post('/createPackages', async (req: Request, res: Response) => {
        try {
            console.log("Action received, package creation logic invoked....");
            // If no existing packages, generate 3 packages
            // If there are existing packages, do nothing
            await createPackages();

            // 204 (No content), end b/c no response is needed.
            res.status(204).end();
        } catch (error) {
            console.error("Error package generation: ", error);
            res.status(500).json({ message: 'Server error' });
            return;
        }
});

router.post('/retrieveEarliestPackage', async (req: Request, res: Response) => {
    try {
        console.log("Package retrieve action received....");

        await retrievePackage();

        res.status(204).end();
    } catch (error) {
        console.error("Retrieved error: ", error);
        res.status(500).json({ message: 'Server error' });
        return;
    }
});

export default router;