'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import SubmissionNotification from './ui/submission-notification';

export function Header() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null;
  }

  if (!session) {
    return null;
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <span className="text-xl font-bold text-gray-900">
              F3 Xicon Admin
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <SubmissionNotification />
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Signed in as {session.user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-700 hover:text-gray-900 cursor-pointer"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 