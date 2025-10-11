import React from 'react';

interface ReviewSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReviewSuccessModal: React.FC<ReviewSuccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="text-center">
            {/* Success icon */}
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
              <svg
                className="h-10 w-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Successful! 🎉
            </h3>
            
            <p className="text-lg text-gray-600 mb-2">
              Your personal statement has been submitted for review
            </p>
            
            <p className="text-base text-gray-500 mb-8">
              You'll receive detailed feedback within 48 hours via email
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border border-blue-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h4>
              <div className="space-y-3 text-left">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                  <span className="text-gray-700">Our expert reviewer analyzes your statement</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                  <span className="text-gray-700">Detailed feedback document is prepared</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
                  <span className="text-gray-700">You receive the review via email (within 48 hours)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Got it, thanks!
              </button>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <strong className="text-amber-800">Need help?</strong>
              </div>
              <p className="text-sm text-amber-700">
                If you have any questions about your review or need support, 
                email us at <a href="mailto:contact@nextgenmedprep.com" className="underline">contact@nextgenmedprep.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSuccessModal;