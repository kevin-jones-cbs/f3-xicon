import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDbPool } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, definition, video_url, tags, aliases } = await request.json();

    // Validate required fields
    if (!name || !definition) {
      return NextResponse.json(
        { error: 'Name and definition are required' },
        { status: 400 }
      );
    }

    // Check if name already exists
    const existingCheck = await getDbPool().query(
      'SELECT id FROM xicon.exicon WHERE name = $1',
      [name]
    );

    if (existingCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'An exercise with this name already exists' },
        { status: 400 }
      );
    }

    // Create slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Insert the entry directly into exicon table
    const result = await getDbPool().query(
      `INSERT INTO xicon.exicon 
       (name, definition, video_url, tags, aliases, slug)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, definition, video_url || null, tags || null, aliases || null, slug]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create exercise' },
      { status: 500 }
    );
  }
} 