
'use client'; 

import { useEffect } from 'react';
import styles from '@/components/ErrorBoundary.module.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    
    <div className={styles.container}>
      <h1 className={styles.title}>Something went wrong.</h1>
      <p className={styles.message}>
        An unexpected error occurred. Please try again.
      </p>
      <pre className={styles.errorDetails}>
        {error && error.message}
      </pre>
      <button
        className={styles.reloadButton}
        // The reset function attempts to re-render the segment
        onClick={() => reset()}
      >
        Try Again
      </button>
    </div>
  );
}