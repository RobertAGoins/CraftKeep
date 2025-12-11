import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const uploadDir = path.join(process.cwd(), "public", "uploads");

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    const where = query
      ? {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
          ],
        }
      : {};

    const projects = await prisma.project.findMany({
      where: where as any, // casting to avoid strict type issues if Prisma types aren't perfectly aligned with dynamic where
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error loading projects:", error);
    return NextResponse.json({ error: "Failed to load projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const file = formData.get("image") as File;

    if (!name || !file) {
      return NextResponse.json({ error: "Name and image are required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);

    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        imageUrl: `/uploads/${filename}`,
        userId: session?.user?.id,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error saving project:", error);
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 });
  }
}
