import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { LoginButton, LogoutButton } from "@/components/AuthButtons";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex w-full items-center justify-between mb-8">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="CraftyKeep logo"
            width={100}
            height={20}
            priority
          />
          
          {session?.user ? (
             <div className="flex items-center gap-4">
                {session.user.image && (
                   <Image
                     src={session.user.image}
                     alt={session.user.name || "User"}
                     width={32}
                     height={32}
                     className="rounded-full border border-zinc-200 dark:border-zinc-700"
                   />
                )}
                <div className="hidden sm:flex flex-col text-right">
                   {session.user.id ? (
                       <Link href={`/profile/${session.user.id}`} className="hover:underline">
                           <span className="text-sm font-semibold dark:text-white">{session.user.name}</span>
                       </Link>
                   ) : (
                       <span className="text-sm font-semibold dark:text-white">{session.user.name}</span>
                   )}
                </div>
                <LogoutButton />
             </div>
          ) : (
             <LoginButton />
          )}
        </div>

        {/* CraftyKeep mascot */}
        <div className="mb-6">
            <Image
            src="/mascot.svg"
            alt="CraftyKeep mascot: cute cartoon cat crocheting"
            width={150}
            height={150}
            priority
            />
        </div>

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Welcome to CraftyKeep!
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {session ? `Hello, ${session.user?.name}! Ready to craft?` : "Please sign in to start tracking your projects."}
          </p>

          {session && (
            <div className="mt-4">
              <a
                href="/projects"
                className="rounded-full bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                View My Projects
              </a>
            </div>
          )}
          
          {!session && (
            <p className="max-w-md text-sm text-zinc-500">
              Looking for a starting point? Head over to the{" "}
               <a
              href="https://nextjs.org/learn?utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning Center
            </a>.
            </p>
          )}
        </div>
        
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row mt-12">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
