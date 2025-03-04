import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase variables missing from env');
}

export const authClient = createClient(SUPABASE_URL, SUPABASE_KEY);