import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ExerciseEntry } from '@/types/excercise-entry';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface ExerciseSubmitProps {
  title: string;
  description: string;
  showTags?: boolean;
  showVideos?: boolean;
  allTags?: readonly string[];
  apiPath: string;
}

export default function ExerciseSubmit({
  title,
  description,
  showTags = true,
  showVideos = true,
  allTags = [],
  apiPath,
}: ExerciseSubmitProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExerciseSubmitContent
        title={title}
        description={description}
        showTags={showTags}
        showVideos={showVideos}
        allTags={allTags}
        apiPath={apiPath}
      />
    </Suspense>
  );
}

function ExerciseSubmitContent({
  title,
  description,
  showTags = true,
  showVideos = true,
  allTags = [],
  apiPath,
}: ExerciseSubmitProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get('edit');
  const submissionId = searchParams.get('submission');

  const [formData, setFormData] = useState({
    name: '',
    definition: '',
    tags: '',
    aliases: '',
    video_url: '',
    f3name: '',
    region: '',
  });
  const [newAlias, setNewAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmission, setIsSubmission] = useState(false);

  const handleNavigation = () => {
    if (isSubmission) {
      router.push('/admin/submissions');
    } else {
      const type = apiPath.includes('lexicon') ? 'lexicon' : 'exicon';
      router.push(`/${type}`);
    }
  };

  useEffect(() => {
    if (editSlug || submissionId) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            editSlug 
              ? `${apiPath}/${editSlug}`
              : `${apiPath}/submissions/${submissionId}`
          );
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const data: ExerciseEntry = await response.json();
          setFormData({
            name: data.name,
            definition: data.definition,
            tags: data.tags || '',
            aliases: data.aliases || '',
            video_url: data.video_url || '',
            f3name: data.f3name || '',
            region: data.region || '',
          });
          setIsEditing(!!editSlug);
          setIsSubmission(!!submissionId);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      };
      fetchData();
    }
  }, [editSlug, submissionId, apiPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing 
        ? `${apiPath}/${editSlug}` 
        : session 
          ? `${apiPath}/create`
          : `${apiPath}/submit`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit entry');
      }

      // If this was a submission being approved, delete the submission
      if (isSubmission && submissionId) {
        const submissionType = apiPath.includes('lexicon') ? 'lexicon' : 'exicon';
        await fetch(`/api/${submissionType}/submissions/${submissionId}`, {
          method: 'DELETE',
        });
        // Dispatch event to update submission counts
        window.dispatchEvent(new Event('submission-updated'));
      }

      // Route based on context
      handleNavigation();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!isSubmission || !submissionId) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiPath}/submissions/${submissionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to reject submission');
      }

      // Dispatch event to update submission counts
      window.dispatchEvent(new Event('submission-updated'));
      handleNavigation();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleTag = (tag: string) => {
    const currentTags = formData.tags ? formData.tags.split('|').map(t => t.trim()) : [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    setFormData(prev => ({ ...prev, tags: newTags.join('|') }));
  };

  const addAlias = () => {
    if (newAlias.trim()) {
      const currentAliases = formData.aliases ? formData.aliases.split('|').map(a => a.trim()) : [];
      const newAliases = [...currentAliases, newAlias.trim()];
      setFormData(prev => ({ ...prev, aliases: newAliases.join('|') }));
      setNewAlias('');
    }
  };

  const removeAlias = (index: number) => {
    const currentAliases = formData.aliases.split('|').map(a => a.trim());
    const newAliases = currentAliases.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, aliases: newAliases.join('|') }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">{title}</h1>
          <p className="text-slate-600">{description}</p>
        </div>

        {session && !isEditing && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
            <p className="font-medium">Admin Mode</p>
            <p className="text-sm mt-1">
              {isSubmission 
                ? 'You are approving a submitted exercise. This will create a new entry in the exicon and remove it from submissions.'
                : 'You are creating a new exercise entry directly in the exicon. This will be published immediately without going through the submission process.'}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Name *
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter the name"
              />
            </div>

            <div>
              <label htmlFor="definition" className="block text-sm font-medium text-slate-700 mb-1">
                Definition *
              </label>
              <textarea
                id="definition"
                name="definition"
                required
                value={formData.definition}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none"
                placeholder="Enter the definition"
              />
            </div>

            {showTags && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 text-sm rounded-full font-medium transition-colors cursor-pointer ${
                        formData.tags?.includes(tag)
                          ? 'bg-blue-100 text-blue-700'
                          : 'border border-blue-200 text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
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
                  {formData.aliases.split('|').map((alias, index) => (
                    alias.trim() && (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {alias.trim()}
                        <button
                          type="button"
                          onClick={() => removeAlias(index)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>

            {showVideos && (
              <div>
                <label htmlFor="video_url" className="block text-sm font-medium text-slate-700 mb-1">
                  Video URL
                </label>
                <Input
                  type="url"
                  id="video_url"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleChange}
                  placeholder="Enter YouTube video URL"
                />
              </div>
            )}

            {!isEditing && !session && (
              <>
                <div>
                  <label htmlFor="f3name" className="block text-sm font-medium text-slate-700 mb-1">
                    Your F3 Name (optional)
                  </label>
                  <Input
                    type="text"
                    id="f3name"
                    name="f3name"
                    value={formData.f3name}
                    onChange={handleChange}
                    placeholder="Enter your F3 name"
                  />
                </div>

                <div>
                  <label htmlFor="region" className="block text-sm font-medium text-slate-700 mb-1">
                    Your F3 Region (optional)
                  </label>
                  <Input
                    type="text"
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    placeholder="Enter your F3 region"
                  />
                </div>
              </>
            )}

            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleNavigation}
              >
                Cancel
              </Button>
              {isSubmission && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleReject}
                  disabled={loading}
                >
                  Reject Submission
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Submitting...' : isEditing ? 'Update Entry' : isSubmission ? 'Approve Submission' : session ? 'Create Exercise' : 'Submit Exercise'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 