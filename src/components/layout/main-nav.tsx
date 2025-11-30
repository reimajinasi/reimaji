"use client"
import Link from "next/link"
export function MainNav() {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex items-center gap-4 text-sm text-muted-foreground">
        <li>
          <Link className="hover:text-foreground" href="/">Home</Link>
        </li>
        <li>
          <Link className="hover:text-foreground" href="/news">News</Link>
        </li>
        <li>
          <Link className="hover:text-foreground" href="/research">Research</Link>
        </li>
      </ul>
    </nav>
  )
}
