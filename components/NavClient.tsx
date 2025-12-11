"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { signIn, signOut } from "next-auth/react";

type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string;
};

export default function NavClient({ user }: { user?: User }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
               <Image src="/mascot.svg" alt="Logo" width={40} height={40} />
               <span className="font-bold text-xl text-zinc-900 dark:text-zinc-50">CraftyKeep</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {user && (
                  <Link 
                    href="/projects" 
                    className="border-transparent text-zinc-500 hover:border-blue-500 hover:text-zinc-700 dark:text-zinc-300 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                  >
                    Projects
                  </Link>
              )}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center gap-4">
            {user ? (
              <>
                 <Link href={`/profile/${user.id}`} className="flex items-center gap-2 group">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{user.name}</span>
                    {user.image ? (
                        <Image src={user.image} alt="" width={32} height={32} className="rounded-full border border-zinc-200 dark:border-zinc-700" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                           {(user.name?.[0] || "U").toUpperCase()}
                        </div>
                    )}
                 </Link>
                 <button
                    onClick={() => signOut()}
                    className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                 >
                    Sign out
                 </button>
              </>
            ) : (
              <button
                onClick={() => signIn()}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Sign in
              </button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
             <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
             >
                <span className="sr-only">Open main menu</span>
                {/* Icon */}
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {user && (
                <Link
                  href="/projects"
                  onClick={() => setIsOpen(false)}
                  className="bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium dark:bg-zinc-800 dark:border-blue-400 dark:text-blue-300"
                >
                  My Projects
                </Link>
            )}
          </div>
          <div className="pt-4 pb-4 border-t border-zinc-200 dark:border-zinc-700">
             {user ? (
                 <div className="flex items-center px-4">
                     <div className="flex-shrink-0">
                        {user.image ? (
                            <Image src={user.image} alt="" width={40} height={40} className="rounded-full" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                {(user.name?.[0] || "U").toUpperCase()}
                            </div>
                        )}
                     </div>
                     <div className="ml-3">
                         <div className="text-base font-medium text-zinc-800 dark:text-zinc-200">{user.name}</div>
                         <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{user.email}</div>
                     </div>
                     <button
                        onClick={() => signOut()}
                        className="ml-auto bg-white dark:bg-zinc-900 flex-shrink-0 p-1 rounded-full text-zinc-400 hover:text-zinc-500 focus:outline-none"
                     >
                        <span className="text-sm ml-2">Sign out</span>
                     </button>
                 </div>
             ) : (
                 <div className="px-4">
                     <button
                        onClick={() => signIn()}
                        className="block w-full text-center rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700"
                     >
                        Sign in
                     </button>
                 </div>
             )}
          </div>
        </div>
      )}
    </nav>
  );
}
