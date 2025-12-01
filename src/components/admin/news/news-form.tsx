'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { ImageUpload } from '@/components/ui/image-upload'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  summary: z.string().min(10, {
    message: 'Summary must be at least 10 characters.',
  }),
  content: z.string().min(10, {
    message: 'Content must be at least 10 characters.',
  }),
  type: z.enum(['tool', 'use_case', 'regulation']),
  tags: z.string(), // Comma separated string for input
  sourceUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  isPremium: z.boolean(),
  isPublished: z.boolean(),
})

interface NewsFormProps {
  initialData?: {
    _id?: Id<'news'>
    title: string
    summary: string
    content: string
    type: 'tool' | 'use_case' | 'regulation'
    tags: string[]
    sourceUrl?: string
    imageUrl?: string
    isPremium: boolean
    isPublished: boolean
  } | null
  isEdit?: boolean
}

export function NewsForm({ initialData, isEdit = false }: NewsFormProps) {
  const { user } = useUser()
  const router = useRouter()
  const create = useMutation(api.news.create)
  const update = useMutation(api.news.update)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      summary: initialData?.summary || '',
      content: initialData?.content || '',
      type: initialData?.type || 'tool',
      tags: initialData?.tags?.join(', ') || '',
      sourceUrl: initialData?.sourceUrl || '',
      imageUrl: initialData?.imageUrl || '',
      isPremium: initialData?.isPremium || false,
      isPublished: initialData?.isPublished || false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user?.id) return

    try {
      setIsLoading(true)
      const tagsArray = values.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      if (isEdit && initialData?._id) {
        await update({
          id: initialData._id,
          clerkUserId: user.id,
          title: values.title,
          summary: values.summary,
          content: values.content,
          type: values.type,
          tags: tagsArray,
          sourceUrl: values.sourceUrl,
          imageUrl: values.imageUrl,
          isPremium: values.isPremium,
          isPublished: values.isPublished,
        })
        toast.success('News article updated')
      } else {
        await create({
          clerkUserId: user.id,
          title: values.title,
          summary: values.summary,
          content: values.content,
          type: values.type,
          tags: tagsArray,
          sourceUrl: values.sourceUrl,
          imageUrl: values.imageUrl,
          isPremium: values.isPremium,
          isPublished: values.isPublished,
        })
        toast.success('News article created')
      }
      router.push('/admin/news')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='grid gap-8 md:grid-cols-2'>
          <div className='space-y-8'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Article title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='tool'>Tool</SelectItem>
                      <SelectItem value='use_case'>Use Case</SelectItem>
                      <SelectItem value='regulation'>Regulation</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='summary'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Brief summary of the article'
                      className='min-h-[100px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='tags'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='AI, Machine Learning, Future (comma separated)'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Separate tags with commas.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='space-y-8'>
            <FormField
              control={form.control}
              name='imageUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='sourceUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder='https://example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex flex-row gap-8'>
              <FormField
                control={form.control}
                name='isPremium'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Premium Content</FormLabel>
                      <FormDescription>Only available to pro users.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='isPublished'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Published</FormLabel>
                      <FormDescription>Visible to the public.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <RichTextEditor content={field.value || ''} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end'>
          <Button type='submit' disabled={isLoading}>
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {isEdit ? 'Update Article' : 'Create Article'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
