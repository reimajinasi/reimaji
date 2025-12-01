'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Plus, Eye } from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { format } from 'date-fns'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

export function NewsTable() {
  const { user } = useUser()
  const news = useQuery(api.news.listAll, { clerkUserId: user?.id ?? '' })
  const remove = useMutation(api.news.remove)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  if (!news) {
    return <div>Loading...</div>
  }

  const handleDelete = async () => {
    if (!deleteId || !user?.id) return
    try {
      // @ts-expect-error - ID type mismatch in generated types sometimes
      await remove({ id: deleteId, clerkUserId: user.id })
      toast.success('News article deleted')
      setDeleteId(null)
    } catch {
      toast.error('Failed to delete article')
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold tracking-tight'>News Articles</h2>
        <Link href='/admin/news/create'>
          <Button>
            <Plus className='mr-2 h-4 w-4' /> Create New
          </Button>
        </Link>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news.map((item) => (
              <TableRow key={item._id}>
                <TableCell className='font-medium'>{item.title}</TableCell>
                <TableCell>
                  <Badge variant={item.isPublished ? 'default' : 'secondary'}>
                    {item.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell className='capitalize'>{item.type}</TableCell>
                <TableCell>{item.viewCount}</TableCell>
                <TableCell>{format(new Date(item.createdAt), 'MMM d, yyyy')}</TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <Link href={`/news/${item.slug}`} target='_blank'>
                      <Button variant='ghost' size='icon'>
                        <Eye className='h-4 w-4' />
                      </Button>
                    </Link>
                    <Link href={`/admin/news/${item._id}`}>
                      <Button variant='ghost' size='icon'>
                        <Edit className='h-4 w-4' />
                      </Button>
                    </Link>
                    <AlertDialog
                      open={deleteId === item._id}
                      onOpenChange={(open) => !open && setDeleteId(null)}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='text-destructive hover:text-destructive'
                          onClick={() => setDeleteId(item._id)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the article.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {news.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className='h-24 text-center'>
                  No news articles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
