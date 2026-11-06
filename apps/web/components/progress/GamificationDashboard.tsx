'use client';

import React from 'react';
import { GamificationState } from '@astra-loop/shared';
import {
  Award,
  Zap,
  Flame,
  Shield,
  Heart,
  Moon,
  Droplets,
  Bone,
  CheckCircle,
  Lock,
  Sparkles,
  Info,
} from 'lucide-react';

interface GamificationDashboardProps {
  state: GamificationState;
}

export const GamificationDashboard: React.FC<GamificationDashboardProps> = ({ state }) => {
  const getBadgeIcon = (code: string) => {
    switch (code) {
      case 'BONE_GUARDIAN':
        return <Bone className="w-5 h-5 text-amber-400" />;
      case 'STEADY_HEART':
        return <Heart className="w-5 h-5 text-rose-400" />;
      case 'CIRCADIAN_MASTER':
        return <Moon className="w-5 h-5 text-indigo-400" />;
      case 'RADIATION_READY':
        return <Shield className="w-5 h-5 text-sky-400" />;
      case 'HYDRATION_HERO':
        return <Droplets className="w-5 h-5 text-cyan-400" />;
      default:
        return <Award className="w-5 h-5 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Gamification Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Level & XP Card */}
        <div className="rounded-xl border border-sky-500/40 bg-surface/80 p-5 space-y-3 sm:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-sky-950 border border-sky-600/50 p-2 text-sky-300">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block">CREW RANK</span>
                <span className="text-xl font-black text-slate-100">LEVEL {state.level}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase block">TOTAL XP</span>
              <span className="text-lg font-bold text-sky-300">{state.xp.toLocaleString()} XP</span>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Next Rank Requirement</span>
              <span>{state.xpToNextLevel} XP needed</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(15, Math.round((state.xp / (state.xp + state.xpToNextLevel)) * 100))
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Streak Counter */}
        <div className="rounded-xl border border-amber-500/40 bg-surface/80 p-5 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">TELEMETRY STREAK</span>
            <Flame className="w-5 h-5 text-amber-400" />
          </div>

          <div>
            <div className="text-3xl font-black text-amber-300 flex items-baseline gap-1">
              <span>{state.currentStreakDays}</span>
              <span className="text-xs font-normal text-slate-400">DAYS</span>
            </div>
            <span className="text-[10px] text-slate-500">
              Longest: {state.longestStreakDays} days consecutive
            </span>
          </div>

          <div className="text-[10px] text-emerald-400 font-bold">
            +50 XP bonus active for 7+ day streak
          </div>
        </div>

        {/* Composite Health Ring */}
        <div className="rounded-xl border border-emerald-500/40 bg-surface/80 p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block">ALLOSTATIC RING</span>
            <div className="text-3xl font-black text-emerald-300 mt-1">{state.healthScoreRing}%</div>
            <span className="text-[10px] text-slate-400">Optimal Stability</span>
          </div>

          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="#1e293b" strokeWidth="6" fill="none" />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#10b981"
                strokeWidth="6"
                strokeDasharray="163"
                strokeDashoffset={163 - (163 * state.healthScoreRing) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <Sparkles className="absolute w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Safety Guardrail Alert */}
      <div className="rounded-xl border border-indigo-900/50 bg-indigo-950/20 p-4 flex items-center gap-3 text-xs text-slate-300">
        <Info className="w-5 h-5 text-indigo-400 shrink-0" />
        <span className="font-sans leading-relaxed">
          <strong>Spaceflight Health Gamification Guardrail:</strong> In accordance with NASA behavioral health directives, XP awards reward consistency and adherence rather than physical over-exertion. No additional XP is awarded for exercising beyond prescribed limits to prevent musculoskeletal strain.
        </span>
      </div>

      {/* Badges Gallery */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Mission Milestone Badges & Commendations
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {state.badges.filter((b) => b.unlocked).length} of {state.badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.badges.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-xl border p-4 transition flex flex-col justify-between ${
                badge.unlocked
                  ? 'border-slate-700 bg-surface/90 shadow-lg'
                  : 'border-slate-800/60 bg-slate-900/30 opacity-60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-xl p-3 border ${
                        badge.unlocked
                          ? 'border-yellow-500/40 bg-yellow-950/30'
                          : 'border-slate-800 bg-slate-900'
                      }`}
                    >
                      {badge.unlocked ? (
                        getBadgeIcon(badge.code)
                      ) : (
                        <Lock className="w-5 h-5 text-slate-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-100">{badge.title}</h4>
                      <span className="text-[10px] text-yellow-400/90 font-bold uppercase">
                        {badge.tier} TIER COMMENDATION
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {badge.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px]">
                {badge.unlocked ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Unlocked on {badge.unlockedAt ? new Date(badge.unlockedAt).toLocaleDateString() : 'Mission Day 45'}</span>
                  </span>
                ) : (
                  <span className="text-slate-500">Locked • In Progress</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
