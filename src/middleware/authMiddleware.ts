import { Request, Response, NextFunction } from 'express';
import {authClient} from '../authClient';

export const requiresAuthentication =  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies['sb-access-token'];
        if (!token) {
            res.status(401).json({message: "Unauthorized. No session found."});
            return;
        }

        const {data, error} = await authClient.auth.getUser(token);

        if (error || !data.user) {
            res.status(401).json({message: "Invalid or expired session."});
            return;
        }

        //  Adding user property (object) to request object
        req.user = {
            userId: data.user.id, 
            email: data.user.email
        };
        next();
    } catch (err) {
        console.error('Auth middleware error:', err)        
        res.status(500).json({ message: 'Server error' });
        return;
    }
}