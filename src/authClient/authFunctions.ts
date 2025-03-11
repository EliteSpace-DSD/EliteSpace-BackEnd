import { Request, Response } from 'express';
import { EmailOtpType } from '@supabase/supabase-js';
import { authClient, newServerClient } from '.';

interface VerifyOtpParams {
    type: EmailOtpType,
    token_hash: string,
    req: Request,
    res: Response
};

export async function signUpNewUser(email: string, password: string) {
    const redirectURL = process.env.EMAIL_REDIRECT_URL;

    const { data, error } = await authClient.auth.signUp({
        email: email,
        password: password,
        options: {
            emailRedirectTo: redirectURL,
        },
    });

    return { data, error };
};

export async function signInWithEmail(email: string, password: string) {
    const { data, error } = await authClient.auth.signInWithPassword({
        email: email,
        password: password,
    });

    return { data, error };
};

export async function linkUserToTenant(email: string, authUserId: string) {
    const { data, error } = await authClient.from('tenants')
        .update({ user_id: authUserId })
        .eq('email', email);

    return { data, error };
};

export async function initiatePasswordReset(email: string) {
    const { data, error } = await authClient.auth.resetPasswordForEmail(email);

    return { data, error };
};

export async function updatePassword(req: Request, res: Response) {
    const { newPassword } = req.body;
    const serverClient = newServerClient({ req, res })
    const { data, error } = await serverClient.auth.updateUser({
        password: newPassword,
    });

    return { data, error };
};

export async function verifyOtp({ type, token_hash, req, res }: VerifyOtpParams) {
    const serverClient = newServerClient({ req, res });
    const { error } = await serverClient.auth.verifyOtp({
        type,
        token_hash
    });

    return error;
}