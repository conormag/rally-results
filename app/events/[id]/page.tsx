import Leaderboard from '@/components/Leaderboard';

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>,
}) {
  const { id } = await params;
  return (
    <main className="min-h-screen bg-transparent p-6">

      {/* Pass the filters into your standings component */}
      <Leaderboard
        rallyId={id}
      />
    </main>
  );
}