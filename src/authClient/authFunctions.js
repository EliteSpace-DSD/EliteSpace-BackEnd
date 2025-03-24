"use strict";
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
exports.signUpNewUser = signUpNewUser;
exports.signInWithEmail = signInWithEmail;
exports.linkUserToTenant = linkUserToTenant;
exports.initiatePasswordReset = initiatePasswordReset;
exports.updatePassword = updatePassword;
exports.verifyOtp = verifyOtp;
exports.signout = signout;
const _1 = require(".");
const redirectURL = process.env.EMAIL_REDIRECT_URL;
function signUpNewUser(email, password, userData) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield _1.authClient.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: `${redirectURL}?next=https://elitespace.netlify.app/login`,
                data: userData, // passes first_name into Supabase .Data to be used in email configuration
            },
        });
        return { data, error };
    });
}
function signInWithEmail(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield _1.authClient.auth.signInWithPassword({
            email: email,
            password: password,
        });
        return { data, error };
    });
}
function linkUserToTenant(email, authUserId, phone, dob) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield _1.authClient.from("tenants").update({ user_id: authUserId, phone: phone, dob: dob }).eq("email", email);
        console.log(data);
        return { data, error };
    });
}
function initiatePasswordReset(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield _1.authClient.auth.resetPasswordForEmail(email, {
            redirectTo: `${redirectURL}?next=https://elitespace.netlify.app/update-password`
        });
        return { data, error };
    });
}
function updatePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { newPassword } = req.body;
        const serverClient = (0, _1.newServerClient)({ req, res });
        const { data, error } = yield serverClient.auth.updateUser({
            password: newPassword,
        });
        return { data, error };
    });
}
function verifyOtp(_a) {
    return __awaiter(this, arguments, void 0, function* ({ type, token_hash, req, res }) {
        const serverClient = (0, _1.newServerClient)({ req, res });
        const { error } = yield serverClient.auth.verifyOtp({
            type,
            token_hash,
        });
        return error;
    });
}
function signout() {
    return __awaiter(this, void 0, void 0, function* () {
        // Add {scope: 'local'} as an arg for signOut() to only logout from that one client
        // by default, all active sessions are terminated.
        const { error } = yield _1.authClient.auth.signOut();
        return error;
    });
}
