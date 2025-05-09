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

const createThreeSeedPackages = async (threeAvailableLockers: string[], tenantId: string) => {
    for (let lockerId of threeAvailableLockers) {
        await updateSmartLockerStatus(lockerId, true);
    }

    const timeStampTwo = new Date(); // Current date and time
    const timeStampOne = new Date(); // Current date and time
    const timeStampThree = new Date(); // Current date and time

    // Subtract 5 hours
    timeStampOne.setHours(timeStampOne.getHours() - 5);
    timeStampThree.setHours(timeStampThree.getHours() - 10);
    
    const packageOneDetails = {
        tenantId: tenantId,
        lockerId: threeAvailableLockers[0],
        lockerCode: '8e3K9s',
        status: 'retrieved' as 'delivered' | 'retrieved',
        deliveryTime: timeStampOne 
    };

    const packageTwoDetails = {
        tenantId: tenantId,
        lockerId: threeAvailableLockers[1],
        lockerCode: '0zk238',
        status: 'retrieved' as 'delivered' | 'retrieved',
        deliveryTime: timeStampTwo 
    };

    const packageThreeDetails = {
        tenantId: tenantId,
        lockerId: threeAvailableLockers[2],
        lockerCode: 'ys3ldZ',
        status: 'delivered' as 'delivered' | 'retrieved',
        deliveryTime: timeStampThree 
    };

    await createPackage(packageThreeDetails);
    await createPackage(packageOneDetails);
    await createPackage(packageTwoDetails);  
};


export const createPackages = async () => {
    const tenantId = await getTenantIdViaEmail();
    if (!tenantId) {
        console.error("None-existing tenant id");
    } else {
        // console.log(tenantId);
        let availableLockers = await getAllOpenSmartLockers();
        const EXISTING_LOCKER_AMT = 5;
        if (availableLockers.length !== EXISTING_LOCKER_AMT) {
            console.log("There are lockers occupied, not going to generate packages");
        } else {    
            const threeAvailableLockers = [availableLockers[0].id, availableLockers[1].id, availableLockers[2].id]
            await createThreeSeedPackages(threeAvailableLockers, tenantId);
            console.log("Three packages, creation complete!!");
        }
        
    }


    // await client.end();
}