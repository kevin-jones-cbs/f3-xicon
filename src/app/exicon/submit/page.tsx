'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

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

export default function SubmitExiconPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [definition, setDefinition] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [aliases, setAliases] = useState<string[]>([]);
  const [newAlias, setNewAlias] = useState('');
  const [f3name, setF3name] = useState('');
  const [region, setRegion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const addAlias = () => {
    if (newAlias.trim()) {
      setAliases(prev => [...prev, newAlias.trim()]);
      setNewAlias('');
    }
  };

  const removeAlias = (index: number) => {
    setAliases(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/exicon/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          definition,
          video_url: videoUrl,
          tags: selectedTags.join('|'),
          aliases: aliases.join('|'),
          f3name,
          region,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit entry');
      }

      router.push('/exicon');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Submit a New Exercise</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Exercise Name
          </label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter the exercise name"
          />
        </div>

        <div>
          <label htmlFor="definition" className="block text-sm font-medium text-gray-700 mb-1">
            Definition
          </label>
          <textarea
            id="definition"
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            required
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter the exercise definition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-sm rounded-full font-medium transition-colors cursor-pointer ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-100 text-blue-700'
                    : 'border border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aliases (optional)
          </label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  value={newAlias}
                  onChange={(e) => setNewAlias(e.target.value)}
                  placeholder="Type an alias and press Enter or click + to add"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addAlias();
                    }
                  }}
                  className={newAlias.trim() ? 'pr-20' : ''}
                />
                {newAlias.trim() && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                    Press Enter or click +
                  </div>
                )}
              </div>
              <Button
                type="button"
                onClick={addAlias}
                variant="outline"
                size="icon"
                disabled={!newAlias.trim()}
                className={newAlias.trim() ? 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100' : ''}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Add one alias at a time. Press Enter or click the + button to add each alias.
            </p>
            <div className="flex flex-wrap gap-2">
              {aliases.map((alias, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {alias}
                  <button
                    type="button"
                    onClick={() => removeAlias(index)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Video URL (optional)
          </label>
          <Input
            type="url"
            id="videoUrl"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter a YouTube or other video URL"
          />
        </div>

        <div>
          <label htmlFor="f3name" className="block text-sm font-medium text-gray-700 mb-1">
            Your F3 Name (optional)
          </label>
          <Input
            type="text"
            id="f3name"
            value={f3name}
            onChange={(e) => setF3name(e.target.value)}
            placeholder="Enter your F3 name"
          />
        </div>

        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
            Your F3 Region (optional)
          </label>
          <Input
            type="text"
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="Enter your F3 region"
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Exercise'}
          </Button>
        </div>
      </form>
    </div>
  );
} 