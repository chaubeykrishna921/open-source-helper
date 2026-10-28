'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, Sparkles, Check, AlertCircle, Cpu, RefreshCw, Server } from 'lucide-react';
import { GithubIcon } from '@/components/Icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  geminiKey: string;
  githubToken: string;
  aiProvider: 'auto' | 'gemini' | 'ollama';
  ollamaModel: string;
  ollamaEndpoint: string;
  onSave: (
    geminiKey: string,
    githubToken: string,
    aiProvider: 'auto' | 'gemini' | 'ollama',
    ollamaModel: string,
    ollamaEndpoint: string
  ) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  geminiKey,
  githubToken,
  aiProvider,
  ollamaModel,
  ollamaEndpoint,
  onSave,
}: SettingsModalProps) {
  const [localGeminiKey, setLocalGeminiKey] = useState(geminiKey);
  const [localGithubToken, setLocalGithubToken] = useState(githubToken);
  const [localProvider, setLocalProvider] = useState<'auto' | 'gemini' | 'ollama'>(aiProvider || 'auto');
  const [localOllamaModel, setLocalOllamaModel] = useState(ollamaModel || 'qwen3.5:4b');
  const [localOllamaEndpoint, setLocalOllamaEndpoint] = useState(ollamaEndpoint || 'http://localhost:11434');

  const [ollamaStatus, setOllamaStatus] = useState<{
    running: boolean;
    models: string[];
    loading: boolean;
  }>({ running: false, models: [], loading: false });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkOllamaConnection(localOllamaEndpoint);
    }
  }, [isOpen]);

  const checkOllamaConnection = async (endpoint: string) => {
    setOllamaStatus((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch(`/api/ollama?endpoint=${encodeURIComponent(endpoint)}`);
      const data = await res.json();
      setOllamaStatus({
        running: data.running,
        models: data.models || [],
        loading: false,
      });
      if (data.models && data.models.length > 0 && !data.models.includes(localOllamaModel)) {
        setLocalOllamaModel(data.models[0]);
      }
    } catch {
      setOllamaStatus({ running: false, models: [], loading: false });
    }
  };

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      localGeminiKey.trim(),
      localGithubToken.trim(),
      localProvider,
      localOllamaModel.trim(),
      localOllamaEndpoint.trim()
    );
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    setLocalGeminiKey('');
    setLocalGithubToken('');
    setLocalProvider('auto');
    setLocalOllamaModel('qwen3.5:4b');
    setLocalOllamaEndpoint('http://localhost:11434');
    onSave('', '', 'auto', 'qwen3.5:4b', 'http://localhost:11434');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">AI Engine & API Credentials</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-5">
          {/* AI Provider Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              Active AI Intelligence Engine
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setLocalProvider('auto')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  localProvider === 'auto'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>⚡ Auto-Detect</span>
                <span className="block text-[10px] text-slate-500 font-normal mt-0.5">Gemini / Ollama</span>
              </button>

              <button
                type="button"
                onClick={() => setLocalProvider('ollama')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  localProvider === 'ollama'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🦙 Ollama Local</span>
                <span className="block text-[10px] text-slate-500 font-normal mt-0.5">100% Free / Private</span>
              </button>

              <button
                type="button"
                onClick={() => setLocalProvider('gemini')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  localProvider === 'gemini'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🌟 Google Gemini</span>
                <span className="block text-[10px] text-slate-500 font-normal mt-0.5">Cloud API</span>
              </button>
            </div>
          </div>

          {/* OLLAMA CONFIGURATION BLOCK */}
          {(localProvider === 'ollama' || localProvider === 'auto') && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5" />
                  Ollama Local Configuration
                </span>
                <div className="flex items-center gap-1.5">
                  {ollamaStatus.loading ? (
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Checking...
                    </span>
                  ) : ollamaStatus.running ? (
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Connected ({ollamaStatus.models.length} models)
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-red-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                      Ollama Not Detected
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => checkOllamaConnection(localOllamaEndpoint)}
                    className="p-1 text-slate-400 hover:text-white"
                    title="Refresh connection"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Model selection dropdown */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-300 block">Select Local Model</label>
                {ollamaStatus.models.length > 0 ? (
                  <select
                    value={localOllamaModel}
                    onChange={(e) => setLocalOllamaModel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/60"
                  >
                    {ollamaStatus.models.map((modelName) => (
                      <option key={modelName} value={modelName}>
                        {modelName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={localOllamaModel}
                    onChange={(e) => setLocalOllamaModel(e.target.value)}
                    placeholder="e.g. qwen3.5:4b, gemma4:12b, llama3.2"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/60"
                  />
                )}
                <p className="text-[10px] text-slate-500">
                  Detected models on your system: {ollamaStatus.models.join(', ') || 'None found (run `ollama run qwen3.5:4b`)'}
                </p>
              </div>

              {/* Endpoint */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-300 block">Ollama Endpoint URL</label>
                <input
                  type="text"
                  value={localOllamaEndpoint}
                  onChange={(e) => setLocalOllamaEndpoint(e.target.value)}
                  placeholder="http://localhost:11434"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/60"
                />
              </div>
            </div>
          )}

          {/* Gemini API Key */}
          {(localProvider === 'gemini' || localProvider === 'auto') && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Google Gemini API Key (Optional)
              </label>
              <input
                type="password"
                value={localGeminiKey}
                onChange={(e) => setLocalGeminiKey(e.target.value)}
                placeholder="AIzaSy... (leave blank to use Ollama or offline fallback)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/60"
              />
              <p className="text-[11px] text-slate-500">
                Uses <code className="text-amber-400">gemini-3.8-flash</code> when key is provided.
              </p>
            </div>
          )}

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
              Expands public GitHub Search API rate limits for live issue querying.
            </p>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              Configuration saved successfully!
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-300 underline"
            >
              Reset to Defaults
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
