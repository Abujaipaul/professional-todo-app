// src/app/todos/page.tsx
import { getTodos, SimpleTodo } from './actions'
import TodoListClient from './TodoListClient'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Database } from '@/types/supabase'

export default async function TodosPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore })
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }
  
  const initialTodos: SimpleTodo[] = await getTodos()
  return <TodoListClient initialTodos={initialTodos} />
}