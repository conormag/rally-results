import Image from 'next/image';
import { ReactNode } from 'react';
import rallyBackground from '@/public/rally-bg.jpg';

export default async function ResultsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    // 'relative' here acts as the anchor for the absolute image
    <div className="relative min-h-screen w-full bg-slate-950 overflow-hidden">

      {/* 1. THE BACKGROUND IMAGE LAYER */}
      <div className="fixed inset-0 z-0">
        <Image
          src={rallyBackground}
          alt="Rally Action Background"
          placeholder="blur" // Uses a blurred placeholder while loading
          quality={75} // Optimize for quality since it's the main visual
          fill // Tells the image to fill its 'relative' parent
          sizes="100vw" // Helps Next.js choose the right image size
          style={{
            objectFit: 'cover', // Ensures the whole image covers the screen
            objectPosition: 'center', // Centers the action
          }}
          className="opacity-70" // Dimming the image to boost text readability
        />
        {/* Adds an extra dark overlay to ensure high contrast */}
        <div className="absolute inset-0 bg-black/5 z-10" />
      </div>

      {/* 2. THE CONTENT LAYER */}
      {/* 'relative' and 'z-20' lifts this content above the fixed image */}
      <div className="relative z-20 min-h-screen w-full">
        {children}
      </div>
    </div>
  );
}