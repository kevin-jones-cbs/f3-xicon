'use client';

import { useEffect, useState } from 'react';

interface LexiconEntry {
  name: string;
  definition: string;
  slug: string;
}

export default function LexiconPage() {
  const [data, setData] = useState<LexiconEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="space-y-4">
        {data.map((entry) => (
          <div key={entry.slug} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{entry.name}</h2>
            <p className="text-gray-600 mt-2">{entry.definition}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 