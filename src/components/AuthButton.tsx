// src/components/AuthButton.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { logout } from '@/app/auth/actions'
import styles from './AuthButton.module.css'
import { Database } from '@/types/supabase'

export default async function AuthButton() {
   const cookieStore = cookies()
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore })
  const { data: { user } } = await supabase.auth.getUser()

  return user ? (
    <div className={styles.container}>
      <span className={styles.emailText}>Hey, {user.email}</span>
      <form action={logout}>
        <button className={styles.logoutButton}>Logout</button>
      </form>
    </div>
  ) : (
    <Link href="/login" className={styles.loginButton}>Login</Link>
  )
}