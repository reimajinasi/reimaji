'use client'

import { useAuth, useClerk } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { PageHeader } from '@/components/layout/page-header'
import { Section } from '@/components/layout/section'
import { ContentCard } from '@/components/layout/content-card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { userId } = useAuth()
  const { signOut } = useClerk()
  const router = useRouter()
  const user = useQuery(api.users.getByClerkId, { clerkUserId: userId ?? '' })
  const deleteAccount = useMutation(api.users.deleteAccount)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!userId) return
    if (!confirm('Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.'))
      return

    setIsDeleting(true)
    try {
      await deleteAccount({})
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Failed to delete account:', error)
      alert('Gagal menghapus akun. Silakan coba lagi.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Profile'
        description='Kelola informasi akun Anda.'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Profile' }]}
      />

      <Section>
        <ContentCard title='Informasi Pribadi'>
          <div className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='text-sm font-medium text-muted-foreground'>Nama Depan</label>
                <div className='mt-1 p-2 border rounded bg-muted/50'>{user.firstName || '-'}</div>
              </div>
              <div>
                <label className='text-sm font-medium text-muted-foreground'>Nama Belakang</label>
                <div className='mt-1 p-2 border rounded bg-muted/50'>{user.lastName || '-'}</div>
              </div>
              <div>
                <label className='text-sm font-medium text-muted-foreground'>Email</label>
                <div className='mt-1 p-2 border rounded bg-muted/50'>{user.email || '-'}</div>
              </div>
              <div>
                <label className='text-sm font-medium text-muted-foreground'>Role</label>
                <div className='mt-1 p-2 border rounded bg-muted/50 capitalize'>{user.role}</div>
              </div>
            </div>
          </div>
        </ContentCard>
      </Section>

      <Section>
        <ContentCard title='Danger Zone' className='border-red-200'>
          <div className='flex items-center justify-between'>
            <div>
              <h4 className='font-medium text-red-900'>Hapus Akun</h4>
              <p className='text-sm text-red-700'>
                Menghapus akun Anda secara permanen dan semua data terkait.
              </p>
            </div>
            <Button variant='destructive' onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Menghapus...' : 'Hapus Akun'}
            </Button>
          </div>
        </ContentCard>
      </Section>
    </div>
  )
}
