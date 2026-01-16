
import { createClient } from '@supabase/supabase-js'
import { MODULES, CUSTOM_DEVS, TIMELINE, PENDING_ACTIONS, SUPPORT_TICKETS, FAQS, TUTORIALS } from './constants.ts'
import { Database } from './lib/database.types'

import * as dotenv from 'dotenv'

// Load env vars
dotenv.config({ path: '.env.local' })

// Re-initialize client here strictly for the script to avoid relative import issues if run with tsx/node directly
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://erzuccfcabkocmopxftk.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_U_GosiZ6RbhQwMKlJiglhw_7Np-m7wj'
const supabase = createClient<Database>(supabaseUrl, supabaseKey)

async function seed() {
    console.log('🌱 Starting seed...')

    // 1. Modules & Features
    console.log('Inserting Modules...')
    for (const mod of MODULES) {
        const { error: modError } = await supabase
            .from('tracker_modules')
            .upsert({
                id: mod.id,
                name: mod.name,
                description: mod.description,
                status: mod.status,
                icon: mod.icon,
                owner: mod.owner,
                progress: mod.progress
            })
        if (modError) console.error('Error inserting module:', mod.name, modError)

        if (mod.features && mod.features.length > 0) {
            // Create features. IDs are auto-generated in DB, but we pass name/status.
            // We don't have IDs in constants for submodules, so we just insert.
            // To avoid duplicates on re-run, we might want to delete existing features for this module first?
            // For simplicity in this seed, we'll delete features for the module first.
            await supabase.from('tracker_module_features').delete().eq('module_id', mod.id)

            const featuresToInsert = mod.features.map(f => ({
                module_id: mod.id,
                name: f.name,
                status: f.status
            }))

            const { error: featError } = await supabase
                .from('tracker_module_features')
                .insert(featuresToInsert)
            if (featError) console.error('Error inserting features for module:', mod.name, featError)
        }
    }

    // 2. Custom Developments
    console.log('Inserting Custom Devs...')
    for (const dev of CUSTOM_DEVS) {
        const { error } = await supabase.from('tracker_custom_developments').upsert({
            id: dev.id,
            title: dev.title,
            description: dev.description,
            requested_by: dev.requestedBy,
            status: dev.status,
            delivery_date: dev.deliveryDate
        })
        if (error) console.error('Error inserting custom dev:', dev.id, error)
    }

    // 3. Timeline & Tasks
    console.log('Inserting Timeline...')
    for (const event of TIMELINE) {
        const { error: eventError } = await supabase.from('tracker_timeline_events').upsert({
            id: event.id,
            phase: event.phase,
            date_range: event.date,
            status: event.status,
            description: event.description,
            modules_included: event.modulesIncluded || []
        })
        if (eventError) console.error('Error inserting timeline event:', event.id, eventError)

        if (event.tasks && event.tasks.length > 0) {
            // Clear existing tasks for this event
            await supabase.from('tracker_timeline_tasks').delete().eq('timeline_event_id', event.id)

            const tasksToInsert = event.tasks.map(t => ({
                id: t.id,
                timeline_event_id: event.id,
                title: t.title,
                status: t.status,
                week: t.week
            }))

            const { error: taskError } = await supabase.from('tracker_timeline_tasks').insert(tasksToInsert)
            if (taskError) console.error('Error inserting tasks for event:', event.id, taskError)
        }
    }

    // 4. Action Items
    console.log('Inserting Action Items...')
    for (const action of PENDING_ACTIONS) {
        const { error } = await supabase.from('tracker_action_items').upsert({
            id: action.id,
            task: action.task,
            assigned_to: action.assignedTo,
            due_date: action.dueDate,
            is_critical: action.isCritical,
            status: action.status
        })
        if (error) console.error('Error inserting action:', action.id, error)
    }

    // 5. Tickets & Updates
    console.log('Inserting Tickets...')
    for (const ticket of SUPPORT_TICKETS) {
        const { error: ticketError } = await supabase.from('tracker_tickets').upsert({
            id: ticket.id,
            title: ticket.title,
            description: ticket.description,
            module_id: ticket.moduleId,
            module_name: ticket.moduleName,
            priority: ticket.priority,
            status: ticket.status,
            requester: ticket.requester,
            created_at: ticket.createdAt, // Assumes ISO string or similar
            updated_at: ticket.updatedAt
        })
        if (ticketError) console.error('Error inserting ticket:', ticket.id, ticketError)

        if (ticket.updates && ticket.updates.length > 0) {
            // Clear updates
            await supabase.from('tracker_ticket_updates').delete().eq('ticket_id', ticket.id)

            const updatesToInsert = ticket.updates.map(u => ({
                ticket_id: ticket.id,
                author: u.author,
                date: u.date,
                message: u.message,
                type: u.type
            }))

            const { error: updateError } = await supabase.from('tracker_ticket_updates').insert(updatesToInsert)
            if (updateError) console.error('Error inserting updates for ticket:', ticket.id, updateError)
        }
    }

    // 6. FAQs
    console.log('Inserting FAQs...')
    for (const faq of FAQS) {
        const { error } = await supabase.from('tracker_faqs').upsert({
            id: faq.id,
            category: faq.category,
            question: faq.question,
            answer: faq.answer
        })
        if (error) console.error('Error inserting FAQ:', faq.id, error)
    }

    // 7. Tutorials
    console.log('Inserting Tutorials...')
    for (const tut of TUTORIALS) {
        const { error } = await supabase.from('tracker_tutorials').upsert({
            id: tut.id,
            title: tut.title,
            duration: tut.duration,
            type: tut.type,
            thumbnail_color: tut.thumbnailColor
        })
        if (error) console.error('Error inserting Tutorial:', tut.id, error)
    }

    console.log('✅ Seed completed!')
}

seed().catch(console.error)
