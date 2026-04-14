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

type Act = 'Setup' | 'I' | 'II' | 'III' | 'IV' | 'V';

interface UserData {
  age: number;
  sleepHours: number;
  workHours: number;
  commuteHours: number;
  screenHours: number;
  choresHours: number;
  needsHours: number;
  lifespan: number;
  retirementAge: number;
}

const DEFAULT_USER: UserData = {
  age: 18,
  sleepHours: 8,
  workHours: 40,
  commuteHours: 1,
  screenHours: 7,
  choresHours: 1,
  needsHours: 2,
  lifespan: 90,
  retirementAge: 65,
};

interface Category {
  id: string;
  label: string;
  months: number;
  color: string;
  description: string;
}

const CATEGORY_COLORS = {
  sleep: 'bg-neutral-800',
  work: 'bg-neutral-700',
  needs: 'bg-neutral-600',
  chores: 'bg-neutral-500',
  commute: 'bg-neutral-400',
  screen: 'bg-red-600',
  freedom: 'bg-amber-500',
};

// --- Components ---

const Slider = ({ label, value, min, max, onChange, unit = '' }: { 
  label: string; 
  value: number; 
  min: number; 
  max: number; 
  onChange: (val: number) => void;
  unit?: string;
}) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-500">
      <span>{label}</span>
      <span className="text-white">{value}{unit}</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
    />
  </div>
);

