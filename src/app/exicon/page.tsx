'use client';

import { useEffect, useState, Suspense } from 'react';
import ExerciseList from '@/components/ExerciseList';
import { ExerciseEntry } from '@/types/excercise-entry';
import { useStarredExercises } from '@/utils/starredExercises';

const ALL_TAGS = [
  'Arms',
  'Cardio',
  'Core',
  'Coupon',
  'Full Body',
  'Legs',
  'Mary',
  'Music',
  'Run',
  'Routine',
  'Warmup',
  'Video',
  '⭐ Starred'
] as const;

export default function ExiconPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading exicon data...</div>
      </div>
    }>
      <ExiconContent />
    </Suspense>
  );
}

function ExiconContent() {
  const [data, setData] = useState<ExerciseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { starredExercises } = useStarredExercises();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/exicon');
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
      const response = await fetch(`/api/exicon/${slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete exercise');
      }

      // Remove the deleted exercise from the data
      setData(prevData => prevData.filter(exercise => exercise.slug !== slug));
    } catch (err) {
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading exicon data...</div>
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
      title="F3 Exicon"
      description="Searchable exercise definitions for F3 workouts"
      showTags={true}
      showVideos={true}
      allTags={ALL_TAGS}
      onDelete={handleDelete}
      editPath="/exicon/submit"
    />
  );
} 