"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useAuth, useUser, SignOutButton, SignInButton } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'

function Chevron({ open }: { open: boolean }) {
  return (
    <svg width='14' height='14' viewBox='0 0 24 24' fill='none' className='ml-1 inline-block'>
      {open ? (
        <path d='M7 15l5-5 5 5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      ) : (
        <path d='M7 9l5 5 5-5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      )}
    </svg>
  )
}

export function UserMenu() {
  const { userId } = useAuth()
  const { user: clerkUser } = useUser()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const user = useQuery(api.users.getByClerkId, userId ? { clerkUserId: userId } : 'skip')
  const isAdmin = !!user && (user.role === 'admin' || user.role === 'superadmin')

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const displayName = clerkUser?.fullName || clerkUser?.username || clerkUser?.primaryEmailAddress?.emailAddress || 'Akun'
  const avatarUrl = clerkUser?.imageUrl

  return (
    <div className='relative' ref={menuRef}>
      <button
        className='flex items-center gap-2 px-2 py-1 text-sm border border-border rounded bg-background text-foreground hover:bg-muted hover:text-black'
        onClick={() => setOpen(o => !o)}
        aria-haspopup='menu'
        aria-expanded={open}
      >
        {avatarUrl ? <Image src={avatarUrl} alt='avatar' width={20} height={20} className='h-5 w-5 rounded-full' /> : <span className='h-5 w-5 rounded-full bg-muted inline-block' />}
        <span className='text-foreground hover:text-black'>{displayName}</span>
        <Chevron open={open} />
      </button>
      {open && (
        <div className='absolute right-0 mt-2 w-44 border rounded bg-background shadow-sm z-50'>
          {userId ? (
            <div className='py-1'>
              <Link href='/dashboard' className='block px-3 py-2 text-sm text-foreground hover:bg-muted'>Dashboard</Link>
              {isAdmin && <Link href='/admin' className='block px-3 py-2 text-sm text-foreground hover:bg-muted'>Admin</Link>}
              <div className='px-3 py-2 text-sm'>
                <SignOutButton />
              </div>
            </div>
          ) : (
            <div className='py-1'>
              <div className='px-3 py-2 text-sm'>
                <SignInButton />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
