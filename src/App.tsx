/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  Smartphone, 
  Heart, 
  Zap,
  RotateCcw
} from 'lucide-react';

// --- Types & Constants ---

type Act = 'I' | 'II' | 'III' | 'IV' | 'V';

interface Category {
  id: string;
  label: string;
  months: number;
  color: string;
  description: string;
}

const TOTAL_MONTHS = 864;

const CATEGORIES: Category[] = [
  { id: 'sleep', label: 'Sleep', months: 288, color: 'bg-neutral-800', description: '8 hours a day, every day.' },
  { id: 'work', label: 'Work/School', months: 110, color: 'bg-neutral-700', description: '40 hours a week until age 65.' },
  { id: 'needs', label: 'Basic Needs', months: 65, color: 'bg-neutral-600', description: 'Eating, hygiene, bathroom.' },
  { id: 'chores', label: 'Chores', months: 35, color: 'bg-neutral-500', description: 'Cleaning, shopping, life admin.' },
  { id: 'commute', label: 'Commuting', months: 32, color: 'bg-neutral-400', description: 'Driving, transit, traffic.' },
  { id: 'screen', label: 'Screen Time', months: 310, color: 'bg-red-600', description: '93% of your free time.' },
  { id: 'freedom', label: 'Pure Freedom', months: 24, color: 'bg-amber-500', description: 'What remains for your passions.' },
];

// --- Components ---

const Square = React.memo(({ index, act, categoryId }: { index: number; act: Act; categoryId: string | null }) => {
  let colorClass = 'bg-white/20';
  let scale = 1;
  let opacity = 1;
  let isGlitching = false;

  if (act === 'I') {
    colorClass = 'bg-white/80';
  } else if (act === 'II') {
    if (categoryId && categoryId !== 'screen' && categoryId !== 'freedom') {
      const cat = CATEGORIES.find(c => c.id === categoryId);
      colorClass = cat ? cat.color : 'bg-neutral-900';
      opacity = 0.4;
    } else {
      colorClass = 'bg-white/80';
    }
  } else if (act === 'III') {
    if (categoryId && categoryId !== 'screen' && categoryId !== 'freedom') {
      colorClass = 'bg-neutral-900';
      opacity = 0.2;
      scale = 0.8;
    } else {
      colorClass = 'bg-amber-500';
      scale = 1.1;
    }
  } else if (act === 'IV') {
    if (categoryId === 'screen') {
      colorClass = 'bg-red-600';
      isGlitching = true;
    } else if (categoryId && categoryId !== 'freedom') {
      colorClass = 'bg-neutral-900';
      opacity = 0.1;
      scale = 0.7;
    } else {
      colorClass = 'bg-amber-500';
    }
  } else if (act === 'V') {
    if (categoryId === 'freedom') {
      colorClass = 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]';
      scale = 1.2;
    } else {
      colorClass = 'bg-neutral-900';
      opacity = 0.05;
      scale = 0.5;
    }
  }

  return (
    <motion.div
      initial={false}
      animate={{
        scale,
        opacity,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`w-full aspect-square rounded-[1px] transition-colors duration-700 ${colorClass} ${isGlitching ? 'animate-pulse' : ''}`}
    />
  );
});

const LifespanGrid = ({ act }: { act: Act }) => {
  // Pre-calculate which category each square belongs to
  const squareMap = useMemo(() => {
    const map: (string | null)[] = new Array(TOTAL_MONTHS).fill(null);
    let currentIdx = 0;
    
    // Fill categories in order
    CATEGORIES.forEach(cat => {
      for (let i = 0; i < cat.months; i++) {
        if (currentIdx < TOTAL_MONTHS) {
          map[currentIdx] = cat.id;
          currentIdx++;
        }
      }
    });
    
    return map;
  }, []);

  return (
    <div className="grid grid-cols-24 sm:grid-cols-32 md:grid-cols-36 lg:grid-cols-48 gap-1 p-4 max-w-6xl mx-auto">
      {squareMap.map((catId, i) => (
        <Square key={i} index={i} act={act} categoryId={catId} />
      ))}
    </div>
  );
};

