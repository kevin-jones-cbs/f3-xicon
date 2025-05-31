import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { name, definition, aliases, f3name, region } = await request.json();

    // Validate required fields
    if (!name || !definition) {
      return NextResponse.json(
        { error: 'Name and definition are required' },
        { status: 400 }
      );
    }

    // Check if name already exists
    const existingCheck = await getDbPool().query(
      'SELECT id FROM xicon.lexicon_submissions WHERE name = $1',
      [name]
    );

    if (existingCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'An entry with this name already exists' },
        { status: 400 }
      );
    }

    // Insert the submission
    const result = await getDbPool().query(
      `INSERT INTO xicon.lexicon_submissions 
       (name, definition, aliases, f3name, region)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [name, definition, aliases || null, f3name || null, region || null]
    );

    return NextResponse.json({ 
      message: 'Entry submitted successfully',
      id: result.rows[0].id 
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to submit entry' },
      { status: 500 }
    );
  }
} 