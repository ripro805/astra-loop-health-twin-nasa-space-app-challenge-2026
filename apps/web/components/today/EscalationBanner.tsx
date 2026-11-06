'use client';

import React from 'react';
import Link from 'next/link';
import { AlertOctagon, AlertTriangle, ArrowRight, Clock, ShieldAlert, Check } from 'lucide-react';
import { api } from '../../lib/api';

interface EscalationBannerProps {
  tier: string;
  banner?: {
    tier: string;
    trigger: string;
    actionSummary: string;
  } | null;
  commsDelayMinutes?: number;
  onAcknowledge?: () => void;
}

export const EscalationBanner: React.FC<EscalationBannerProps> = ({
  tier,
  banner,
  commsDelayMinutes = 14.3,
  onAcknowledge,
}) => {
  if (!banner && tier === 'SELF_MANAGE') return null;

  const isEmergency = tier === 'EMERGENCY' || banner?.tier === 'EMERGENCY';
  const isSurgeonContact = tier === 'CONTACT_FLIGHT_SURGEON' || banner?.tier === 'CONTACT_FLIGHT_SURGEON';

  if (!isEmergency && !isSurgeonContact) return null;

  return (
    <div
      className={`rounded-xl border p-4 shadow-xl font-mono transition-all duration-300 ${
        isEmergency
          ? 'border-red-500 bg-red-950/70 text-red-200 ring-2 ring-red-500/50 animate-pulse'
          : 'border-amber-500 bg-amber-950/70 text-amber-200 ring-1 ring-amber-500/40'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`rounded-lg p-2 shrink-0 ${
              isEmergency ? 'bg-red-900/80 text-white' : 'bg-amber-900/80 text-white'
            }`}
          >
            {isEmergency ? (
              <AlertOctagon className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-black/40 border border-current">
                {isEmergency ? 'TIER 4: EMERGENCY AUTONOMOUS' : 'TIER 3: FLIGHT SURGEON NOTIFY'}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-300">
                <Clock className="w-3.5 h-3.5" />
                <span>{commsDelayMinutes}m speed-of-light delay</span>
              </span>
            </div>

            <h3 className="text-sm font-bold text-white tracking-wide">
              {banner?.trigger || (isEmergency ? 'Critical Clinical Threshold Breach' : 'Flight Surgeon Advisory Triggered')}
            </h3>

            <p className="text-xs text-slate-200/90 font-sans leading-relaxed">
              {banner?.actionSummary || 'Execute autonomous clinical protocol. Ground response latency exceeds immediate intervention window.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
          <Link
            href="/guidance"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-white transition shadow ${
              isEmergency ? 'bg-red-600 hover:bg-red-500' : 'bg-amber-600 hover:bg-amber-500'
            }`}
          >
            <span>Guidance Protocol</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {onAcknowledge && (
            <button
              onClick={onAcknowledge}
              className="flex items-center gap-1 rounded-lg border border-slate-700 bg-black/40 hover:bg-black/60 px-3 py-2 text-xs text-slate-300 hover:text-white transition"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Acknowledge</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

