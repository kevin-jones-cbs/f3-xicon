import { useEffect, useState } from 'react';

const STARRED_EXERCISES_KEY = 'starred_exercises';

export function useStarredExercises() {
  const [starredExercises, setStarredExercises] = useState<string[]>([]);

  useEffect(() => {
    // Load starred exercises from localStorage on mount
    const stored = localStorage.getItem(STARRED_EXERCISES_KEY);
    if (stored) {
      setStarredExercises(JSON.parse(stored));
    }
  }, []);

  const toggleStar = (slug: string) => {
    setStarredExercises(prev => {
      const newStarred = prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : [...prev, slug];
      
      // Save to localStorage
      localStorage.setItem(STARRED_EXERCISES_KEY, JSON.stringify(newStarred));
      return newStarred;
    });
  };

  const isStarred = (slug: string) => {
    return starredExercises.includes(slug);
  };

  return {
    starredExercises,
    toggleStar,
    isStarred
  };
} 