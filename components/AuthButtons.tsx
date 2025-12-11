"use client"

import { signIn, signOut } from "next-auth/react"

export function LoginButton() {
  return (
    <button
      onClick={() => signIn()}
      className="rounded-full bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
    >
      Sign in
    </button>
  )
}

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="rounded-full border border-zinc-300 px-6 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800 transition-colors"
    >
      Sign out
    </button>
  )
}
