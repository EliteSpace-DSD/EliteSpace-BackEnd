import { authClient } from '.';

export async function signUpNewUser(email: string, password: string) {
    const { data, error } = await authClient.auth.signUp({
        email: email,
        password: password,
        options: {
            emailRedirectTo: 'http://elite.space/dashboard',
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