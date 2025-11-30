"use client"
import { UserProfile } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="p-6">
      <UserProfile />
    </div>
  )
}
