
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { Database } from './lib/database.types';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

async function createAdmin() {
    console.log('Creating admin user via SDK...');

    const email = 'admin@trantor.com';
    const password = 'admin123';

    // 1. Sign Up (This handles hashing correctly)
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name: 'Administrador Global',
                role: 'ADMIN',
                department: 'IT'
            }
        }
    });

    if (error) {
        console.error('Error signing up:', error.message);
        // If user already exists (maybe delete didn't work?), try to sign in
        return;
    }

    console.log('User created via SDK. ID:', data.user?.id);
    console.log('Next step: Manually confirm email via SQL.');
}

createAdmin();
