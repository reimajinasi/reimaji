"use client"
import Link from "next/link"
export function AdminNav() {
  return (
    <nav aria-label="Admin navigation">
      <ul className="flex items-center gap-4 text-sm text-muted-foreground">
        <li>
          <Link className="hover:text-foreground" href="/admin">Overview</Link>
        </li>
        <li>
          <Link className="hover:text-foreground" href="/admin/content">Content</Link>
        </li>
      </ul>
    </nav>
  )
}
