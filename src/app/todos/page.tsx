
import { getTodos, SimpleTodo } from './actions'
import TodoListClient from './TodoListClient'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function TodosPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }
  
  const initialTodos: SimpleTodo[] = await getTodos()
  return <TodoListClient initialTodos={initialTodos} />
}