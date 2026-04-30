'use client';

import { useState, use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Leaderboard from '@/components/Leaderboard';
import StagePicker from '@/components/StagePicker';


export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>,
}) {
  const { id } = use(params);
  // 1. STATE: Which stage are we looking at? (null = Overall)
  const [activeStage, setActiveStage] = useState<string | null>(null);

  // 2. DATA FETCHING: The key includes activeStage, so it refetches on change
  const { data, isLoading } = useQuery({
    queryKey: ['results', id, activeStage],
    queryFn: () => {
      const url = activeStage
        ? `/api/results/${id}/${activeStage}`
        : `/api/results/${id}`;
      return fetch(url).then(res => res.json());
    },
    placeholderData: (prev) => prev,
  });

  return (
    <main className="min-h-screen bg-transparent max-w-6xl mx-auto py-10 px-4">

      {/* Pass the filters into your standings component */}
      <StagePicker
        stages={data?.stages}
        currentStage={activeStage}
        onSelect={setActiveStage}
      />

      {/* DATA DOWN: We pass the results down to the leaderboard */}
      <Leaderboard
        results={data}
        isLoading={isLoading}
      />
    </main>
  );
}