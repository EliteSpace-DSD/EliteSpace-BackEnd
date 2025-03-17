/*

Description:
- With the earlier delivered package on the top, that one will be
used for demo purpose, pretending that we've picked up
the package.

1. query and get the earlier package from the tenant.
(used email to get tenant id)

2. use tenant id to get all his/her packages, in ascending order
on date time, the earlest paackage will be on the top, LIMIT 1.
(this will get the earliest delivered package's package id)

3. with package id, use it to update package status as "retrieved"

*/

import { getTenantByEmail } from "../../db/models/tenant";
import { getPackagesByTenantId, updatePackageStatus } from "../../db/models/packages";
import {updateSmartLockerStatus} from "../../db/models/smartLocker";
import {client} from "../../db/index";
import dotenv from 'dotenv';
dotenv.config();

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

const main = async () => {
    const email = process.env.EMAIL;
    const tenantId = await getTenantIdViaEmail();

    if (!tenantId) {
        console.error("Non-existing tenant ID");
        await client.end();
        return;
    } 

    const packages = await getPackagesByTenantId(tenantId);

    if (packages.length === 0) {
        console.error("No existing package!");
        await client.end();
        return;
    }

    const STATUS = "retrieved";
    const pickUpPackageId = packages[0].id;
    const updatedPackage = await updatePackageStatus(pickUpPackageId, STATUS);
    if (!updatedPackage) {
        console.error("Unable to update package status");
        await client.end();
        return;
    }

    if (updatedPackage.lockerId) {
        await updateSmartLockerStatus(updatedPackage.lockerId, false);
        console.log("Package pickup status update complete!");
    } else {
        console.error("Unable to update locker status");
    }
    
    await client.end();
};


main();