"use client"

import { signIn, signOut } from "next-auth/react"

export function LoginButton() {
  return (
    <button
      onClick={() => signIn()}
      className="rounded-full bg-purple-400 px-6 py-2 text-white font-medium hover:bg-purple-500 transition-colors"
    >
      Sign in
    </button>
  )
}

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="rounded-full border border-zinc-300 px-6 py-2 text-sm font-medium hover:bg-purple-100 dark:border-purple-800 dark:hover:bg-zinc-800 transition-colors"
    >
      Sign out
    </button>
  )
}
