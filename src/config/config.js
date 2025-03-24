"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
exports.default = {
    HOST: process.env.HOST || "localhost",
    PORT: Number(process.env.PORT) || 3000,
};
