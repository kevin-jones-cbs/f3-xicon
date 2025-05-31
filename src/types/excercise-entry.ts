export interface ExerciseEntry {
  id: number;
  name: string;
  slug: string;
  definition: string;
  tags?: string;
  aliases?: string;
  video_url?: string;
  created_at?: string;
  updated_at?: string;
  f3name?: string;
  region?: string;
}