import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function StashPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/api/auth/signin?callbackUrl=/stash");
  }

  const items = await prisma.stashItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-purple-50 p-8 dark:bg-black font-sans">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-purple-950 dark:text-purple-50">My Stash</h1>
          <Link
            href="/stash/add"
            className="rounded-full bg-purple-500 px-6 py-2 text-white font-medium hover:bg-purple-600 transition-colors"
          >
            Add Item
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow dark:bg-purple-900">
            <h3 className="text-xl font-medium text-purple-900 dark:text-purple-100">Your stash is empty</h3>
            <p className="mt-2 text-purple-600 dark:text-purple-300">Start tracking your yarn, fabric, and tools!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Link key={item.id} href={`/stash/${item.id}`} className="block">
                <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-purple-950 transition-transform hover:scale-[1.02] h-full flex flex-col">
                  <div className="relative h-48 w-full bg-purple-100 dark:bg-purple-900">
                    {item.imageUrl ? (
                        <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-purple-300">
                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                  </div>
                  <div className="p-6 flex-1">
                    <h3 className="text-xl font-semibold text-purple-950 dark:text-purple-100">{item.name}</h3>
                    {item.description && (
                        <p className="mt-2 text-sm text-purple-600 dark:text-purple-300 line-clamp-3">
                        {item.description}
                        </p>
                    )}
                    <div className="mt-4 text-xs text-purple-400 dark:text-purple-500">
                      Added: {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
