import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-purple-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center justify-center py-16 px-6 bg-white dark:bg-black sm:items-start sm:px-16">
        
        {/* CraftyKeep mascot */}
        <div className="mb-8">
            <Image
            src="/mascot.svg"
            alt="CraftyKeep mascot: cute cartoon cat crocheting"
            width={180}
            height={180}
            priority
            />
        </div>

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-purple-50">
            Welcome to CraftyKeep!
          </h1>
          <p className="max-w-md text-lg leading-8 text-purple-700 dark:text-purple-400">
            {session ? `Hello, ${session.user?.name}! Ready to craft?` : "Your personal space to track projects, manage your stash, and unleash your creativity."}
          </p>

          {session ? (
            <div className="mt-4 flex gap-4">
              <Link
                href="/projects"
                className="rounded-full bg-purple-400 px-6 py-3 text-white font-medium hover:bg-purple-500 transition-colors inline-block"
              >
                View My Projects
              </Link>
              <Link
                href="/projects/create"
                className="rounded-full border border-zinc-300 px-6 py-3 text-purple-800 font-medium hover:bg-purple-100 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-zinc-800 transition-colors inline-block"
              >
                New Project
              </Link>
            </div>
          ) : (
             <div className="mt-4">
                <p className="text-purple-600 dark:text-purple-400">
                    Sign in to start tracking your projects.
                </p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}