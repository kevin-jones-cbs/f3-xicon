import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDbPool } from '@/lib/db';

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.pathname.split('/').pop(); // or use regex if needed
  try {
    const { rows } = await getDbPool().query(
      'SELECT * FROM xicon.exicon WHERE slug = $1',
      [slug]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching exercise:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exercise' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const slug = request.nextUrl.pathname.split('/').pop(); // or use regex if needed
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, definition, video_url, tags, aliases } = body;

    // Validate required fields
    if (!name || !definition) {
      return NextResponse.json(
        { error: 'Name and definition are required' },
        { status: 400 }
      );
    }

    // Update the exercise
    const { rows } = await getDbPool().query(
      `UPDATE xicon.exicon
       SET 
         name = $1,
         definition = $2,
         video_url = $3,
         tags = $4,
         aliases = $5,
         updated_at = NOW()
       WHERE slug = $6
       RETURNING *`,
      [name, definition, video_url || null, tags || null, aliases || null, slug]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error updating exercise:', error);
    return NextResponse.json(
      { error: 'Failed to update exercise' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const slug = request.nextUrl.pathname.split('/').pop(); // or use regex if needed
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete the exercise
    const { rows } = await getDbPool().query(
      `DELETE FROM xicon.exicon
       WHERE slug = $1
       RETURNING *`,
      [slug]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting exercise:', error);
    return NextResponse.json(
      { error: 'Failed to delete exercise' },
      { status: 500 }
    );
  }
} 