"use strict";
/*
APPROACH:
1. Delete all packages in packages table
2. Set all locker is_occupied as false
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const packages_1 = require("../../db/models/packages");
const smartLocker_1 = require("../../db/models/smartLocker");
const index_1 = require("../../db/index");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, packages_1.removeAllPackages)();
    console.log("Delete all pacakges operation complete!");
    yield (0, smartLocker_1.resetAllSmartLockerStatus)();
    console.log("Reset all locker as not occupied");
    yield index_1.client.end();
});
main();
