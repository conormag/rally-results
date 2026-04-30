'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function EventSelector() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const { data, isLoading } = useQuery({
    queryKey: ['events', selectedYear],
    queryFn: () => fetch(`/api/events?year=${selectedYear}`).then(res => res.json()),
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8 bg-[url('/rally-bg.jpg')] bg-cover bg-fixed bg-center">
      <div className="max-w-6xl mx-auto backdrop-blur-xl bg-black/60 p-10 rounded-3xl border border-white/10">

        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase">Select Event</h1>
            <p className="text-slate-400 mt-2">Browse the archives or join a live stage.</p>
          </div>

          {/* Year Selector Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-red-500">Season</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg font-bold outline-none focus:ring-2 focus:ring-red-600"
            >
              {data?.years?.map((y: string) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </header>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <p>Loading season...</p>
          ) : (
            data?.events?.map((event: any) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group relative overflow-hidden bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-red-500 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold px-2 py-1 bg-red-600 rounded uppercase">
                    {event.status === 'LIVE' ? '● LIVE' : event.status}
                  </span>
                  <span className="text-slate-500 text-xs font-mono">{event.date}</span>
                </div>
                <h3 className="text-xl font-bold group-hover:text-red-500 transition-colors">
                  {event.name}
                </h3>
                <h4 className="text-sm text-slate-400 mt-1">{event.eventDate}</h4>
                <div className="mt-4 flex items-center text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Results →
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}