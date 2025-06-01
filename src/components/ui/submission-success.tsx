import { CheckCircle2 } from 'lucide-react';

interface SubmissionSuccessProps {
  onClose: () => void;
}

export default function SubmissionSuccess({ onClose }: SubmissionSuccessProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
          Submission Successful!
        </h3>
        <p className="text-gray-600 text-center mb-6">
          Thank you for your submission. Your entry has been submitted for review.
        </p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 