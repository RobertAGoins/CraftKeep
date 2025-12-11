import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function StashItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const item = await prisma.stashItem.findUnique({
    where: { id },
  });

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-purple-50 p-8 dark:bg-black font-sans">
      <div className="mx-auto max-w-4xl bg-white rounded-xl shadow-lg dark:bg-purple-900 overflow-hidden">
        
        {/* Header / Nav */}
        <div className="p-6 border-b border-purple-100 dark:border-purple-800 flex justify-between items-center">
            <Link 
                href="/stash" 
                className="text-purple-600 hover:text-purple-900 dark:text-purple-300 dark:hover:text-purple-100 flex items-center gap-2"
            >
                ← Back to Stash
            </Link>
        </div>

        {/* Item Image */}
        <div className="relative w-full h-96 bg-purple-100 dark:bg-purple-950">
           {item.imageUrl ? (
                <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-contain"
                    priority
                />
           ) : (
                <div className="flex items-center justify-center h-full text-purple-300">
                    <span className="text-lg">No image available</span>
                </div>
           )}
        </div>

        {/* Item Content */}
        <div className="p-8">
            <h1 className="text-3xl font-bold text-purple-950 dark:text-purple-50 mb-4">{item.name}</h1>
            
            <div className="flex items-center gap-4 text-sm text-purple-500 dark:text-purple-400 mb-6">
                <span>Added: {new Date(item.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-purple-800 dark:text-purple-200 text-lg leading-relaxed">
                    {item.description}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
