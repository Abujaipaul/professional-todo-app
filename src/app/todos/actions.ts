
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type SimpleTodo = {
  id: number;
  title: string;
  completed: boolean;
}

// Helper to get the user or redirect
async function getUserOrRedirect() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

// READ ALL
export async function getTodos(): Promise<SimpleTodo[]> {
  const user = await getUserOrRedirect()
  const supabase = createClient()
  const { data } = await supabase.from('todos').select('id, title, completed').eq('user_id', user.id).order('created_at', { ascending: false })
  return data?.map(todo => ({ id: todo.id, title: todo.title || '', completed: todo.completed || false })) || []
}

// CREATE
export async function addTodo(formData: FormData): Promise<{ error?: string }> {
  const user = await getUserOrRedirect()
  const title = String(formData.get('title'))
  if (!title.trim()) return { error: 'Title is required.' }

  const supabase = createClient()
  const { error } = await supabase.from('todos').insert({ title, user_id: user.id })
  if (error) return { error: 'Failed to add todo.' }
  
  revalidatePath('/todos')
  return {}
}

// READ ONE
export async function getTodoById(todoId: number): Promise<SimpleTodo | null> {
    const user = await getUserOrRedirect()
    const supabase = createClient()
    const { data } = await supabase.from('todos').select('id, title, completed').eq('id', todoId).eq('user_id', user.id).single()
    if (!data) return null;
    return { id: data.id, title: data.title || '', completed: data.completed || false };
}

// UPDATE
export async function updateTodo(todo: SimpleTodo): Promise<{ error?: string }> {
  const user = await getUserOrRedirect()
  const supabase = createClient()
  const { error } = await supabase.from('todos').update({ title: todo.title, completed: todo.completed }).eq('id', todo.id).eq('user_id', user.id)
  if (error) return { error: 'Failed to update todo.' }
  
  revalidatePath('/todos')
  revalidatePath(`/todos/${todo.id}`)
  return {}
}

// DELETE
export async function deleteTodo(todoId: number): Promise<{ error?: string }> {
  const user = await getUserOrRedirect()
  const supabase = createClient()
  const { error } = await supabase.from('todos').delete().eq('id', todoId).eq('user_id', user.id)
  if (error) return { error: 'Failed to delete todo.' }
  
  revalidatePath('/todos')
  return {}
}