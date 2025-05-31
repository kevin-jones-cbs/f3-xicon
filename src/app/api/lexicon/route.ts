import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export async function GET() {
  try {
    const result = await getDbPool().query('SELECT name, definition, slug, aliases FROM xicon.lexicon order by name');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lexicon data' },
      { status: 500 }
    );
  }
} 