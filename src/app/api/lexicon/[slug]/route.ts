import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDbPool } from '@/lib/db';

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.pathname.split('/').pop();
  try {
    const { rows } = await getDbPool().query(
      'SELECT * FROM xicon.lexicon WHERE slug = $1',
      [slug]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching entry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entry' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const slug = request.nextUrl.pathname.split('/').pop();
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, definition, aliases } = body;

    // Validate required fields
    if (!name || !definition) {
      return NextResponse.json(
        { error: 'Name and definition are required' },
        { status: 400 }
      );
    }

    // Update the entry
    const { rows } = await getDbPool().query(
      `UPDATE xicon.lexicon
       SET 
         name = $1,
         definition = $2,
         aliases = $3,
         updated_at = NOW()
       WHERE slug = $4
       RETURNING *`,
      [name, definition, aliases || null, slug]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error updating entry:', error);
    return NextResponse.json(
      { error: 'Failed to update entry' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const slug = request.nextUrl.pathname.split('/').pop();
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete the entry
    const { rows } = await getDbPool().query(
      `DELETE FROM xicon.lexicon
       WHERE slug = $1
       RETURNING *`,
      [slug]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete entry' },
      { status: 500 }
    );
  }
} 