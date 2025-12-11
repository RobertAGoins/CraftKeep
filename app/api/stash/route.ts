import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const uploadDir = path.join(process.cwd(), "public", "uploads");

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await prisma.stashItem.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error loading stash:", error);
    return NextResponse.json({ error: "Failed to load stash" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const file = formData.get("image") as File | null;

    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 });
    }

    let imageUrl = null;

    if (file && file.size > 0 && file.name !== "undefined") {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `stash-${Date.now()}-${file.name.replace(/\s/g, "_")}`;
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);
        imageUrl = `/uploads/${filename}`;
    }

    const newItem = await prisma.stashItem.create({
      data: {
        name,
        description,
        imageUrl,
        userId: session.user.id,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error saving stash item:", error);
    return NextResponse.json({ error: "Failed to save item" }, { status: 500 });
  }
}
