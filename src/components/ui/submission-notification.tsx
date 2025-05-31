'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';

interface SubmissionCounts {
  exiconCount: number;
  lexiconCount: number;
  totalCount: number;
}

export default function SubmissionNotification() {
  const [counts, setCounts] = useState<SubmissionCounts | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCounts = async () => {
    try {
      const response = await fetch('/api/submissions/count');
      if (response.ok) {
        const data = await response.json();
        setCounts(data);
      }
    } catch (error) {
      console.error('Error fetching submission counts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
    // Refresh counts every 5 minutes
    const interval = setInterval(fetchCounts, 5 * 60 * 1000);

    // Listen for submission updates
    const handleSubmissionUpdate = () => {
      fetchCounts();
    };
    window.addEventListener('submission-updated', handleSubmissionUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('submission-updated', handleSubmissionUpdate);
    };
  }, []);

  if (isLoading || !counts || counts.totalCount === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none cursor-pointer"
      >
        <Bell className="h-6 w-6" />
        {counts.totalCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
            {counts.totalCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 text-sm text-gray-700">
            <Link 
              href="/admin/submissions" 
              className="font-medium mb-2 block text-blue-600 hover:text-blue-800 underline"
              onClick={() => setIsOpen(false)}
            >
              Pending Submissions
            </Link>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Exicon:</span>
                <span className="font-medium">{counts.exiconCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Lexicon:</span>
                <span className="font-medium">{counts.lexiconCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 