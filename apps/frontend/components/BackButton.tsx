'use client'

interface BackButtonProps {
  className?: string;
  children: React.ReactNode;
}

export default function BackButton({ className, children }: BackButtonProps) {
  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to home page if no history
      window.location.href = '/';
    }
  };

  return (
    <button
      onClick={handleGoBack}
      className={className}
    >
      {children}
    </button>
  );
}