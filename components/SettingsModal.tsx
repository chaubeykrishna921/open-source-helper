'use client';

import React, { useState } from 'react';
import { X, Key, Sparkles, Check, AlertCircle } from 'lucide-react';
import { GithubIcon } from '@/components/Icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  geminiKey: string;
  githubToken: string;
  onSave: (geminiKey: string, githubToken: string) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  geminiKey,
  githubToken,
  onSave,
}: SettingsModalProps) {
  const [localGeminiKey, setLocalGeminiKey] = useState(geminiKey);
  const [localGithubToken, setLocalGithubToken] = useState(githubToken);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localGeminiKey.trim(), localGithubToken.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    setLocalGeminiKey('');
    setLocalGithubToken('');
    onSave('', '');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">API Credentials & Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          {/* Gemini API Key */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Gemini API Key (Optional)
            </label>
            <input
              type="password"
              value={localGeminiKey}
              onChange={(e) => setLocalGeminiKey(e.target.value)}
              placeholder="AIzaSy... (leave blank to use smart offline heuristic)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/60"
            />
            <p className="text-[11px] text-slate-500">
              When provided, uses <code className="text-emerald-400">gemini-3.8-flash</code> for live real-time analysis. When omitted, uses high-fidelity offline heuristic simulation.
            </p>
          </div>

          {/* GitHub Personal Access Token */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <GithubIcon className="w-3.5 h-3.5 text-slate-300" />
              GitHub Personal Access Token (Optional)
            </label>
            <input
              type="password"
              value={localGithubToken}
              onChange={(e) => setLocalGithubToken(e.target.value)}
              placeholder="ghp_... (increases rate limits from 60 to 5,000 req/hr)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/60"
            />
            <p className="text-[11px] text-slate-500">
              Increases public API limits for live repository and issue querying.
            </p>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              Settings saved successfully!
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-300 underline"
            >
              Reset to Demo Defaults
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
              >
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
