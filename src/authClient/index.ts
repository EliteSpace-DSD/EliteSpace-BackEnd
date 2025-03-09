import { createClient } from '@supabase/supabase-js';
import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'
import { Request, Response } from 'express';

const { SUPABASE_URL, SUPABASE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase variables missing from env');
}

export const authClient = createClient(SUPABASE_URL, SUPABASE_KEY);

export const newServerClient = (context: { req: Request, res: Response }) => {
    return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
        cookies: {
            getAll() {
                return parseCookieHeader(context.req.headers.cookie ?? '')
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) =>
                    context.res.setHeader('Set-Cookie', serializeCookieHeader(name, value, options))
                )
            },
        },
    })
};
