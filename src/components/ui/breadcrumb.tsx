import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Breadcrumb({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <nav aria-label="Breadcrumb" className={cn('text-sm text-muted-foreground', className)} {...props} />
}

export function BreadcrumbList({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn('flex items-center gap-2', className)} {...props} />
}

export function BreadcrumbItem({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={cn('flex items-center', className)} {...props} />
}

export function BreadcrumbSeparator({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span role="presentation" className={cn('mx-2 text-muted-foreground', className)} {...props}>/</span>
}

export function BreadcrumbLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={cn('hover:text-foreground underline-offset-2 hover:underline', className)}>
      {children}
    </Link>
  )
}
