// src/lib/supabase.ts
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

// This is the one and only client for BROWSER components ('use client')
export const supabase = createPagesBrowserClient<Database>();