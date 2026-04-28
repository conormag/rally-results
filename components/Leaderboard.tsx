'use client';

import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

export default function Leaderboard({ rallyId }: { rallyId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['results', rallyId],
    queryFn: async () => {
      console.log(`Fetching results for rally ID: ${rallyId}`);
      const res = await fetch(`/api/results/${rallyId}`);
      return res.json();
    },
  });

  if (isLoading) return <div className="text-white">Loading Leaderboard...</div>;

  return (
    <div className="flex flex-col gap-y-3 w-full max-w-5xl mx-auto p-4">
      {/* Header Row - Simplified */}
      <div className="grid grid-cols-12 px-6 py-2 text-xs font-bold uppercase tracking-widest text-slate-500">
        <div className="col-span-1">Pos</div>
        <div className="col-span-3">Driver / Co-Driver</div>
        <div className="col-span-2">Car</div>
        <div className="col-span-3 text-right">Total Time</div>
        <div className="col-span-3 text-right">Gap (Leader)</div>
      </div>

      <AnimatePresence>
        {data?.mainResults?.map((entry: any, index: number) => {
          const isLeader = index === 0;

          return (
            <motion.div
              key={entry.carNo}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`
                grid grid-cols-12 items-center px-6 py-4
                ${isLeader ? 'border-l-4 border-green-500 bg-green-500/10' : 'border-l-4 border-slate-700 bg-slate-900/40'}
                backdrop-blur-md rounded-r-md transition-all
                hover:bg-slate-800/60
              `}
            >
              {/* Position */}
              <div className="col-span-1 text-2xl font-black italic text-white">
                {entry.pos}
              </div>

              {/* Driver Info */}
              <div className="col-span-3">
                <div className="text-white font-bold text-lg leading-none uppercase tracking-tight">
                  {entry.driver}
                </div>
                <div className="text-slate-400 text-md mt-1 font-medium">
                  {entry.codriver}
                </div>
              </div>

              {/* Car Make */}
              <div className="col-span-2 text-sm font-medium text-slate-300">
                <img
                  src="/cars/ford-escort-mk2.webp" // Your transparent PNG path
                  alt="Ford Escort Mk2 Profile"
                  className="h-14 w-auto object-contain" // Fixed height for scaling consistency
                />
                {entry.make}
              </div>

              {/* Stage Time */}
              <div className="col-span-3 text-right font-mono text-xl text-white">
                {entry.totalTime}
              </div>

              {/* Gap Logic */}
              <div className="col-span-3 text-right font-mono">
                {isLeader ? (
                  <span className="text-green-500 text-sm font-bold tracking-tighter bg-green-500/20 px-2 py-1 rounded">
                    LEADER
                  </span>
                ) : (
                  <span className="text-red-500 text-xl font-bold">
                    +{entry.gapToLeader}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}