import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      projects: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-purple-50 p-8 dark:bg-black font-sans">
      <div className="mx-auto max-w-6xl">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 dark:bg-purple-950 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Image */}
          <div className="relative w-32 h-32 flex-shrink-0">
            {user.image ? (
                <Image
                    src={user.image}
                    alt={user.name || "User"}
                    fill
                    className="rounded-full object-cover border-4 border-zinc-100 dark:border-purple-900"
                />
            ) : (
                <div className="w-full h-full rounded-full bg-purple-100 flex items-center justify-center text-purple-500 text-4xl font-bold">
                    {(user.name?.[0] || user.email?.[0] || "?").toUpperCase()}
                </div>
            )}
          </div>
          
          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-purple-950 dark:text-purple-50">{user.name || "Anonymous User"}</h1>
            {user.email && <p className="text-purple-600 dark:text-purple-400 mt-1">{user.email}</p>}
            <p className="mt-4 text-purple-700 dark:text-purple-300">
                Member since {new Date().toLocaleDateString()} {/* createdAt isn't on User yet, defaulting */}
            </p>
          </div>
        </div>

        {/* Projects Section */}
        <h2 className="text-2xl font-bold text-purple-950 dark:text-purple-50 mb-6">Projects ({user.projects.length})</h2>
        
        {user.projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow dark:bg-purple-950">
            <h3 className="text-xl font-medium text-purple-950 dark:text-purple-100">No projects yet</h3>
            <p className="mt-2 text-purple-600 dark:text-purple-400">This user hasn't created any projects.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {user.projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="block">
                <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-purple-950 transition-transform hover:scale-[1.02] h-full">
                  <div className="relative h-48 w-full">
                    <Image
                      src={project.imageUrl}
                      alt={project.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-purple-950 dark:text-purple-100">{project.name}</h3>
                    <p className="mt-2 text-sm text-purple-600 dark:text-purple-400 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="mt-4 text-xs text-purple-400">
                      Created: {new Date(project.createdAt).toLocaleDateString()}
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
