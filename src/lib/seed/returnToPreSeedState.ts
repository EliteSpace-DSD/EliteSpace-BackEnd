/*
APPROACH:
1. Delete all packages in packages table
2. Set all locker is_occupied as false
*/



import { removeAllPackages } from "../../db/models/packages";
import {updateSmartLockerStatus} from "../../db/models/smartLocker";
import {client} from "../../db/index";

const main = async () => {
    await removeAllPackages();
    console.log("Delete all pacakges operation complete!");
    await client.end();
};


main();