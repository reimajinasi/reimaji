"use client"
import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { UserMenu } from './user-menu'

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
            <UserMenu />
          </SignedIn>
        </div>
      </div>
    </div>
  )
}
