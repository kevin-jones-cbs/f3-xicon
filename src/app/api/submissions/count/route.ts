import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import pool from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get counts from both tables
    const [exiconResult, lexiconResult] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM xicon.exicon_submissions'),
      pool.query('SELECT COUNT(*) FROM xicon.lexicon_submissions')
    ]);

    const exiconCount = parseInt(exiconResult.rows[0].count);
    const lexiconCount = parseInt(lexiconResult.rows[0].count);

    return NextResponse.json({
      exiconCount,
      lexiconCount,
      totalCount: exiconCount + lexiconCount
    });
  } catch (error) {
    console.error('Error fetching submission counts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 