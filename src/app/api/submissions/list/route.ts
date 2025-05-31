import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDbPool } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get submissions from both tables
    const [exiconResult, lexiconResult] = await Promise.all([
      getDbPool().query(`
        SELECT 
          id,
          name,
          submitted_on,
          f3name,
          region,
          video_url
        FROM xicon.exicon_submissions
        ORDER BY submitted_on DESC
      `),
      getDbPool().query(`
        SELECT 
          id,
          name,
          submitted_on,
          f3name,
          region
        FROM xicon.lexicon_submissions
        ORDER BY submitted_on DESC
      `)
    ]);

    return NextResponse.json({
      exiconSubmissions: exiconResult.rows,
      lexiconSubmissions: lexiconResult.rows
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 