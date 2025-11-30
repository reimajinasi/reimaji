export const dynamic = 'force-dynamic'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { fetchQuery, fetchMutation } from 'convex/nextjs'
import { api } from '../../../../convex/_generated/api'
import { PageHeader } from '@/components/layout/page-header'
import { ContentCard } from '@/components/layout/content-card'
import { Section } from '@/components/layout/section'
import type { Doc, Id } from '../../../../convex/_generated/dataModel'

const ROLES = ['guest', 'free', 'pro', 'admin', 'superadmin'] as const

export default async function Page() {
  const { userId } = await auth()
  if (!userId) {
    return <div className="p-6 text-sm">Unauthorized</div>
  }
  const client = await clerkClient()
  const clerkUser = await client.users.getUser(userId)
  const users: Array<Doc<'users'>> = await fetchQuery(api.users.listAll, { clerkUserId: clerkUser.id })

  async function updateRole(formData: FormData) {
    'use server'
    const targetId = formData.get('targetId') as string
    const role = formData.get('role') as (typeof ROLES)[number]
    await fetchMutation(api.users.updateRole, {
      clerkUserId: clerkUser.id,
      targetUserId: targetId as Id<'users'>,
      role,
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader title="User Management" description="Kelola role pengguna" breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Users' }]} />
      <Section>
        <ContentCard title="Daftar Pengguna" description="Ubah role pengguna">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Nama</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: Doc<'users'>) => (
                  <tr key={u._id} className="border-b">
                    <td className="p-2">{u.email ?? '—'}</td>
                    <td className="p-2">{[u.firstName, u.lastName].filter(Boolean).join(' ') || '—'}</td>
                    <td className="p-2">{u.role}</td>
                    <td className="p-2">
                      <form action={updateRole} className="flex items-center gap-2">
                        <input type="hidden" name="targetId" value={u._id} />
                        <select name="role" defaultValue={u.role} className="rounded border p-1">
                          {ROLES.map(r => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                        <button type="submit" className="rounded bg-primary px-3 py-1 text-primary-foreground">
                          Update
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ContentCard>
      </Section>
    </div>
  )
}
