
import { createClient } from '@supabase/supabase-js';
import { Database } from './lib/database.types';
import * as dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://erzuccfcabkocmopxftk.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_U_GosiZ6RbhQwMKlJiglhw_7Np-m7wj';

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

async function verifyIntegration() {
    console.log('Starting verification...');

    // 1. Verify Data Fetching (Tickets)
    console.log('1. Fetching tickets...');
    const { data: tickets, error: fetchError } = await supabase
        .from('tracker_tickets')
        .select('*')
        .limit(5);

    if (fetchError) {
        console.error('❌ Error fetching tickets:', fetchError);
        process.exit(1);
    }
    console.log(`✅ Fetched ${tickets.length} tickets.`);

    // 2. Verify Mutation (Create Ticket)
    const testTicketId = `TEST-${Date.now()}`;
    console.log(`2. Creating test ticket ${testTicketId}...`);
    const { error: createError } = await supabase
        .from('tracker_tickets')
        .insert({
            id: testTicketId,
            title: 'Verification Ticket',
            description: 'This is a test ticket created by the verification script.',
            module_id: '1', // Ensure module 1 exists from seed
            module_name: 'Compras',
            priority: 'LOW',
            status: 'OPEN',
            requester: 'Verification Script'
        });

    if (createError) {
        console.error('❌ Error creating ticket:', createError);
        process.exit(1);
    }
    console.log('✅ Ticket created successfully.');

    // 3. Verify Mutation Result (Fetch specific ticket)
    console.log('3. Verifying ticket persistence...');
    const { data: fetchTicket, error: fetchTestError } = await supabase
        .from('tracker_tickets')
        .select('*')
        .eq('id', testTicketId)
        .single();

    if (fetchTestError || !fetchTicket) {
        console.error('❌ Error verifying ticket persistence:', fetchTestError);
        process.exit(1);
    }
    console.log('✅ Ticket persisted and retrieved.');

    // 4. Verify Update (Add Comment/Update)
    console.log('4. Adding comment to ticket...');
    const { error: commentError } = await supabase
        .from('tracker_ticket_updates')
        .insert({
            ticket_id: testTicketId,
            author: 'Verification Script',
            message: 'Test comment',
            type: 'COMMENT'
        });

    if (commentError) {
        console.error('❌ Error adding comment:', commentError);
        // Don't exit, try to cleanup
    } else {
        console.log('✅ Comment added.');
    }

    // 5. Cleanup (Delete Ticket)
    console.log('5. Cleaning up (Deleting test ticket)...');
    const { error: deleteError } = await supabase
        .from('tracker_tickets')
        .delete()
        .eq('id', testTicketId);

    if (deleteError) {
        console.error('❌ Error deleting ticket:', deleteError);
        process.exit(1);
    }
    console.log('✅ Ticket deleted.');

    console.log('🎉 Verification completed successfully!');
}

verifyIntegration();
