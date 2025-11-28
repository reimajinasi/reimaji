"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'

export default function Page() {
  const router = useRouter()
  const { signOut } = useClerk()

  useEffect(() => {
    ;(async () => {
      await signOut()
      router.replace('/sign-in')
    })()
  }, [router, signOut])

  return <div className='p-8 text-sm'>Signing out...</div>
}
