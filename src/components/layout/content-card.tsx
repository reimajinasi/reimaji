import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ContentCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
}

export function ContentCard({ title, description, children, className, headerClassName, contentClassName }: ContentCardProps) {
  return (
    <Card className={cn('shadow-sm', className)}>
      <CardHeader className={headerClassName}>
        <CardTitle className="text-xl">{title}</CardTitle>
        {description && <CardDescription className="mt-1">{description}</CardDescription>}
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  )
}
