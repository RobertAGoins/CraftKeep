"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 p-8 dark:bg-black font-sans">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-purple-950 dark:text-purple-50">My Projects</h1>
          <Link
            href="/projects/create"
            className="rounded-full bg-purple-400 px-6 py-2 text-white font-medium hover:bg-purple-500 transition-colors"
          >
            Create New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow dark:bg-purple-950">
            <h3 className="text-xl font-medium text-purple-950 dark:text-purple-100">No projects yet</h3>
            <p className="mt-2 text-purple-600 dark:text-purple-400">Get started by creating your first project!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
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
