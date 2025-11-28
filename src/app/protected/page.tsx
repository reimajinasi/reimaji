export const dynamic = 'force-dynamic'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { api } from '../../../convex/_generated/api'

export default async function Page() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  await fetchMutation(api.users.upsertFromClerk, {
    clerkUserId: user.id,
    email: user.emailAddresses?.[0]?.emailAddress,
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
  })
  const dbUser = await fetchQuery(api.users.getByClerkId, { clerkUserId: user.id })
  return (
    <div className='p-8 space-y-2'>
      <div className='text-xl'>Protected content</div>
      <div className='text-sm'>Email: {dbUser?.email ?? '—'}</div>
      <div className='text-sm'>Role: {dbUser?.role ?? '—'}</div>
    </div>
  )
}
