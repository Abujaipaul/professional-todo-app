// src/app/auth/actions.ts
'use server'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Database } from '@/types/supabase';

export async function logout() {
  const cookieStore = cookies();
  const supabase = createServerActionClient<Database>({ cookies: () => cookieStore });
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}