const Square = React.memo(({ index, act, categoryId }: { index: number; act: Act; categoryId: string | null }) => {
  let colorClass = 'bg-white/20';
  let scale = 1;
  let opacity = 1;
  let isGlitching = false;

  if (act === 'Setup' || act === 'I') {
    colorClass = 'bg-white/80';
  } else if (act === 'II') {
    if (categoryId && categoryId !== 'screen' && categoryId !== 'freedom') {
      const catColor = CATEGORY_COLORS[categoryId as keyof typeof CATEGORY_COLORS] || 'bg-neutral-900';
      colorClass = catColor;
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

const LifespanGrid = ({ act, categories, totalMonths }: { act: Act; categories: Category[]; totalMonths: number }) => {
  // Pre-calculate which category each square belongs to
  const squareMap = useMemo(() => {
    const map: (string | null)[] = new Array(totalMonths).fill(null);
    let currentIdx = 0;
    
    // Fill categories in order
    categories.forEach(cat => {
      for (let i = 0; i < cat.months; i++) {
        if (currentIdx < totalMonths) {
          map[currentIdx] = cat.id;
          currentIdx++;
        }
      }
    });
    
    return map;
  }, [categories, totalMonths]);

  return (
    <div className="grid grid-cols-24 sm:grid-cols-32 md:grid-cols-36 lg:grid-cols-48 gap-1 p-4 max-w-6xl mx-auto">
      {squareMap.map((catId, i) => (
        <Square key={i} index={i} act={act} categoryId={catId} />
      ))}
    </div>
  );
};

const ActContent = ({ act, categories, totalMonths, userData }: { act: Act; categories: Category[]; totalMonths: number; userData: UserData }) => {
  const freeMonths = categories.find(c => c.id === 'freedom')?.months || 0;
  const screenMonths = categories.find(c => c.id === 'screen')?.months || 0;
  const totalFree = freeMonths + screenMonths;

  switch (act) {
    case 'I':
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight">The Reality of Your Time</h2>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl">
            You are {userData.age} years old. With a lifespan of {userData.lifespan}, the clock is already ticking. You have 
            <span className="text-white font-bold block mt-2">{totalMonths} months left.</span>
            The ocean feels infinite until you start measuring it.
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
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight">The Cost of Survival</h2>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl">
            Survival has a tax. Society and biology take their cut before you even start living. 
            Sleep, work, and the daily grind. 
            The grid darkens as your months are claimed by obligations.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            {categories.slice(0, 5).map(cat => (
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
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight text-amber-500">Your Unclaimed Future</h2>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl">
            This is what remains. 
            <span className="text-white font-bold block mt-2">{totalFree} months of pure, unclaimed potential.</span>
            This is where you build your legacy, craft your art, and actually live.
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
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight text-red-600">The Digital Tax</h2>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl">
            But there is a hunter in the room. 
            At {userData.screenHours} hours a day, you trade <span className="text-red-500 font-bold">{totalFree > 0 ? Math.round((screenMonths / totalFree) * 100) : 0}%</span> of your potential for a glowing rectangle.
            The algorithm claims its bounty.
          </p>
          <div className="flex items-center gap-2 text-red-500 font-mono text-sm animate-pulse">
            <Smartphone size={16} />
            <span>{screenMonths} MONTHS LOST TO SCREENS</span>
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
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight">The Final {freeMonths} Months</h2>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl">
            This is all that's left. {Math.round(freeMonths / 12)} real years. 
            What will you do with them? 
            How will you <span className="text-amber-500 font-bold underline decoration-2 underline-offset-4">steal your life back</span> from the red squares?
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-amber-500 transition-colors mt-8"
          >
            <RotateCcw size={18} />
            Reclaim Your Time
          </button>
        </motion.div>
      );
    default:
      return null;
  }
};

export default function App() {
  const [act, setAct] = useState<Act>('Setup');
  const [userData, setUserData] = useState<UserData>(DEFAULT_USER);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const acts: Act[] = ['Setup', 'I', 'II', 'III', 'IV', 'V'];
  const currentIndex = acts.indexOf(act);

  // --- Dynamic Math ---
  const remainingYears = Math.max(0, userData.lifespan - userData.age);
  const totalMonths = remainingYears * 12;

  const dynamicCategories = useMemo(() => {
    // 1. Total remaining volume (Derived from props to ensure reactivity)
    const currentTotal = totalMonths;
    
    // 2. Sleep (Universal)
    const sleepMonths = Math.round((userData.sleepHours / 24) * currentTotal);
    
    // 3. Work & Commute (Period-specific)
    const remYears = Math.max(0, userData.lifespan - userData.age);
    const workYears = Math.max(0, Math.min(remYears, userData.retirementAge - userData.age));
    const workMonthsVolume = Math.round((userData.workHours / (24 * 7)) * (workYears * 12));
    const commuteMonthsVolume = Math.round((userData.commuteHours * 5 / (24 * 7)) * (workYears * 12));
    
    // 4. Maintenance (Universal)
    const basicNeedsMonths = Math.round((userData.needsHours / 24) * currentTotal);
    const choresMonths = Math.round((userData.choresHours / 24) * currentTotal);
    
    // 5. Calculate Freedom
    const necessaryMonths = sleepMonths + workMonthsVolume + basicNeedsMonths + choresMonths + commuteMonthsVolume;
    const freeMonthsPotential = Math.max(0, currentTotal - necessaryMonths);
    
    // 6. Screen Time (Eats freedom first)
    const screenMonthsPotential = Math.round((userData.screenHours / 24) * currentTotal);
    const actualScreenMonths = Math.min(freeMonthsPotential, screenMonthsPotential);
    const pureFreedomMonths = Math.max(0, freeMonthsPotential - actualScreenMonths);

    return [
      { id: 'sleep', label: 'Sleep', months: sleepMonths, color: 'bg-neutral-800', description: 'Resting.' },
      { id: 'work', label: 'Work/School', months: workMonthsVolume, color: 'bg-neutral-700', description: 'Earning.' },
      { id: 'needs', label: 'Basic Needs', months: basicNeedsMonths, color: 'bg-neutral-600', description: 'Survival.' },
      { id: 'chores', label: 'Chores', months: choresMonths, color: 'bg-neutral-500', description: 'Maintenance.' },
      { id: 'commute', label: 'Commuting', months: commuteMonthsVolume, color: 'bg-neutral-400', description: 'Transit.' },
      { id: 'screen', label: 'Screen Time', months: actualScreenMonths, color: 'bg-red-600', description: 'Digital consumption.' },
      { id: 'freedom', label: 'Pure Freedom', months: pureFreedomMonths, color: 'bg-amber-500', description: 'Your legacy.' },
    ];
  }, [userData.sleepHours, userData.workHours, userData.commuteHours, userData.screenHours, userData.needsHours, userData.choresHours, userData.lifespan, userData.age, userData.retirementAge, totalMonths]);

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
            <LifespanGrid act={act} categories={dynamicCategories} totalMonths={totalMonths} />
          </div>
        </section>

        {/* Narrative Section */}
        <section className="w-full lg:w-1/2 order-1 lg:order-2 flex flex-col justify-center min-h-[500px]">
          <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            {act === 'Setup' ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight">Personalize Your Journey</h2>
                  <p className="text-neutral-400">Before we begin, let's look at your specific reality.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Slider 
                    label="Current Age" 
                    value={userData.age} 
                    min={1} max={userData.lifespan - 1} 
                    onChange={(age) => setUserData(prev => ({ ...prev, age: Math.min(age, prev.lifespan - 1) }))} 
                  />
                  <Slider 
                    label="Expected Lifespan" 
                    value={userData.lifespan} 
                    min={userData.age + 1} max={120} 
                    onChange={(lifespan) => setUserData(prev => ({ ...prev, lifespan: Math.max(lifespan, prev.age + 1) }))} 
                  />
                  <Slider 
                    label="Retirement Age" 
                    value={userData.retirementAge} 
                    min={userData.age} max={userData.lifespan} 
                    onChange={(retirementAge) => setUserData(prev => ({ ...prev, retirementAge }))} 
                  />
                  <Slider 
                    label="Sleep (Hours/Day)" 
                    value={userData.sleepHours} 
                    min={1} max={12} 
                    onChange={(sleepHours) => setUserData(prev => ({ ...prev, sleepHours }))} 
                  />
                  <Slider 
                    label="Work (Hours/Week)" 
                    value={userData.workHours} 
                    min={0} max={100} 
                    onChange={(workHours) => setUserData(prev => ({ ...prev, workHours }))} 
                  />
                  <Slider 
                    label="Commute (Hours/Day)" 
                    value={userData.commuteHours} 
                    min={0} max={6} 
                    onChange={(commuteHours) => setUserData(prev => ({ ...prev, commuteHours }))} 
                  />
                  <Slider 
                    label="Screen Time (Hours/Day)" 
                    value={userData.screenHours} 
                    min={0} max={18} 
                    onChange={(screenHours) => setUserData(prev => ({ ...prev, screenHours }))} 
                  />
                  <Slider 
                    label="Chores & Needs (Hours/Day)" 
                    value={userData.choresHours + userData.needsHours} 
                    min={1} max={10} 
                    onChange={(total) => setUserData(prev => ({ ...prev, choresHours: Math.floor(total * 0.3), needsHours: Math.ceil(total * 0.7) }))} 
                  />
                </div>

                {/* Day Overload Warning */}
                {userData.sleepHours + (userData.workHours / 7) + (userData.commuteHours * 5/7) + userData.screenHours + (userData.choresHours + userData.needsHours) > 23.5 && (
                   <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-red-500 text-xs font-mono">
                    <Zap size={14} className="inline mr-2 mb-1" />
                    WARNING: Your daily breakdown exceeds 24 hours. Your calculated freedom will be limited.
                   </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">Total Life Remaining</span>
                    <div className="text-2xl font-display font-bold text-white leading-none">
                      {totalMonths} <span className="text-xs font-normal text-neutral-500 uppercase">Months</span>
                    </div>
                  </div>
                  <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 space-y-1">
                    <span className="text-[10px] font-mono text-amber-500 uppercase">Untouchable Freedom</span>
                    <div className="text-2xl font-display font-bold text-amber-500 leading-none">
                      {dynamicCategories.find(c => c.id === 'freedom')?.months || 0} <span className="text-xs font-normal text-amber-500/50 uppercase">Months</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <ActContent act={act} categories={dynamicCategories} totalMonths={totalMonths} userData={userData} />
            )}
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
                {act === 'Setup' ? 'See Your Reality' : currentIndex === acts.length - 1 ? 'End of Journey' : 'Next Realization'}
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
              <span>Remaining: {totalMonths} Months</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart size={12} className="text-red-500" />
              <span>Life is finite</span>
            </div>
          </div>
          <div className="text-center sm:text-right">
            Dynamic calculation based on your inputs.
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
