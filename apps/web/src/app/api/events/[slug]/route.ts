import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Event } from '@/database';

interface RouteParams {
  params: Promise<{
    slug?: string;
  }>;
}

/**
 * GET /api/events/[slug]
 *
 * Returns a single event by its slug.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    console.log('Fetching event with slug:', slug);

    // Validate that a non-empty slug is provided.
    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
      return NextResponse.json(
        { message: 'A valid slug path parameter is required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Use lean for performance; converts Mongoose document to plain object.
    const event = await Event.findOne({ slug }).lean().exec();

    if (!event) {
      return NextResponse.json(
        { message: 'Event not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    // Log the error server-side for observability; avoid leaking internals in response.
    console.error('Error fetching event by slug:', error);

    return NextResponse.json(
      { message: 'An unexpected error occurred while fetching the event.' },
      { status: 500 }
    );
  }
}
