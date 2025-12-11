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
    <div className="min-h-screen bg-purple-50 p-8 dark:bg-black font-sans">
      <div className="mx-auto max-w-4xl bg-white rounded-xl shadow-lg dark:bg-purple-950 overflow-hidden">
        
        {/* Header / Nav */}
        <div className="p-6 border-b border-zinc-200 dark:border-purple-900 flex justify-between items-center">
            <Link 
                href="/projects" 
                className="text-purple-600 hover:text-purple-950 dark:text-purple-400 dark:hover:text-zinc-200 flex items-center gap-2"
            >
                ← Back to Projects
            </Link>
            {/* Future edit/delete buttons can go here */}
        </div>

        {/* Project Image */}
        <div className="relative w-full h-96 bg-purple-100 dark:bg-purple-900">
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
            <h1 className="text-3xl font-bold text-purple-950 dark:text-purple-50 mb-4">{project.name}</h1>
            
            <div className="flex items-center gap-4 text-sm text-purple-600 dark:text-purple-400 mb-6">
                <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>Last updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
            </div>

            <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-purple-800 dark:text-purple-300 text-lg leading-relaxed">
                    {project.description}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
