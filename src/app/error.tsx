'use client';

import { useEffect } from 'react';

type Props = {
  error: Error;
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error('🔴 Unhandled Error:', error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center p-6">
      <h1 className="text-2xl font-semibold text-destructive">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={() => {
          if (typeof window !== 'undefined') {
            location.reload(); // Full reload fallback
          } else {
            reset(); // Segment reset (if possible)
            //location.reload()
          }
        }}
        className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition cursor-pointer"
      >
        Retry
      </button>
    </div>
  );
}