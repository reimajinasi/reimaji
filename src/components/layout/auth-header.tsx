"use client"
import Link from 'next/link'
import { SignedIn, SignedOut, UserButton, SignInButton, SignOutButton } from '@clerk/nextjs'

export function AuthHeader() {
  return (
    <div className='w-full border-b'>
      <div className='mx-auto max-w-7xl flex items-center justify-between px-4 py-2'>
        <Link href='/' className='text-sm font-medium'>Reimaji</Link>
        <div className='flex items-center gap-2'>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
            <SignOutButton />
          </SignedIn>
        </div>
      </div>
    </div>
  )
}
