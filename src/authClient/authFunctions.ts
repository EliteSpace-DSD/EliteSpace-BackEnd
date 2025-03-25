import { Request, Response } from "express";
import { EmailOtpType } from "@supabase/supabase-js";
import { authClient, newServerClient } from ".";

const redirectURL = process.env.EMAIL_REDIRECT_URL;

interface VerifyOtpParams {
  type: EmailOtpType;
  token_hash: string;
  req: Request;
  res: Response;
}

export async function signUpNewUser(email: string, password: string, first_name: string) {
  const { data, error } = await authClient.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: `${redirectURL}?next=https://elitespace.netlify.app/login`,
      data: {
        user_metadata: {
          first_name
        }
      }, // passes first_name into Supabase .Data to be used in email configuration
    },
  });

  return { data, error };
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await authClient.auth.signInWithPassword({
    email: email,
    password: password,
  });

  return { data, error };
}

export async function linkUserToTenant(email: string, authUserId: string, phone: string, dob: string) {
  const { data, error } = await authClient.from("tenants").update({ user_id: authUserId, phone: phone, dob: dob }).eq("email", email);
  console.log(data);
  return { data, error };
}

export async function initiatePasswordReset(email: string) {
  const { data, error } = await authClient.auth.resetPasswordForEmail(email, {
    redirectTo: `${redirectURL}?next=https://elitespace.netlify.app/update-password`
});

  return { data, error };
}

export async function updatePassword(req: Request, res: Response) {
  const { newPassword } = req.body;
  const serverClient = newServerClient({ req, res });
  const { data, error } = await serverClient.auth.updateUser({
    password: newPassword,
  });

  return { data, error };
}

export async function verifyOtp({ type, token_hash, req, res }: VerifyOtpParams) {
  const serverClient = newServerClient({ req, res });
  const { error } = await serverClient.auth.verifyOtp({
    type,
    token_hash,
  });

  return error;
}

export async function signout() {
  // Add {scope: 'local'} as an arg for signOut() to only logout from that one client
  // by default, all active sessions are terminated.
  const { error } = await authClient.auth.signOut();
  return error;
}
