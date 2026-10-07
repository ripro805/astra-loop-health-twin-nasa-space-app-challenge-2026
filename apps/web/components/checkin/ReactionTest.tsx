'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Timer, Zap, RotateCcw, CheckCircle } from 'lucide-react';

interface ReactionTestProps {
  onScoreCaptured: (ms: number) => void;
  initialScore?: number | null;
}

type TestState = 'IDLE' | 'WAITING' | 'READY_TO_CLICK' | 'COMPLETED' | 'EARLY_ERROR';

export const ReactionTest: React.FC<ReactionTestProps> = ({ onScoreCaptured, initialScore }) => {
  const [state, setState] = useState<TestState>(initialScore ? 'COMPLETED' : 'IDLE');
  const [reactionTime, setReactionTime] = useState<number | null>(initialScore ?? null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const startTest = () => {
    setState('WAITING');
    setReactionTime(null);

    // Random delay between 1500ms and 4500ms
    const delay = Math.floor(Math.random() * 3000) + 1500;

    timerRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setState('READY_TO_CLICK');
    }, delay);
  };

  const handleClickTarget = () => {
    if (state === 'WAITING') {
      // Clicked too early
      if (timerRef.current) clearTimeout(timerRef.current);
      setState('EARLY_ERROR');
    } else if (state === 'READY_TO_CLICK') {
      const elapsed = Math.round(performance.now() - startTimeRef.current);
      setReactionTime(elapsed);
      setState('COMPLETED');
      onScoreCaptured(elapsed);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-surface-elevated p-5 space-y-4 font-mono">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase">
            Psychomotor Vigilance Test (PVT)
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-sans">Objective Cognitive Latency</span>
      </div>

      <div
        onClick={handleClickTarget}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            handleClickTarget();
          }
        }}
        className={`h-40 w-full rounded-xl border flex flex-col items-center justify-center p-6 cursor-pointer select-none transition-all duration-150 ${
          state === 'IDLE'
            ? 'border-slate-700 bg-slate-900/80 hover:border-sky-500 text-slate-300'
            : state === 'WAITING'
            ? 'border-amber-600/70 bg-amber-950/40 text-amber-300 animate-pulse'
            : state === 'READY_TO_CLICK'
            ? 'border-emerald-400 bg-emerald-600 text-white font-extrabold shadow-lg shadow-emerald-500/20'
            : state === 'EARLY_ERROR'
            ? 'border-rose-600 bg-rose-950/60 text-rose-300'
            : 'border-sky-600/60 bg-sky-950/40 text-sky-200'
        }`}
      >
        {state === 'IDLE' && (
          <div className="text-center space-y-1">
            <Timer className="w-8 h-8 text-sky-400 mx-auto mb-2" />
            <div className="text-sm font-bold uppercase tracking-wider text-sky-300">CLICK TO START TEST</div>
            <p className="text-xs text-slate-400 font-sans">Wait for green flash, then tap as fast as possible</p>
          </div>
        )}

        {state === 'WAITING' && (
          <div className="text-center space-y-1">
            <div className="text-base font-extrabold text-amber-300 uppercase tracking-widest">
              WAIT FOR GREEN...
            </div>
            <p className="text-xs text-amber-200/80 font-sans">Do not tap yet</p>
          </div>
        )}

        {state === 'READY_TO_CLICK' && (
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-white animate-bounce">
              TAP NOW!
            </div>
          </div>
        )}

        {state === 'EARLY_ERROR' && (
          <div className="text-center space-y-2">
            <div className="text-sm font-bold text-rose-300 uppercase">TOO EARLY!</div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                startTest();
              }}
              className="rounded bg-rose-900/60 border border-rose-600/60 px-3 py-1 text-xs text-white flex items-center gap-1.5 mx-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {state === 'COMPLETED' && reactionTime !== null && (
          <div className="text-center space-y-1">
            <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto" />
            <div className="text-3xl font-extrabold text-slate-100">{reactionTime} ms</div>
            <p className="text-xs text-slate-400 font-sans">
              Personal baseline: 230 ms ({reactionTime > 230 ? `+${reactionTime - 230}ms shift` : 'Optimal'})
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                startTest();
              }}
              className="mt-2 rounded bg-slate-800 border border-slate-700 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white inline-flex items-center gap-1 font-sans"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retest</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
