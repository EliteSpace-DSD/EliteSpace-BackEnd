"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newServerClient = exports.authClient = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabase_js_1 = require("@supabase/supabase-js");
const ssr_1 = require("@supabase/ssr");
const { SUPABASE_URL, SUPABASE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase variables missing from env');
}
exports.authClient = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_KEY);
const newServerClient = (context) => {
    return (0, ssr_1.createServerClient)(SUPABASE_URL, SUPABASE_KEY, {
        cookies: {
            getAll() {
                var _a;
                return (0, ssr_1.parseCookieHeader)((_a = context.req.headers.cookie) !== null && _a !== void 0 ? _a : '');
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => context.res.setHeader('Set-Cookie', (0, ssr_1.serializeCookieHeader)(name, value, options)));
            },
        },
    });
};
exports.newServerClient = newServerClient;
