import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; // Or SERVICE_ROLE_KEY if available in env

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing environment variables");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfile() {
    // First, get the user ID from Auth (if possible, otherwise search by email)
    // Since I don't have the user's session here, I'll query profiles directly if I can, 
    // but RLS will block me if I use anon key and not logged in.
    // This script is intended to be run locally where I might have service role or just testing public access if any.
    // However, better approach for "assistant" is to just log what code would do if run in browser.
    
    // Actually, let's try to find the user by email if possible (requires Service Role usually)
    // If we only have anon key, we can't see other users' data due to RLS.
    
    console.log("Checking connection...");
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    if (error) {
        console.error("Error connecting/reading profiles:", error);
    } else {
        console.log(`Connection successful. Found ${data} profiles (visible to anon).`);
    }
}

checkProfile();
