// src/app/todos/page.tsx
import { getTodos, SimpleTodo } from './actions'
import TodoListClient from './TodoListClient'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Database } from '@/types/supabase'

export default async function TodosPage() {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }
  
  const initialTodos: SimpleTodo[] = await getTodos()
  return <TodoListClient initialTodos={initialTodos} />
}