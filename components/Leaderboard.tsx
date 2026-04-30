'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { getCarImageUrl } from '@/lib/carImageMap';

export default function Leaderboard({ results, isLoading }: { results: any, isLoading: boolean }) {
  // 1. PERSISTENCE LAYER:
  // We extract the list. If results is undefined while loading,
  // the '?' ensures we just render nothing instead of crashing,
  // but the container stays mounted.
  const entries = results?.mainResults || [];

  return (
    <div className="relative min-h-[400px] w-full max-w-5xl mx-auto">
      {/* Spinner Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-0 right-4 z-50 flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-full border border-red-500/30 backdrop-blur-md"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500 animate-pulse">
              Syncing Live Data
            </span>
            <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`flex flex-col gap-y-3 p-4 transition-all duration-700 ${isLoading ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}`}>
        {/* Header Row */}
        <div className="grid grid-cols-12 px-6 py-2 text-xs font-bold uppercase tracking-widest text-slate-500">
          <div className="col-span-1">Pos</div>
          <div className="col-span-3">Driver / Co-Driver</div>
          <div className="col-span-2">Car</div>
          <div className="col-span-3 text-right">Total Time</div>
          <div className="col-span-3 text-right">Gap (Leader)</div>
        </div>

        {/* 2. REMOVED OUTER AnimatePresence from the loop.
          'layout' works best when the items are permanent residents of the DOM.
          Only use AnimatePresence if you expect items to be DELETED from the list.
        */}
        {entries.map((entry: any, index: number) => {
          const isLeader = index === 0;
          const carImageUrl = getCarImageUrl(entry.make);

          return (
            <motion.div
              key={entry.carNo} // Must be unique & stable
              layout
              // 3. IMPROVED PHYSICS:
              // Added 'layout' transition specifically for the "shuffle"
              transition={{
                layout: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className={`
                grid grid-cols-12 items-center px-6 py-4
                ${isLeader ? 'border-l-4 border-green-500 bg-green-500/10' : 'border-l-4 border-slate-700 bg-slate-900/40'}
                backdrop-blur-md rounded-r-md transition-colors
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
              <div className="col-span-2 text-sm font-medium text-slate-300 flex items-center gap-3">
                <img
                  src={carImageUrl}
                  alt={entry.make}
                  className="h-10 w-auto object-contain"
                />
                <span className="hidden lg:block">{entry.make}</span>
              </div>

              <div className="col-span-3 text-right font-mono text-xl text-white">
                {entry.totalTime}
              </div>

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
      </div>
    </div>
  );
}