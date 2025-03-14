import express, { Request, Response } from 'express';
import { requiresAuthentication } from '../middleware/authMiddleware';
import { getPackagesByTenantId } from '../db/models/packages'
const router = express.Router();

router.get('/', 
    requiresAuthentication,
    async (req: Request, res: Response) => {
        try {
            const authUserId = req.user.userId;
            // const result = await getPackagesByTenantId(authUserId);
            // console.log(authUserId);
            res.send("CHECK POINT 1, non-functional smartPackage endpoint");
        } catch (error) {

        }
    // const { data, error } = await updatePassword(req, res);

    // if (error) {
    //     console.log(error);
    //     res.status(400).json({ message: 'Not authorized. Unable to reset password.' });
    //     return;
    // }

    // res.status(200).json({ message: 'Password reset successfully.' });
    // return;
});

export default router;