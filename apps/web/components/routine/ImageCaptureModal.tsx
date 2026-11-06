'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';

interface ImageCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ImageCaptureModal: React.FC<ImageCaptureModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [captureType, setCaptureType] = useState<string>('ULTRASOUND');
  const [notes, setNotes] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen && cameraActive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, cameraActive]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera access API not supported in this browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      setCameraError(err.message || 'Could not access device camera. Use file upload fallback.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setImagePreview(dataUrl);
      setCameraActive(false);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!imagePreview) return;
    setSubmitting(true);
    try {
      await api.captureImage({
        type: captureType,
        filePath: imagePreview,
        notes: notes || `Diagnostic ${captureType.toLowerCase()} image captured onboard`,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono">
      <div className="w-full max-w-lg rounded-xl border border-sky-500/40 bg-surface-elevated p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Camera className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold tracking-wider text-slate-100 uppercase">
              Onboard Image & Ultrasound Capture
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Capture Type Selection */}
          <div>
            <label className="text-slate-300 block mb-1 font-bold">EXAMINATION CATEGORY:</label>
            <div className="grid grid-cols-4 gap-2 text-[11px]">
              {['ULTRASOUND', 'FACE', 'SKIN', 'OTHER'].map((type) => (
                <button
                  key={type}
                  onClick={() => setCaptureType(type)}
                  className={`rounded border p-2 text-center transition ${
                    captureType === type
                      ? 'border-sky-500 bg-sky-950/80 text-sky-200 font-bold'
                      : 'border-slate-800 bg-surface text-slate-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Camera Viewfinder or Preview Box */}
          <div className="rounded-lg border border-slate-800 bg-black/60 aspect-video flex flex-col items-center justify-center overflow-hidden relative">
            {cameraActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={handleCaptureSnapshot}
                  className="absolute bottom-3 rounded-full bg-red-600 hover:bg-red-500 text-white p-3 shadow-lg border-2 border-white transition"
                  title="Capture snapshot"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </>
            ) : imagePreview ? (
              <div className="relative w-full h-full">
                <img
                  src={imagePreview}
                  alt="Telemetry capture preview"
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black transition"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3 p-6 text-center">
                <Camera className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-slate-400 text-[11px]">
                  Capture direct ultrasound scan or upload diagnostic imagery.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setCameraActive(true)}
                    className="flex items-center gap-1.5 rounded bg-sky-950 border border-sky-600/50 px-3 py-1.5 text-sky-300 font-bold hover:bg-sky-900 transition"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Open Camera</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded bg-slate-800 border border-slate-700 px-3 py-1.5 text-slate-300 font-bold hover:bg-slate-700 transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />

          {cameraError && (
            <div className="rounded border border-amber-500/40 bg-amber-950/40 p-2.5 text-amber-300 text-[11px] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Notes field */}
          <div>
            <label className="text-slate-300 block mb-1 font-bold">CLINICAL OBSERVATION NOTES:</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Optic nerve sheath diameter (ONSD) measurement; right eye retrobulbar view..."
              className="w-full rounded-lg border border-slate-800 bg-slate-900/80 p-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!imagePreview || submitting}
              className="flex items-center gap-2 rounded bg-sky-600 hover:bg-sky-500 px-4 py-2 text-white font-bold transition disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{submitting ? 'Transmitting to DTN...' : 'Save & Queue to Ground'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

