import Link from 'next/link';
import {
  Orbit,
  User,
  BookOpen,
  CalendarCheck,
  Stethoscope,
  Award,
  Shield,
  FileText,
  Activity,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';

const loop = ['SENSE', 'UNDERSTAND', 'PREDICT', 'ACT', 'LEARN'];

const hazards = [
  { name: 'SPACE RADIATION', desc: 'Solar particle events & cosmic radiation damaging DNA and tissue.' },
  { name: 'ISOLATION & CONFINEMENT', desc: 'Circadian desynchrony, psychological fatigue, acoustic stress.' },
  { name: 'DISTANCE FROM EARTH', desc: 'Speed-of-light comm delay requiring autonomous decision support.' },
  { name: 'GRAVITY FIELDS', desc: '0g, lunar 0.16g, Mars 0.38g fluid shift & bone/muscle unloading.' },
  { name: 'HOSTILE CLOSED ENVIRONMENT', desc: 'Hypercapnia (CO2), thermal shifts, microbial accumulation.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-mono selection:bg-sky-500 selection:text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10 space-y-12">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-950 border border-sky-500/50 text-sky-400">
              <Orbit className="w-5 h-5 animate-spin" style={{ animationDuration: '30s' }} />
            </div>
            <div>
              <span className="text-base font-black tracking-widest text-slate-100 block">
                ASTRA-LOOP v2
              </span>
              <span className="text-[10px] text-sky-400 font-bold tracking-wider uppercase">
                NASA SPACE APPS CHALLENGE 2026
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider text-slate-400">
            <span className="rounded border border-slate-700 bg-slate-900/60 px-2.5 py-1 text-slate-300">
              5 HRP HAZARDS
            </span>
            <span className="rounded border border-slate-700 bg-slate-900/60 px-2.5 py-1 text-slate-300">
              DELAY-TOLERANT (DTN)
            </span>
            <span className="rounded border border-emerald-700/60 bg-emerald-950/40 px-2.5 py-1 text-emerald-300">
              ABSOLUTE SAFETY OVERRIDE
            </span>
          </div>
        </header>

        {/* Hero Section */}
        <main className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <section className="space-y-6">
            <div className="flex flex-wrap gap-2 text-xs font-bold text-sky-300">
              <span className="rounded-full border border-sky-500/40 bg-sky-950/80 px-3 py-1">
                Autonomous Aerospace Health Twin
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-slate-400">
                Mission Day 61 Hero Storyline
              </span>
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Closed-Loop Astronaut Health Twin
            </h1>

            <p className="max-w-xl text-base text-slate-300 font-sans leading-relaxed">
              Equips deep space crews to autonomously assess their own health, understand multi-hazard spaceflight stressors, receive grounded clinical guidance, and adapt countermeasures across transit, lunar, and Martian environments.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/today"
                className="flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 px-5 py-3 text-sm font-bold text-white transition shadow-lg shadow-sky-900/30"
              >
                <span>Launch Mission Control</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/body"
                className="flex items-center gap-2 rounded-lg border border-sky-500/40 bg-sky-950/60 hover:bg-sky-900/60 px-5 py-3 text-sm font-bold text-sky-200 transition"
              >
                <User className="w-4 h-4" />
                <span>Interactive Human Body</span>
              </Link>
            </div>

            {/* Feature quick links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4">
              <Link
                href="/learn"
                className="rounded-lg border border-slate-800 bg-surface p-3 text-xs hover:border-slate-700 text-slate-300 hover:text-white transition"
              >
                <BookOpen className="w-4 h-4 text-sky-400 mb-1" />
                <span className="font-bold block">Knowledge Hub</span>
                <span className="text-[10px] text-slate-500">What to measure & why</span>
              </Link>
              <Link
                href="/routine"
                className="rounded-lg border border-slate-800 bg-surface p-3 text-xs hover:border-slate-700 text-slate-300 hover:text-white transition"
              >
                <CalendarCheck className="w-4 h-4 text-emerald-400 mb-1" />
                <span className="font-bold block">Daily Routine</span>
                <span className="text-[10px] text-slate-500">Tasks & Ultrasound</span>
              </Link>
              <Link
                href="/guidance"
                className="rounded-lg border border-slate-800 bg-surface p-3 text-xs hover:border-slate-700 text-slate-300 hover:text-white transition"
              >
                <Stethoscope className="w-4 h-4 text-rose-400 mb-1" />
                <span className="font-bold block">Treatment Wizard</span>
                <span className="text-[10px] text-slate-500">Decision trees</span>
              </Link>
              <Link
                href="/progress"
                className="rounded-lg border border-slate-800 bg-surface p-3 text-xs hover:border-slate-700 text-slate-300 hover:text-white transition"
              >
                <Award className="w-4 h-4 text-amber-400 mb-1" />
                <span className="font-bold block">XP & Badges</span>
                <span className="text-[10px] text-slate-500">Gamification</span>
              </Link>
            </div>
          </section>

          {/* Right Column: 5-Step Closed Loop Visualization */}
          <section className="rounded-2xl border border-slate-800 bg-surface-elevated p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">
                5-STEP CLOSED-LOOP ARCHITECTURE
              </span>
              <span className="text-[10px] text-slate-500">NASA Bio-Twin Loop</span>
            </div>

            <div className="space-y-2.5">
              {[
                { step: 'SENSE', title: 'Multimodal Telemetry', desc: 'ECG, BP, glucose, core temp, SpO2, PVT reaction, acoustic voice, and cabin CO2.' },
                { step: 'UNDERSTAND', title: 'Dual-Layer Safety Scoring', desc: 'Individualized EWMA baseline Z-scores checked against absolute clinical envelopes.' },
                { step: 'PREDICT', title: 'Multivariate Forecasting', desc: '7-day & 30-day allostatic trajectories modeling compound hazard interactions.' },
                { step: 'ACT', title: 'Autonomous Decision Trees', desc: 'Flight rules guidance, immediate countermeasure prescriptions, and shelter protocols.' },
                { step: 'LEARN', title: 'Learn Loop Validation', desc: 'Evaluates countermeasure delta-Z at 48-72h. Ranks what actually restored homeostasis.' },
              ].map((item, idx) => (
                <div
                  key={item.step}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 flex items-start gap-3"
                >
                  <div className="rounded-lg bg-sky-950 border border-sky-600/40 text-sky-300 font-bold text-xs w-7 h-7 flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-100">{item.step}:</span>
                      <span className="text-xs text-sky-300">{item.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Section: The 5 HRP Spaceflight Hazards */}
        <section className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest block">
                NASA HUMAN RESEARCH PROGRAM FOUNDATION
              </span>
              <h2 className="text-xl font-bold text-slate-100">
                The 5 In-Flight Hazards Mapped in ASTRA-LOOP v2
              </h2>
            </div>
            <Link
              href="/learn"
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-bold"
            >
              <span>Explore Hazard Science</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {hazards.map((h, i) => (
              <div
                key={h.name}
                className="rounded-xl border border-slate-800 bg-surface/70 p-4 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] font-bold text-sky-400">HAZARD #{i + 1}</div>
                  <h3 className="font-bold text-xs text-slate-100 mt-0.5">{h.name}</h3>
                  <p className="text-[11px] text-slate-400 font-sans mt-1 leading-relaxed">
                    {h.desc}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 text-[10px] text-emerald-400 font-bold">
                  ✓ Active in Engine
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
