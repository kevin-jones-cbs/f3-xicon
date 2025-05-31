import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, name, slug, definition, aliases, created_at, updated_at
      FROM xicon.lexicon
      ORDER BY name ASC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching lexicon data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lexicon data' },
      { status: 500 }
    );
  }
} 