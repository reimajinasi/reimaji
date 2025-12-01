'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Newspaper, FileText, Settings } from 'lucide-react'

const sidebarItems = [
  {
    title: 'Overview',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'News Management',
    href: '/admin/news',
    icon: Newspaper,
  },
  {
    title: 'Research Papers',
    href: '/admin/research',
    icon: FileText,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <nav className='flex flex-col space-y-1'>
      {sidebarItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            variant={pathname === item.href ? 'secondary' : 'ghost'}
            className={cn('w-full justify-start', pathname === item.href && 'bg-muted font-medium')}
          >
            <item.icon className='mr-2 h-4 w-4' />
            {item.title}
          </Button>
        </Link>
      ))}
    </nav>
  )
}
