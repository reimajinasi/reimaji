'use client'

import { useState, useRef } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)

      // 1. Get upload URL
      const postUrl = await generateUploadUrl()

      // 2. Upload file
      const result = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      if (!result.ok) {
        throw new Error(`Upload failed: ${result.statusText}`)
      }

      const { storageId } = await result.json()

      // 3. Construct URL (or just return storageId if that's what we store)
      // Assuming we store the full URL or use a helper to get it.
      // For now, let's assume we store the storageId and the parent component handles display,
      // OR we fetch the URL.
      // Actually, standard Convex pattern is storing storageId.
      // But for simplicity in this CMS, let's assume we want the public URL.
      // Wait, we can't easily get the public URL synchronously without another query.
      // So we will pass back the storageId.
      // NOTE: The parent form should handle `storageId` vs `url`.
      // If the schema expects a string URL, we might need to adjust.
      // Looking at schema: `imageUrl: v.optional(v.string())`
      // It seems we are storing the URL string in the DB based on existing schema?
      // Let's check schema again. `imageUrl: v.optional(v.string())`.
      // So we probably want the full URL.
      // However, Convex `storageId` is better.
      // Let's return the storageId for now, and the parent can decide.
      // Actually, to display it immediately, we can use `URL.createObjectURL(file)` for preview.

      // Let's update the schema to use storageId if possible, but the schema said `v.string()`.
      // If we store the full URL: `https://<deployment>.convex.cloud/api/storage/<storageId>`

      const url = `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${storageId}`
      onChange(url)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    onChange('')
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-4'>
        {value ? (
          <div className='relative aspect-video w-40 overflow-hidden rounded-md border'>
            <Image src={value} alt='Upload preview' fill className='object-cover' />
            <button
              onClick={handleRemove}
              className='absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm hover:bg-destructive/90'
              type='button'
              disabled={disabled}
            >
              <X className='h-3 w-3' />
            </button>
          </div>
        ) : (
          <div className='flex aspect-video w-40 items-center justify-center rounded-md border border-dashed bg-muted text-muted-foreground'>
            <Upload className='h-6 w-6' />
          </div>
        )}
        <div className='flex flex-col gap-2'>
          <Button
            type='button'
            variant='outline'
            disabled={disabled || isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Uploading...
              </>
            ) : (
              'Upload Image'
            )}
          </Button>
          <Input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            className='hidden'
            onChange={handleUpload}
            disabled={disabled || isUploading}
          />
          <p className='text-xs text-muted-foreground'>Supported formats: JPG, PNG, WEBP</p>
        </div>
      </div>
    </div>
  )
}
