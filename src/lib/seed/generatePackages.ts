import {client} from "../../db/index";
import dotenv from 'dotenv';
dotenv.config();

import { getTenantByEmail } from "../../db/models/tenant";
import {getAllOpenSmartLockers, updateSmartLockerStatus} from "../../db/models/smartLocker";
import {createPackage} from "../../db/models/packages";

const getTenantIdViaEmail = async () => {
    const email = process.env.EMAIL;
    if (!email) {
        console.error("EMAIL environment variable is not set");
    } else {
        const tenantInfo = await getTenantByEmail(email);
        if (!tenantInfo) {
            console.error("Not a valid tenant email");
            return null;
        } else {
            return tenantInfo.id;
        }
        
    }    
}

const createTwoSeedPackages = async (twoAvailableLockers: string[], tenantId: string) => {
    for (let lockerId of twoAvailableLockers) {
        await updateSmartLockerStatus(lockerId, true);
    }

    const timeStampOne = new Date(); // Current date and time
    const timeStampTwo = new Date(); // Current date and time
    // Subtract 5 hours
    timeStampOne.setHours(timeStampOne.getHours() - 5);
    
    const packageOneDetails = {
        tenantId: tenantId,
        lockerId: twoAvailableLockers[0],
        lockerCode: '8e3K9s',
        status: 'delivered' as 'delivered' | 'retrieved',
        deliveryTime: timeStampOne 
    };

    const packageTwoDetails = {
        tenantId: tenantId,
        lockerId: twoAvailableLockers[1],
        lockerCode: '0zk238',
        status: 'delivered' as 'delivered' | 'retrieved',
        deliveryTime: timeStampTwo 
    };

    await createPackage(packageOneDetails);
    await createPackage(packageTwoDetails);
};


const main = async () => {
    const email = process.env.EMAIL;

    const tenantId = await getTenantIdViaEmail();
    if (!tenantId) {
        console.error("None-existing tenant id");
    } else {
        // console.log(tenantId);
        let availableLockers = await getAllOpenSmartLockers();
        if (availableLockers.length < 2) {
            console.log("Less than 2 lockers left, unable to create seed data for 2 packages");
        } else {
        
            const twoAvailableLockers = [availableLockers[0].id, availableLockers[1].id]
            console.log(twoAvailableLockers);
            await createTwoSeedPackages(twoAvailableLockers, tenantId);
        }
        
    }


    await client.end();
}

main();
