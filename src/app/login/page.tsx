// src/app/login/page.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.refresh()
        router.push('/todos')
      }
    })
    return () => subscription.unsubscribe()
  }, [supabase, router])

  return (
    <div style={{ maxWidth: '420px', margin: '96px auto', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-md)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--color-primary)' }}>Welcome</h1>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]} // Empty array defaults to Email/Password
      />
    </div>
  )
}