'use client';

import React, { useState } from 'react';
import { Issue, IssueExplanation } from '@/lib/types';
import { SAMPLE_ISSUES } from '@/lib/mock-data';
import {
  Sparkles,
  Compass,
  FileCode,
  ListOrdered,
  AlertTriangle,
  HeartHandshake,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  Code,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface IssueExplainerViewProps {
  customApiKey?: string;
  onOpenIssueModal?: (issue: Issue) => void;
}

export function IssueExplainerView({ customApiKey }: IssueExplainerViewProps) {
  const [selectedIssue, setSelectedIssue] = useState<Issue>(SAMPLE_ISSUES[0]);
  const [customTitle, setCustomTitle] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [customRepo, setCustomRepo] = useState('');
  const [explanation, setExplanation] = useState<IssueExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [inputMode, setInputMode] = useState<'preset' | 'custom'>('preset');

  const runExplain = async (issueToExplain: Partial<Issue>) => {
    setLoading(true);
    try {
      const res = await fetch('/api/explain-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issue: issueToExplain, customApiKey }),
      });
      const data = await res.json();
      setExplanation(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (iss: Issue) => {
    setSelectedIssue(iss);
    runExplain(iss);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    runExplain({
      id: Math.floor(Math.random() * 9000) + 1000,
      title: customTitle,
      body: customBody,
      repo: {
        name: customRepo || 'open-source-project',
        owner: 'maintainer',
        full_name: customRepo || 'maintainer/open-source-project',
        stars: 1500,
        language: 'TypeScript',
        open_issues: 20,
        description: 'Community repository',
      },
      labels: [{ name: 'good first issue', color: '7057ff' }],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              ELI5 Codebase Navigator
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
              Understand Any Open Source Codebase & Issue
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              No more feeling lost in thousands of files. Get a plain English translation, file touch map, and setup checklist.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => {
                setInputMode('preset');
                if (!explanation) handleSelectPreset(selectedIssue);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                inputMode === 'preset'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Curated Issues
            </button>
            <button
              onClick={() => setInputMode('custom')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                inputMode === 'custom'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Paste Custom Issue
            </button>
          </div>
        </div>

        {/* Preset Selector */}
        {inputMode === 'preset' ? (
          <div className="mt-4 pt-4 border-t border-slate-800/60">
            <span className="text-xs text-slate-400 font-medium block mb-2">Select an issue to explain:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_ISSUES.slice(0, 3).map((iss) => (
                <button
                  key={iss.id}
                  onClick={() => handleSelectPreset(iss)}
                  className={`p-3 rounded-xl border text-left transition-all text-xs flex flex-col justify-between ${
                    selectedIssue.id === iss.id
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-semibold text-slate-400 text-[10px] uppercase block mb-1">
                    {iss.repo.full_name}
                  </span>
                  <span className="font-medium line-clamp-2 text-white">{iss.title}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleCustomSubmit} className="mt-4 pt-4 border-t border-slate-800/60 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Repository Name (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. facebook/react or vercel/next.js"
                  value={customRepo}
                  onChange={(e) => setCustomRepo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Issue Title</label>
                <input
                  type="text"
                  placeholder="e.g. fix: crash when clicking toggle without theme"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Issue Description / Snippet</label>
              <textarea
                rows={3}
                placeholder="Paste the issue body or error message here..."
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !customTitle.trim()}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Explain This Issue
            </button>
          </form>
        )}
      </div>

      {/* Explainer Output Cards */}
      {loading ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <h3 className="text-base font-semibold text-white">Synthesizing Codebase Intelligence</h3>
          <p className="text-xs text-slate-400">Gemini LLM is decoding technical requirements into beginner-friendly milestones.</p>
        </div>
      ) : explanation ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Plain English & Step by Step */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plain English Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-base">In Plain English (ELI5)</h3>
              </div>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl">
                {explanation.plainEnglishSummary}
              </p>
              <div className="pt-2 text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-300">Why this matters:</strong> {explanation.whyItMatters}
              </div>
            </div>

            {/* Step-by-Step Milestones */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Step-by-Step Contribution Roadmap</h3>
              </div>
              <div className="space-y-3">
                {explanation.stepByStepGuide.map((step) => (
                  <div
                    key={step.step}
                    className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-start gap-3.5"
                  >
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {step.step}
                    </span>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-xs sm:text-sm font-semibold text-white">{step.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{step.detail}</p>
                      {step.command && (
                        <div className="mt-2 flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 font-mono text-xs text-emerald-400">
                          <span className="truncate pr-2">{step.command}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(step.command!);
                              setCopiedCmd(step.step);
                              setTimeout(() => setCopiedCmd(null), 2000);
                            }}
                            className="text-slate-500 hover:text-slate-300 shrink-0"
                          >
                            {copiedCmd === step.step ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Hint */}
            {explanation.codeHint && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-white text-base">Starter Code Blueprint</h3>
                  </div>
                  <span className="font-mono text-xs text-emerald-400 font-semibold">{explanation.codeHint.filename}</span>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                  <code>{explanation.codeHint.code}</code>
                </pre>
                <p className="text-xs text-slate-400">
                  <strong className="text-slate-300">Explanation:</strong> {explanation.codeHint.commentary}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Files & Pitfalls */}
          <div className="space-y-6">
            {/* Target Files Map */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Where in the Codebase to Look</h3>
              </div>
              <div className="space-y-2.5">
                {explanation.targetFiles.map((file, i) => (
                  <div key={i} className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-emerald-400 font-semibold truncate max-w-[200px]">
                        {file.path}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {file.riskLevel} Risk
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">{file.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Traps */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <h3 className="font-bold text-sm">Avoid These Beginner Traps</h3>
              </div>
              <ul className="space-y-2">
                {explanation.commonGotchas.map((g, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>

            {/* Maintainer Etiquette */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <HeartHandshake className="w-4 h-4" />
                <h3 className="font-bold text-sm">Maintainer Etiquette</h3>
              </div>
              <ul className="space-y-2">
                {explanation.maintainerTips.map((tip, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
