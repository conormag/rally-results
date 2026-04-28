'use client'; // This must be a client component

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  // We use useState to ensure the QueryClient is only created once per session
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Set some global defaults for your rally app
        staleTime: 5000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}