'use client';

import React, { useState } from 'react';
import { RoutineTask } from '@astra-loop/shared';
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Camera,
  HeartPulse,
  Activity,
  Thermometer,
  ShieldAlert,
  Plus,
  Check,
  ChevronRight,
  Info,
} from 'lucide-react';
import { api } from '../../lib/api';
import { ImageCaptureModal } from './ImageCaptureModal';

interface RoutineChecklistProps {
  tasks: RoutineTask[];
  onRefresh: () => void;
}

export const RoutineChecklist: React.FC<RoutineChecklistProps> = ({ tasks, onRefresh }) => {
  const [selectedTask, setSelectedTask] = useState<RoutineTask | null>(null);
  const [quickEntryValue, setQuickEntryValue] = useState<string>('');
  const [quickEntryValue2, setQuickEntryValue2] = useState<string>(''); // For BP diastolic
  const [isQuickEntryOpen, setIsQuickEntryOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const completedCount = tasks.filter((t) => t.completed).length;
  const compliancePct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 100;

  const timeBuckets: Array<'MORNING' | 'AFTERNOON' | 'EVENING' | 'BEDTIME'> = [
    'MORNING',
    'AFTERNOON',
    'EVENING',
    'BEDTIME',
  ];

  const handleToggleTask = async (task: RoutineTask) => {
    if (task.completed) return; // already completed
    try {
      await api.completeRoutineTask(task.id, 'Routine assessment confirmed.');
      onRefresh();
    } catch (err: any) {
      alert(`Could not complete task: ${err.message}`);
    }
  };

  const handleOpenQuickEntry = (task: RoutineTask) => {
    setSelectedTask(task);
    setQuickEntryValue('');
    setQuickEntryValue2('');
    setIsQuickEntryOpen(true);
  };

  const handleSubmitQuickEntry = async () => {
    if (!selectedTask) return;
    setSubmitting(true);
    try {
      const payload: any = {
        mood: 8,
        fatigue: 4,
        stress: 5,
        reactionTimeMs: 235,
      };

      if (selectedTask.indicatorKey === 'systolicBP') {
        payload.systolicBP = parseFloat(quickEntryValue) || 120;
        payload.diastolicBP = parseFloat(quickEntryValue2) || 80;
      } else if (selectedTask.indicatorKey === 'bloodGlucose') {
        payload.bloodGlucose = parseFloat(quickEntryValue) || 95;
      } else if (selectedTask.indicatorKey === 'bodyTemp') {
        payload.bodyTemp = parseFloat(quickEntryValue) || 36.8;
      } else if (selectedTask.indicatorKey === 'spo2') {
        payload.spo2 = parseFloat(quickEntryValue) || 98.5;
      }

      await api.submitCheckIn(payload);
      await api.completeRoutineTask(
        selectedTask.id,
        `Direct telemetry entry recorded: ${quickEntryValue} ${
          quickEntryValue2 ? `/${quickEntryValue2}` : ''
        }`
      );
      setIsQuickEntryOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Overview Cards Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Compliance Card */}
        <div className="rounded-xl border border-slate-800 bg-surface/80 p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block">DAILY COMPLIANCE</span>
            <div className="text-3xl font-black text-sky-300 mt-0.5">{compliancePct}%</div>
            <span className="text-xs text-slate-400">
              {completedCount} of {tasks.length} tasks completed
            </span>
          </div>

          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle cx="28" cy="28" r="22" stroke="#1e293b" strokeWidth="5" fill="none" />
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke={compliancePct >= 80 ? '#10b981' : compliancePct >= 50 ? '#f59e0b' : '#ef4444'}
                strokeWidth="5"
                strokeDasharray="138"
                strokeDashoffset={138 - (138 * compliancePct) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="absolute text-[11px] font-bold text-slate-200">{completedCount}/{tasks.length}</span>
          </div>
        </div>

        {/* Flight Rule Reminder */}
        <div className="rounded-xl border border-indigo-900/40 bg-indigo-950/20 p-4 space-y-1 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-bold">
            <Info className="w-4 h-4 text-indigo-400" />
            <span>FLIGHT SURGEON DIRECTIVE</span>
          </div>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            Uncompleted examinations reduce sensor confidence scoring by 4% per overdue stream. Please complete morning vitest batch prior to cycle ergometer session.
          </p>
        </div>

        {/* Ultrasound / Camera Action Card */}
        <div className="rounded-xl border border-sky-900/50 bg-sky-950/30 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-sky-400 uppercase">IMAGE TELEMETRY</span>
            <Camera className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            Capture ocular ONSD ultrasound or facial fatigue imagery for ground evaluation.
          </p>
          <button
            onClick={() => setIsImageModalOpen(true)}
            className="mt-2 w-full flex items-center justify-center gap-1.5 rounded bg-sky-600 hover:bg-sky-500 py-1.5 text-xs text-white font-bold transition shadow-sm"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Open Camera Scanner</span>
          </button>
        </div>
      </div>

      {/* Routine Time Buckets */}
      <div className="space-y-5">
        {timeBuckets.map((bucket) => {
          const bucketTasks = tasks.filter((t) => t.timeOfDay === bucket);
          if (bucketTasks.length === 0) return null;

          return (
            <div key={bucket} className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 border-b border-slate-800 pb-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span className="tracking-wider">{bucket} PROTOCOL</span>
                <span className="text-[10px] text-slate-500">
                  ({bucketTasks.filter((t) => t.completed).length}/{bucketTasks.length})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {bucketTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`rounded-xl border p-4 transition flex items-start justify-between ${
                      task.completed
                        ? 'border-emerald-900/40 bg-emerald-950/10 text-slate-400'
                        : 'border-slate-800 bg-surface/70 hover:border-slate-700 text-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleTask(task)}
                        className={`mt-0.5 rounded transition ${
                          task.completed
                            ? 'text-emerald-400'
                            : 'text-slate-500 hover:text-sky-400'
                        }`}
                        title={task.completed ? 'Completed' : 'Click to mark complete'}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-xs ${
                              task.completed ? 'line-through text-slate-500' : 'text-slate-100'
                            }`}
                          >
                            {task.title}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {task.dueTime}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 font-sans">
                          {task.howToMeasureSnippet}
                        </p>

                        {task.completedAt && (
                          <span className="inline-block text-[9px] text-emerald-400 font-mono">
                            ✓ Recorded at {new Date(task.completedAt).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {!task.completed && (
                      <button
                        onClick={() => handleOpenQuickEntry(task)}
                        className="rounded border border-sky-600/40 bg-sky-950/60 px-2.5 py-1 text-[11px] font-bold text-sky-300 hover:bg-sky-900 transition shrink-0 ml-2"
                      >
                        Enter Value
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Entry Modal */}
      {isQuickEntryOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono">
          <div className="w-full max-w-md rounded-xl border border-sky-500/40 bg-surface-elevated p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 uppercase">
                Record Telemetry: {selectedTask.title}
              </h3>
              <button
                onClick={() => setIsQuickEntryOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 font-sans">
              {selectedTask.howToMeasureSnippet}
            </p>

            <div className="space-y-3">
              {selectedTask.indicatorKey === 'systolicBP' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">SYSTOLIC (mmHg):</label>
                    <input
                      type="number"
                      placeholder="e.g. 118"
                      value={quickEntryValue}
                      onChange={(e) => setQuickEntryValue(e.target.value)}
                      className="w-full rounded border border-slate-800 bg-slate-900 p-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">DIASTOLIC (mmHg):</label>
                    <input
                      type="number"
                      placeholder="e.g. 78"
                      value={quickEntryValue2}
                      onChange={(e) => setQuickEntryValue2(e.target.value)}
                      className="w-full rounded border border-slate-800 bg-slate-900 p-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs text-slate-300 block mb-1">
                    {selectedTask.indicatorKey === 'bloodGlucose'
                      ? 'BLOOD GLUCOSE (mg/dL):'
                      : selectedTask.indicatorKey === 'bodyTemp'
                      ? 'CORE TEMPERATURE (°C):'
                      : selectedTask.indicatorKey === 'spo2'
                      ? 'PULSE OXIMETRY (% SpO2):'
                      : 'MEASUREMENT VALUE:'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Enter numeric value..."
                    value={quickEntryValue}
                    onChange={(e) => setQuickEntryValue(e.target.value)}
                    className="w-full rounded border border-slate-800 bg-slate-900 p-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800 text-xs">
              <button
                onClick={() => setIsQuickEntryOpen(false)}
                className="px-3 py-1.5 rounded text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitQuickEntry}
                disabled={submitting || !quickEntryValue}
                className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold transition disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Submit Measurement'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Capture Scanner Modal */}
      <ImageCaptureModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSuccess={onRefresh}
      />
    </div>
  );
};

