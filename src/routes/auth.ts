import express, { Request, Response } from 'express';
import { getTenantByEmail } from '../db/models/tenant';
import { signUpNewUser, linkUserToTenant, signInWithEmail } from '../authClient/authFunctions';

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
            const errorMsg = error.code === 'weak_password' ? 'Password not strong enough. Must be atleast 6 characters.' : 'Error signing up';
            res.status(500).json({ message: errorMsg });
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


// Note: users needs to click confirm on their confirmation email before being able to sign in
router.post('/signin', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const {data, error} = await signInWithEmail(email, password);

        if (error) {
            res.status(401).json({ message: 'Invalid email or password. Please try again.' });
            return 
        }

        // Set session cookie (for persistence)
        const {session} = data;
        if (!session) {
            res.status(500).json({message: "failed to retrieve session."});
            return;
        }

        // access token expires_in by default is 3600 seconds, * 1000 = 3600000 milliseconds = 1 hour
        res.cookie('sb-access-token', session.access_token, {
            httpOnly: true, //Prevents JS access
            // secure: true, // only sent over HTTPS, set as true only in production
            sameSite: 'strict',
            maxAge: session.expires_in * 1000,

        })

        res.status(200).json({ message: 'Signed in successfully'});
        return;

    } catch (error) {
        res.status(500).json({message: 'Server error'});
        return;
    }
})

export default router;