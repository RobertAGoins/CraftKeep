import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { prisma } from "@/lib/prisma";

const uploadDir = path.join(process.cwd(), "public", "uploads");

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
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
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error saving project:", error);
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 });
  }
}