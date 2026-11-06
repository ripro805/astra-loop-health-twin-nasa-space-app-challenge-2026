'use client';

import React, { useState, useEffect } from 'react';
import { TreatmentDecisionTree, DecisionNode } from '@astra-loop/shared';
import {
  Stethoscope,
  ChevronRight,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  FileText,
  Shield,
  Printer,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { api } from '../../lib/api';

interface TreatmentWizardProps {
  initialTrees: Array<{
    id: string;
    title: string;
    triggerCondition: string;
    category: string;
    rootNodeId: string;
  }>;
}

export const TreatmentWizard: React.FC<TreatmentWizardProps> = ({ initialTrees }) => {
  const [selectedTreeId, setSelectedTreeId] = useState<string>(initialTrees[0]?.id || 'sleep_loss');
  const [currentTree, setCurrentTree] = useState<TreatmentDecisionTree | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ node: DecisionNode; chosenOptionLabel: string }>>([]);
  const [terminalAction, setTerminalAction] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTree(selectedTreeId);
  }, [selectedTreeId]);

  const loadTree = async (treeId: string) => {
    setLoading(true);
    setHistory([]);
    setTerminalAction(null);
    try {
      const tree = await api.getGuidanceTree(treeId);
      setCurrentTree(tree);
      setCurrentNodeId(tree.rootNodeId);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (!currentTree || !currentNodeId) return;
    const currentNode = currentTree.nodes[currentNodeId];
    if (!currentNode) return;

    const chosenOption = currentNode.options[optionIndex];
    if (!chosenOption) return;

    // Record in history
    setHistory((prev) => [...prev, { node: currentNode, chosenOptionLabel: chosenOption.label }]);

    if (chosenOption.terminalAction) {
      setTerminalAction(chosenOption.terminalAction);
      setCurrentNodeId(null);
    } else if (chosenOption.nextNodeId) {
      setCurrentNodeId(chosenOption.nextNodeId);
    }
  };

  const handleReset = () => {
    if (currentTree) {
      setCurrentNodeId(currentTree.rootNodeId);
      setHistory([]);
      setTerminalAction(null);
    }
  };

  const activeNode = currentTree && currentNodeId ? currentTree.nodes[currentNodeId] : null;

  return (
    <div className="space-y-6 font-mono">
      {/* Category Selection Tabs */}
      <div className="rounded-xl border border-slate-800 bg-surface/70 p-4 space-y-3">
        <span className="text-[10px] text-slate-500 uppercase tracking-widest block">
          SELECT CLINICAL CONDITION OR PROTOCOL:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {initialTrees.map((tree) => {
            const isSelected = tree.id === selectedTreeId;
            return (
              <button
                key={tree.id}
                onClick={() => setSelectedTreeId(tree.id)}
                className={`rounded-lg border p-3 text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-sky-500 bg-sky-950/60 text-slate-100 ring-1 ring-sky-500/40'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs line-clamp-1">{tree.title}</div>
                <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                  Trigger: {tree.triggerCondition}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Wizard Interactive Container */}
      <div className="rounded-xl border border-slate-800 bg-surface-elevated p-6 shadow-xl space-y-6">
        {/* Wizard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] text-sky-400 font-bold uppercase tracking-widest block mb-1">
              DECISION-TREE GUIDANCE ENGINE
            </span>
            <h2 className="text-xl font-bold text-slate-100">{currentTree?.title}</h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              {currentTree?.medicalDisclaimer}
            </p>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded border border-slate-700 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Protocol</span>
          </button>
        </div>

        {/* Step Progression Breadcrumb */}
        {history.length > 0 && (
          <div className="space-y-1.5 bg-slate-900/50 rounded-lg p-3 border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">AUDIT PATH:</span>
            {history.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-400 text-[11px]">
                <span className="text-sky-400 font-bold">Q{i + 1}:</span>
                <span className="text-slate-300">{h.node.question}</span>
                <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  {h.chosenOptionLabel}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Active Question Node */}
        {activeNode && !terminalAction && (
          <div className="space-y-5 animate-fade-in">
            <div className="rounded-lg border border-sky-900/50 bg-sky-950/20 p-4 space-y-2">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest block">
                STEP {history.length + 1}
              </span>
              <h3 className="text-lg font-bold text-slate-100">{activeNode.question}</h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {activeNode.explanation}
              </p>
            </div>

            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                SELECT CLINICAL FINDING:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeNode.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className="group rounded-xl border border-slate-800 bg-surface p-4 text-left hover:border-sky-500 hover:bg-sky-950/30 transition shadow-sm space-y-1.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-200 group-hover:text-sky-300 flex items-center justify-between">
                        <span>{opt.label}</span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition" />
                      </div>
                      {opt.description && (
                        <p className="text-[11px] text-slate-400 font-sans mt-1">
                          {opt.description}
                        </p>
                      )}
                    </div>

                    {opt.terminalAction && (
                      <span className="text-[9px] text-amber-400 font-bold uppercase tracking-wider block pt-2 border-t border-slate-800/80">
                        ➔ Resolves to: {opt.terminalAction.tier}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Terminal Recommended Action Card */}
        {terminalAction && (
          <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/20 p-6 space-y-5 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/60 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-0.5">
                  CLINICAL PROTOCOL RESOLVED
                </span>
                <h3 className="text-xl font-bold text-slate-100">{terminalAction.title}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase border ${
                    terminalAction.tier === 'EMERGENCY'
                      ? 'border-red-500 bg-red-950/80 text-red-300'
                      : terminalAction.tier === 'CONTACT_FLIGHT_SURGEON'
                      ? 'border-amber-500 bg-amber-950/80 text-amber-300'
                      : 'border-emerald-500 bg-emerald-950/80 text-emerald-300'
                  }`}
                >
                  {terminalAction.tier}
                </span>
              </div>
            </div>

            {/* Immediate Steps Checklist */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-emerald-300 uppercase flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>IMMEDIATE ACTIONS FOR CREW:</span>
              </h4>
              <div className="rounded-lg border border-slate-800 bg-surface p-4 space-y-2 text-xs font-sans text-slate-200">
                {terminalAction.immediateSteps.map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="rounded-full bg-emerald-950 border border-emerald-600/50 text-emerald-300 w-5 h-5 flex items-center justify-center text-[10px] font-bold shrink-0 font-mono mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Flight Surgeon Transmission Note */}
            <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>DELAY-TOLERANT GROUND NOTIFICATION PACKET (DTN):</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed italic bg-slate-900/60 rounded p-3 border border-slate-800">
                "{terminalAction.flightSurgeonNotificationNote}"
              </p>
            </div>

            {/* Evidence Base */}
            <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
              <span>Authority: {terminalAction.source}</span>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-bold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Protocol Card</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
