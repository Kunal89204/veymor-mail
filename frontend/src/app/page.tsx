'use client'
import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
const Home = () => {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    setTimeout(() => {
      router.push('/auth/login')
    }, 100);
  }

  return (
    <div>
      <h1>Home</h1>

      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

export default Home