const ActContent = ({ act }: { act: Act }) => {
  switch (act) {
    case 'I':
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight">The Illusion of Forever</h2>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl">
            Meet our protagonist. 18 years old. A whole life ahead. 
            <span className="text-white font-bold block mt-2">864 months.</span>
            It feels like an infinite ocean.
          </p>
        </motion.div>
      );
    case 'II':
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight">The Great Subtraction</h2>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl">
            Life has requirements. Biology and society take their toll. 
            Sleep, work, chores, and the daily commute. 
            The grid begins to darken as time is "locked" away.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            {CATEGORIES.slice(0, 5).map(cat => (
              <div key={cat.id} className="flex items-center gap-2 bg-neutral-900/50 px-3 py-1.5 rounded-full border border-white/10">
                <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                <span className="text-xs font-mono uppercase tracking-wider">{cat.label}: {cat.months}m</span>
              </div>
            ))}
          </div>
        </motion.div>
      );
    case 'III':
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight text-amber-500">The Silver Lining</h2>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl">
            Wait. Look at what's left. 
            <span className="text-white font-bold block mt-2">334 months of pure, uninterrupted freedom.</span>
            Almost 28 years. This is where art happens. Where love is built. Where the world is traveled.
          </p>
        </motion.div>
      );
    case 'IV':
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight text-red-600">The 93% Trap</h2>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl">
            But there is a predator in the room. 
            The average 18-year-old will spend <span className="text-red-500 font-bold">93%</span> of that free time looking at a glowing rectangle.
            TikTok, Netflix, and the algorithm claim their prize.
          </p>
          <div className="flex items-center gap-2 text-red-500 font-mono text-sm animate-pulse">
            <Smartphone size={16} />
            <span>310 MONTHS CONSUMED</span>
          </div>
        </motion.div>
      );
    case 'V':
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight">The 24 Months</h2>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl">
            This is all that remains. Two years. 
            What will you do with them? 
            Or better yet... how will you <span className="text-amber-500 font-bold underline decoration-2 underline-offset-4">steal back</span> the red squares?
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-amber-500 transition-colors mt-8"
          >
            <RotateCcw size={18} />
            Restart Journey
          </button>
        </motion.div>
      );
  }
};

export default function App() {
  const [act, setAct] = useState<Act>('I');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const acts: Act[] = ['I', 'II', 'III', 'IV', 'V'];
  const currentIndex = acts.indexOf(act);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const nextAct = () => {
    if (currentIndex < acts.length - 1) {
      setIsTransitioning(true);
      if (acts[currentIndex + 1] === 'II' || acts[currentIndex + 1] === 'IV') {
        triggerShake();
      }
      setTimeout(() => {
        setAct(acts[currentIndex + 1]);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const prevAct = () => {
    if (currentIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setAct(acts[currentIndex - 1]);
        setIsTransitioning(false);
      }, 300);
    }
  };

  return (
    <motion.div 
      animate={isShaking ? {
        x: [0, -10, 10, -10, 10, 0],
        y: [0, 5, -5, 5, -5, 0]
      } : {}}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col selection:bg-amber-500 selection:text-black"
    >
      {/* Act IV Glitch Overlay */}
      {act === 'IV' && <div className="fixed inset-0 glitch-overlay z-50" />}

      {/* Header / Progress */}
      <header className="p-6 flex justify-between items-center border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black font-black italic">334</div>
          <h1 className="font-mono text-xs uppercase tracking-[0.3em] hidden sm:block">The 334 Months</h1>
        </div>
        <div className="flex gap-1">
          {acts.map((a, i) => (
            <div 
              key={a} 
              className={`h-1 w-8 rounded-full transition-all duration-500 ${i <= currentIndex ? 'bg-white' : 'bg-neutral-800'}`} 
            />
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 gap-12 max-w-7xl mx-auto w-full">
        {/* Grid Section */}
        <section className="w-full lg:w-1/2 order-2 lg:order-1">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-2xl" />
            <LifespanGrid act={act} />
          </div>
        </section>

        {/* Narrative Section */}
        <section className="w-full lg:w-1/2 order-1 lg:order-2 flex flex-col justify-center min-h-[400px]">
          <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <ActContent act={act} />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-12">
            <button 
              onClick={prevAct}
              disabled={currentIndex === 0}
              className="p-4 rounded-full border border-white/10 hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft />
            </button>
            <button 
              onClick={nextAct}
              disabled={currentIndex === acts.length - 1}
              className="flex-1 flex items-center justify-between p-4 rounded-full bg-white text-black font-bold hover:bg-amber-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all group"
            >
              <span className="pl-4">
                {currentIndex === acts.length - 1 ? 'End of Journey' : 'Continue Narrative'}
              </span>
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <ChevronRight />
              </div>
            </button>
          </div>
        </section>
      </main>

      {/* Footer / Stats */}
      <footer className="p-6 border-t border-white/5 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-neutral-500 font-mono text-[10px] uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>Remaining: {TOTAL_MONTHS - (act === 'I' ? 0 : 530)} Months</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart size={12} className="text-red-500" />
              <span>Life is finite</span>
            </div>
          </div>
          <div className="text-center sm:text-right">
            Based on statistical averages for a 90-year lifespan starting at 18.
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
