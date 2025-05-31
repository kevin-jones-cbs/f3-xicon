'use client';

import ExerciseSubmit from '@/components/ExerciseSubmit';

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
  'Warmup'
] as const;

export default function ExiconSubmitPage() {
  return (
    <ExerciseSubmit
      title="Submit Exicon Entry"
      description="Add a new exercise to the F3 Exicon"
      showTags={true}
      showVideos={true}
      allTags={ALL_TAGS}
      apiPath="/api/exicon"
    />
  );
} 