import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { name, definition, f3name, region } = await request.json();

    if (!name || !definition) {
      return NextResponse.json(
        { message: 'Name and definition are required' },
        { status: 400 }
      );
    }

    // Insert the new entry into the lexicon_submissions table
    await pool.query(
      'INSERT INTO xicon.lexicon_submissions (name, definition, f3name, region) VALUES ($1, $2, $3, $4)',
      [name, definition, f3name || null, region || null]
    );

    return NextResponse.json({ message: 'Entry submitted successfully' });
  } catch (error) {
    console.error('Error submitting lexicon entry:', error);
    
    // Check if it's a unique constraint violation
    if (error instanceof Error && error.message.includes('unique constraint')) {
      return NextResponse.json(
        { message: 'An entry with this name already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to submit entry' },
      { status: 500 }
    );
  }
} 