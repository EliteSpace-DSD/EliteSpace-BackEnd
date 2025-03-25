import { Request, Response, NextFunction } from 'express';
import {authClient} from '../authClient';
import { getTenantInfoByUserId } from '../db/models/tenant'

export const requiresAuthentication =  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies['sb-access-token'];
        if (!token) {
            res.status(401).json({message: "Unauthorized. No session found."});
            console.error("Unauthorized. No session found.");
            return;
        }

        const {data, error} = await authClient.auth.getUser(token);

        if (error || !data.user) {
            res.status(401).json({message: "Invalid or expired session."});
            console.error("Invalid or expired session.");
            return;
        }

        //  Adding user property (object) to request object
        req.user = {
            userId: data.user.id, 
            email: data.user.email
        };

        const tenantInfo = await getTenantInfoByUserId(data.user.id);
        if (!tenantInfo) {
            res.status(401).json({message: "unable to find tenant in query"});
            console.error("unable to find tenant in query");
            return;          
        }

        req.tenant = {
            id: tenantInfo.id,       
            firstName: tenantInfo.firstName, 
            lastName: tenantInfo.lastName,   
            email: tenantInfo.email          
        };

        next();
    } catch (err) {
        console.error('Auth middleware error:', err)        
        res.status(500).json({ message: 'Server error' });
        return;
    }
}