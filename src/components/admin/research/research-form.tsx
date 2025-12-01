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
  implication: z.string().min(10, {
    message: 'Implication must be at least 10 characters.',
  }),
  content: z.string().min(10, {
    message: 'Content must be at least 10 characters.',
  }),
  tags: z.string(), // Comma separated string for input
  paperUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  isPremium: z.boolean(),
  isPublished: z.boolean(),
})

interface ResearchFormProps {
  initialData?: {
    _id?: Id<'research'>
    title: string
    summary: string
    implication: string
    content: string
    tags: string[]
    paperUrl?: string
    imageUrl?: string
    isPremium: boolean
    isPublished: boolean
  } | null
  isEdit?: boolean
}

export function ResearchForm({ initialData, isEdit = false }: ResearchFormProps) {
  const { user } = useUser()
  const router = useRouter()
  const create = useMutation(api.research.create)
  const update = useMutation(api.research.update)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      summary: initialData?.summary || '',
      implication: initialData?.implication || '',
      content: initialData?.content || '',
      tags: initialData?.tags?.join(', ') || '',
      paperUrl: initialData?.paperUrl || '',
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
          implication: values.implication,
          content: values.content,
          tags: tagsArray,
          paperUrl: values.paperUrl,
          imageUrl: values.imageUrl,
          isPremium: values.isPremium,
          isPublished: values.isPublished,
        })
        toast.success('Research paper updated')
      } else {
        await create({
          clerkUserId: user.id,
          title: values.title,
          summary: values.summary,
          implication: values.implication,
          content: values.content,
          tags: tagsArray,
          paperUrl: values.paperUrl,
          imageUrl: values.imageUrl,
          isPremium: values.isPremium,
          isPublished: values.isPublished,
        })
        toast.success('Research paper created')
      }
      router.push('/admin/research')
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
                    <Input placeholder='Paper title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='summary'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary / Abstract</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Brief summary of the research'
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
              name='implication'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Implication</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Practical implications of the research'
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
                    <Input placeholder='AI, Ethics, Policy (comma separated)' {...field} />
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
              name='paperUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paper URL (PDF/Link)</FormLabel>
                  <FormControl>
                    <Input placeholder='https://arxiv.org/...' {...field} />
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
              <FormLabel>Full Content / Analysis</FormLabel>
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
            {isEdit ? 'Update Paper' : 'Create Paper'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
