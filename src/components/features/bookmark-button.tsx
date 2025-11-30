"use client"
import { useAuth } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Button } from '@/components/ui/button'

export function BookmarkButton({ kind, entityId }: { kind: 'news' | 'research' | 'lesson'; entityId: string }) {
  const { userId } = useAuth()
  const isBookmarked = useQuery(
    api.bookmarks.isBookmarked,
    userId ? { clerkUserId: userId, kind, entityId } : 'skip'
  )
  const toggle = useMutation(api.bookmarks.toggle)

  if (!userId) return null

  return (
    <Button
      size='sm'
      variant={isBookmarked ? 'secondary' : 'outline'}
      onClick={() => toggle({ clerkUserId: userId, kind, entityId })}
    >
      {isBookmarked ? 'Bookmarked' : 'Bookmark'}
    </Button>
  )
}
