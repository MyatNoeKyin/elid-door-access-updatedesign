"use client";

import { useState, useEffect } from 'react';

/**
 * Hook to handle client-side date formatting to avoid hydration errors
 * Returns null on server side and actual date on client side
 */
export function useClientDate(date?: Date | null) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return {
      mounted: false,
      dateString: 'Loading...',
      timeString: 'Loading...',
      dateTimeString: 'Loading...'
    };
  }

  const actualDate = date || new Date();

  return {
    mounted: true,
    dateString: actualDate.toLocaleDateString(),
    timeString: actualDate.toLocaleTimeString(),
    dateTimeString: actualDate.toLocaleString()
  };
}

/**
 * Component to safely render dates without hydration errors
 */
export function ClientDate({ date, format = 'full' }: { date?: Date | null, format?: 'date' | 'time' | 'full' }) {
  const { mounted, dateString, timeString, dateTimeString } = useClientDate(date);

  if (!mounted) {
    return <span className="text-muted-foreground">Loading...</span>;
  }

  switch (format) {
    case 'date':
      return <>{dateString}</>;
    case 'time':
      return <>{timeString}</>;
    case 'full':
    default:
      return <>{dateTimeString}</>;
  }
}