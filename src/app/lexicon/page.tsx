'use client';

import { useEffect, useState } from 'react';
import { LexiconDataTable } from '@/components/lexicon/data-table';
import { useSearchParams } from 'next/navigation';

interface LexiconEntry {
  name: string;
  definition: string;
  slug: string;
}

export default function LexiconPage() {
  const [data, setData] = useState<LexiconEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const slug = searchParams.get('term');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/lexicon');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading lexicon data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Lexicon</h1>
      <LexiconDataTable data={data} initialSlug={slug} />
      <div className="mt-8 flex justify-center">
        <a
          href="/lexicon/submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Submit a New Lexicon Entry
        </a>
      </div>
    </div>
  );
} 