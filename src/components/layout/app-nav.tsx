"use client"
import Link from "next/link"
export function AppNav() {
  return (
    <nav aria-label="App navigation">
      <ul className="flex items-center gap-4 text-sm text-muted-foreground">
        <li>
          <Link className="hover:text-foreground" href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link className="hover:text-foreground" href="/lms">LMS</Link>
        </li>
      </ul>
    </nav>
  )
}
