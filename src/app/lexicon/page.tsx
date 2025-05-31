'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ExerciseList from '@/components/ExerciseList';
import { ExerciseEntry } from '@/types/excercise-entry';

export default function LexiconPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading lexicon data...</div>
      </div>
    }>
      <LexiconContent />
    </Suspense>
  );
}

function LexiconContent() {
  const [data, setData] = useState<ExerciseEntry[]>([]);
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

  const handleDelete = async (slug: string) => {
    try {
      const response = await fetch(`/api/lexicon/${slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      // Remove the deleted entry from the data
      setData(prevData => prevData.filter(entry => entry.slug !== slug));
    } catch (err) {
      throw err;
    }
  };

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
    <ExerciseList
      data={data}
      title="F3 Lexicon"
      description="Searchable F3 terminology and definitions"
      showTags={false}
      showVideos={false}
      onDelete={handleDelete}
      editPath="/lexicon/submit"
    />
  );
} 