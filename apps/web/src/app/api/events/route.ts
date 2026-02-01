import { NextResponse, NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";

import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/database/event.model";



// -------------------------------
// Generate slug manually
// -------------------------------
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await request.formData();
    const event = Object.fromEntries(formData.entries());

    const title = event.title;
    if (typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { message: "Title field is required to generate slug" },
        { status: 400 }
      );
    }
    event.title = title.trim();

    // Validate price
    if (!event.price) {
      return NextResponse.json(
        { message: "Price field is required" },
        { status: 400 }
      );
    }

    event.slug = generateSlug(event.title as string);
    if (!event.slug) {
      return NextResponse.json(
        { message: "Unable to generate slug from the provided title" },
        { status: 400 }
      );
    }

    // Get file
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 }
      );
    }

    // Convert image to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "events" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    event.image = (uploadResult as { secure_url: string }).secure_url;

    const createdEvent = await Event.create(event);

    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Event creation failed:", error);

    return NextResponse.json(
      {
        message: "Event creation failed",
        error:
          error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    const events = await Event.find().sort({ date: 1 });

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch events",
        error:
          error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 }
    );
  }
}