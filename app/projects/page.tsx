"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SearchInput from "@/components/SearchInput";

interface Project {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {
    async function fetchProjects() {
      if (projects.length > 0) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const url = query ? `/api/projects?q=${encodeURIComponent(query)}` : "/api/projects";
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
    fetchProjects();
  }, [query]);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-purple-950 dark:text-purple-50">My Projects</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative">
            <SearchInput placeholder="Search projects..." />
            {isRefreshing && (
              <div className="absolute right-3 top-2.5">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-500 border-t-transparent"></div>
              </div>
            )}
          </div>
          <Link
            href="/projects/create"
            className="rounded-full bg-purple-400 px-6 py-2 text-white font-medium hover:bg-purple-500 transition-colors whitespace-nowrap"
          >
            Create New Project
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-xl text-purple-600 dark:text-purple-300">Loading projects...</div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow dark:bg-purple-950">
          <h3 className="text-xl font-medium text-purple-950 dark:text-purple-100">
            {query ? `No projects found for "${query}"` : "No projects yet"}
          </h3>
          <p className="mt-2 text-purple-600 dark:text-purple-400">
            {query ? "Try a different search term" : "Get started by creating your first project!"}
          </p>
        </div>
      ) : (
        <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-200 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}>
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
    </>
  );
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-purple-50 p-8 dark:bg-black font-sans">
      <div className="mx-auto max-w-6xl">
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectsList />
        </Suspense>
      </div>
    </div>
  );
}
