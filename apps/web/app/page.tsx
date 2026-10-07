import Link from 'next/link';

const loop = ['SENSE', 'UNDERSTAND', 'PREDICT', 'ACT', 'LEARN'];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10">
        <header className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="font-mono text-sm font-bold uppercase tracking-[0.32rem] text-sky-300">ASTRA-LOOP</div>
          <div className="flex gap-2 text-[10px] font-mono uppercase tracking-[0.2rem] text-slate-400">
            <span className="rounded border border-slate-700 px-2 py-1">SYNTHETIC DATA</span>
            <span className="rounded border border-slate-700 px-2 py-1">OFFLINE FIRST</span>
            <span className="rounded border border-slate-700 px-2 py-1">DECISION SUPPORT</span>
          </div>
        </header>

        <main className="grid gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <section>
            <div className="mb-6 flex flex-wrap gap-3 text-xs font-mono uppercase tracking-[0.25rem] text-sky-300">
              <span className="rounded border border-sky-700/60 bg-sky-950/60 px-3 py-1">Closed-Loop Health Twin</span>
              <span className="rounded border border-slate-700 bg-slate-900/60 px-3 py-1">Mission Day 61</span>
            </div>
            <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Closed-Loop Astronaut Health Twin
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Understand what changed. Predict what may happen next. Act safely. Learn what worked.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/today" className="rounded-lg border border-sky-500 bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-500">
                Launch Demo
              </Link>
              <Link href="/about" className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 hover:border-slate-500">
                Explore System
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-3 text-[10px] font-mono uppercase tracking-[0.25rem] text-slate-400">
              <span className="rounded border border-slate-700 px-2 py-1">SYNTHETIC DATA</span>
              <span className="rounded border border-slate-700 px-2 py-1">OFFLINE FIRST</span>
              <span className="rounded border border-slate-700 px-2 py-1">DECISION SUPPORT ONLY</span>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl">
            <div className="mb-4 text-xs font-mono uppercase tracking-[0.3rem] text-slate-400">Mission loop</div>
            <div className="space-y-3">
              {loop.map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-700 bg-slate-950 text-[10px] font-bold text-sky-300">
                    {index + 1}
                  </div>
                  <div className="flex-1 rounded-md border border-slate-700 bg-slate-950/80 px-3 py-2 text-center text-xs font-mono font-bold uppercase tracking-[0.2rem] text-slate-200">
                    {item}
                  </div>
                  {index < loop.length - 1 && <div className="text-slate-500">↓</div>}
                </div>
              ))}
            </div>
          </section>
        </main>

        <section className="grid gap-6 pb-12 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="mb-3 text-xs font-mono uppercase tracking-[0.24rem] text-emerald-300">Learn Loop</div>
            <h2 className="text-xl font-bold text-white">Did it work?</h2>
            <p className="mt-3 text-sm text-slate-300">Track a countermeasure for 48–72 hours and compare before/after z-scores to see whether the action helped the astronaut recover.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="mb-3 text-xs font-mono uppercase tracking-[0.24rem] text-rose-300">Radiation Watch</div>
            <h2 className="text-xl font-bold text-white">72-hour event monitoring</h2>
            <p className="mt-3 text-sm text-slate-300">Monitor delayed sleep, HRV, reaction time, and voice cadence changes after a solar particle event or dose spike.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="mb-3 text-xs font-mono uppercase tracking-[0.24rem] text-violet-300">Blind-Spot-Aware Fusion</div>
            <h2 className="text-xl font-bold text-white">Confidence falls when data is missing</h2>
            <p className="mt-3 text-sm text-slate-300">Missing modalities are surfaced explicitly instead of being inferred or fabricated, keeping the decision support transparent.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
