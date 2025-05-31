'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { Search, ChevronDown, ChevronUp, X, Play, Pencil, Trash2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { exportToCSV } from '@/utils/csvExport';
import { ExiconEntry } from '@/types/exicon';

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
  'Video'
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
  const { data: session } = useSession();
  const [data, setData] = useState<ExiconEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagOperator, setTagOperator] = useState<'AND' | 'OR'>('AND');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('');
  const itemsPerPage = 5;
  const searchParams = useSearchParams();
  const slug = searchParams.get('term');
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const resetPagination = () => {
    setCurrentPage(1);
    setPageInput('1');
  };

  const getEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        const videoId = urlObj.searchParams.get('v');
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      } else if (urlObj.hostname.includes('youtu.be')) {
        const videoId = urlObj.pathname.slice(1);
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
      return url;
    } catch {
      return url;
    }
  };

  // Reset page number when search term changes
  useEffect(() => {
    resetPagination();
  }, [searchTerm]);

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

  useEffect(() => {
    if (slug) {
      const entry = data.find(item => item.slug === slug);
      if (entry) {
        setExpandedCard(entry.slug);
      }
    }
  }, [slug, data]);

  const filteredExercises = useMemo(() => {
    let filtered = data;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchLower) ||
        exercise.definition.toLowerCase().includes(searchLower) ||
        exercise.tags.toLowerCase().includes(searchLower) ||
        (exercise.aliases && exercise.aliases.toLowerCase().includes(searchLower))
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(exercise => {
        const exerciseTags = exercise.tags && exercise.tags.split('|').map(tag => tag.trim()) || '';
        const hasVideo = Boolean(exercise.video_url);
        
        if (tagOperator === 'AND') {
          return selectedTags.every(tag => {
            if (tag === 'Video') {
              return hasVideo;
            }
            return exerciseTags.includes(tag);
          });
        } else {
          return selectedTags.some(tag => {
            if (tag === 'Video') {
              return hasVideo;
            }
            return exerciseTags.includes(tag);
          });
        }
      });
    }

    return filtered;
  }, [data, searchTerm, selectedTags, tagOperator]);

  const paginatedExercises = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredExercises.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredExercises, currentPage]);

  const totalPages = Math.ceil(filteredExercises.length / itemsPerPage);

  const toggleExpanded = (slug: string) => {
    setExpandedCard(expandedCard === slug ? null : slug);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    resetPagination();
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this exercise? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(slug);
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
      setError(err instanceof Error ? err.message : 'Failed to delete exercise');
    } finally {
      setIsDeleting(null);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">F3 Exicon</h1>
          <p className="text-slate-600">Searchable exercise definitions for F3 workouts</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search exercises (e.g., 'merkins', 'partner', 'running')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-4 text-lg rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none shadow-sm transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-sm rounded-full font-medium transition-colors cursor-pointer ${
                  selectedTags.includes(tag)
                    ? tag === 'Video'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                    : tag === 'Video'
                      ? 'border border-red-200 text-red-600 hover:bg-red-50'
                      : 'border border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="text-sm text-slate-500 mt-6 flex items-center gap-2">
            <span>
              {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
              {selectedTags.length > 0 && (
                <>
                  {' tagged '}
                  {selectedTags.map((tag, index) => (
                    <span key={tag}>
                      {tag}
                      {index < selectedTags.length - 1 && (
                        <>
                          <button
                            onClick={() => setTagOperator(tagOperator === 'AND' ? 'OR' : 'AND')}
                            className="mx-1 px-2 py-0.5 text-xs rounded-full font-medium transition-colors bg-yellow-100 hover:bg-yellow-200 text-yellow-700 cursor-pointer"
                          >
                            {tagOperator}
                          </button>
                        </>
                      )}
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedTags([]);
                      resetPagination();
                    }}
                    className="ml-2 px-2 py-0.5 text-xs rounded-full font-medium transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    Clear tags
                  </button>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Exercise Cards */}
        <div className="space-y-4">
          {paginatedExercises.map((exercise) => (
            <div
              key={exercise.slug}
              className={`bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-lg ${
                expandedCard === exercise.slug ? '' : 'h-[140px]'
              }`}
            >
              {/* Card Header */}
              <div
                className={`p-5 cursor-pointer hover:bg-slate-50 transition-colors ${
                  expandedCard === exercise.slug ? '' : 'h-full'
                }`}
                onClick={() => toggleExpanded(exercise.slug)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2 min-h-[2.5rem]">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-slate-800">
                          {exercise.name}
                        </h3>
                        {session && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/exicon/submit?edit=${exercise.slug}`);
                              }}
                              className="cursor-pointer inline-flex items-center gap-1.5 px-3 sm:px-2.5 py-2 sm:py-1 text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
                            >
                              <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(exercise.slug);
                              }}
                              disabled={isDeleting === exercise.slug}
                              className="cursor-pointer inline-flex items-center gap-1.5 px-3 sm:px-2.5 py-2 sm:py-1 text-sm bg-red-100 text-red-600 hover:bg-red-200 rounded-md transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              <span className="hidden sm:inline">{isDeleting === exercise.slug ? 'Deleting...' : 'Delete'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {exercise.tags && exercise.tags.split('|').map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                        {exercise.video_url && (
                          <div className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full font-medium">
                            <Play className="w-4 h-4" />
                            <span>Video</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className={`text-slate-600 leading-relaxed whitespace-pre-wrap ${expandedCard === exercise.slug ? '' : 'line-clamp-2'}`}>
                      {exercise.definition}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {(exercise.video_url || exercise.aliases || exercise.definition.length > 200) && (
                      <div>
                        {expandedCard === exercise.slug ? (
                          <ChevronUp className="w-6 h-6 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedCard === exercise.slug && (exercise.video_url || exercise.aliases) && (
                <div className="border-t border-slate-100 bg-slate-50">
                  <div className="p-6">
                    {exercise.video_url && (
                      <div className="aspect-video w-full max-w-2xl mx-auto mb-6">
                        <iframe
                          src={getEmbedUrl(exercise.video_url)}
                          className="w-full h-full rounded-lg shadow-md"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                    {exercise.aliases && (
                      <div className="bg-slate-100 rounded-lg p-4 max-w-2xl mx-auto mb-6">
                        <span className="text-sm font-medium text-slate-600">AKA: </span>
                        <span className="text-sm text-slate-700">
                          {exercise.aliases.split('|').map((alias, index, array) => (
                            <span key={index}>
                              {alias.trim()}
                              {index < array.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center mt-8 gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const newPage = Math.max(1, currentPage - 1);
                  setCurrentPage(newPage);
                  setPageInput(newPage.toString());
                }}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-50 text-sm cursor-pointer"
              >
                Previous
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Page</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={pageInput}
                onChange={(e) => {
                  setPageInput(e.target.value);
                }}
                onBlur={() => {
                  const page = parseInt(pageInput);
                  if (page >= 1 && page <= totalPages) {
                    setCurrentPage(page);
                  } else {
                    setPageInput(currentPage.toString());
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const page = parseInt(pageInput);
                    if (page >= 1 && page <= totalPages) {
                      setCurrentPage(page);
                    } else {
                      setPageInput(currentPage.toString());
                    }
                  }
                }}
                className="w-16 px-2 py-1 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                placeholder={currentPage.toString()}
              />
              <span className="text-sm">of {totalPages}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const newPage = Math.min(totalPages, currentPage + 1);
                  setCurrentPage(newPage);
                  setPageInput(newPage.toString());
                }}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-50 text-sm cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No exercises found</h3>
            <p className="text-slate-500">
              Try adjusting your search terms or{' '}
              <button
                onClick={clearSearch}
                className="text-blue-600 hover:text-blue-700 underline cursor-pointer"
              >
                clear the search
              </button>
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-slate-200">
        {/* Export to CSV Button */}
        {filteredExercises.length > 0 && (
          <div className="flex justify-center mt-2">
            <button
              onClick={() => exportToCSV(filteredExercises)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Export to CSV
            </button>
          </div>
        )}
          {!slug && (
            <div className="mt-4">
              <a
                href="/exicon/submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-block"
              >
                {session ? 'Create New Entry' : 'Submit a New Exicon Entry'}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 