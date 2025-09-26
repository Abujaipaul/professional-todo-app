// src/components/AuthButton.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { logout } from '@/app/auth/actions'
import styles from './AuthButton.module.css'

export default async function AuthButton() {
  const supabase = createClient()
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