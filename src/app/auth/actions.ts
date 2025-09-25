
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  
  // Revalidate the entire layout to ensure user state is cleared
  revalidatePath('/', 'layout')
  
  redirect('/login')
}