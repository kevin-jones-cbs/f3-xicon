'use client';

import ExerciseSubmit from '@/components/ExerciseSubmit';

export default function LexiconSubmitPage() {
  return (
    <ExerciseSubmit
      title="Submit Lexicon Entry"
      description="Add a new term to the F3 Lexicon"
      showTags={false}
      showVideos={false}
      apiPath="/api/lexicon"
    />
  );
} 