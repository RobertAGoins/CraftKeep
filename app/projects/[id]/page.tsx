import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-black font-sans">
      <div className="mx-auto max-w-4xl bg-white rounded-xl shadow-lg dark:bg-zinc-900 overflow-hidden">
        
        {/* Header / Nav */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
            <Link 
                href="/projects" 
                className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center gap-2"
            >
                ← Back to Projects
            </Link>
            {/* Future edit/delete buttons can go here */}
        </div>

        {/* Project Image */}
        <div className="relative w-full h-96 bg-zinc-100 dark:bg-zinc-800">
           <Image
             src={project.imageUrl}
             alt={project.name}
             fill
             className="object-contain"
             priority
           />
        </div>

        {/* Project Content */}
        <div className="p-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">{project.name}</h1>
            
            <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>Last updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
            </div>

            <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 text-lg leading-relaxed">
                    {project.description}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
