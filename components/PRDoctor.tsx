'use client';

import React, { useState } from 'react';
import { PRReviewResult, PRReviewRequest } from '@/lib/types';
import { SAMPLE_PRS } from '@/lib/mock-data';
import {
  GitPullRequest,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  Loader2,
  FileDiff,
  Heart,
  RotateCcw,
} from 'lucide-react';

interface PRDoctorProps {
  customApiKey?: string;
}

export function PRDoctor({ customApiKey }: PRDoctorProps) {
  const [prDraft, setPrDraft] = useState<PRReviewRequest>(SAMPLE_PRS.messyBeginner);
  const [reviewResult, setReviewResult] = useState<PRReviewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedDescription, setCopiedDescription] = useState(false);
  const [activePreset, setActivePreset] = useState<'messy' | 'polished' | 'custom'>('messy');

  const handleSelectPreset = (preset: 'messy' | 'polished') => {
    setActivePreset(preset);
    const selected = preset === 'messy' ? SAMPLE_PRS.messyBeginner : SAMPLE_PRS.polishedPR;
    setPrDraft(selected);
    runAudit(selected);
  };

  const runAudit = async (requestData: PRReviewRequest) => {
    setLoading(true);
    try {
      const res = await fetch('/api/review-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...requestData, customApiKey }),
      });
      const data: PRReviewResult = await res.json();
      setReviewResult(data);
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActivePreset('custom');
    runAudit(prDraft);
  };

  const copyPolishedDescription = () => {
    if (!reviewResult?.polishedDescription) return;
    navigator.clipboard.writeText(reviewResult.polishedDescription);
    setCopiedDescription(true);
    setTimeout(() => setCopiedDescription(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 65) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-red-400 border-red-500/40 bg-red-500/10';
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Pre-Flight Pull Request Guard
              </span>
              <span className="text-xs text-slate-500 font-medium">Anti-Rejection Shield</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Pre-Flight PR Doctor
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Never get your first PR rejected again. Test your title, description, and git diff before submitting to GitHub.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => handleSelectPreset('messy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePreset === 'messy'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🔴 Test Common Mistakes PR
            </button>
            <button
              onClick={() => handleSelectPreset('polished')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePreset === 'polished'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🟢 Test Exemplary PR
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Form on Left, AI Audit Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: PR Draft Editor (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-emerald-400" />
                Pull Request Details
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Editable Form</span>
            </div>

            {/* PR Title */}
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">PR Title</label>
              <input
                type="text"
                value={prDraft.title}
                onChange={(e) => {
                  setPrDraft({ ...prDraft, title: e.target.value });
                  setActivePreset('custom');
                }}
                placeholder="e.g. fix(ui): resolve hydration mismatch in nextjs 15"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            {/* Linked Issue & Branch */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Issue # to Close</label>
                <input
                  type="text"
                  value={prDraft.issueNumber || ''}
                  onChange={(e) => {
                    setPrDraft({ ...prDraft, issueNumber: e.target.value });
                    setActivePreset('custom');
                  }}
                  placeholder="e.g. 1204"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Target Branch</label>
                <input
                  type="text"
                  value={prDraft.targetBranch || 'main'}
                  onChange={(e) => {
                    setPrDraft({ ...prDraft, targetBranch: e.target.value });
                    setActivePreset('custom');
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
                />
              </div>
            </div>

            {/* PR Description */}
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">PR Description</label>
              <textarea
                rows={4}
                value={prDraft.description}
                onChange={(e) => {
                  setPrDraft({ ...prDraft, description: e.target.value });
                  setActivePreset('custom');
                }}
                placeholder="Describe what you changed and why..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            {/* Git Diff */}
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1 flex items-center justify-between">
                <span>Git Diff / Changed Lines</span>
                <span className="text-[10px] text-slate-500">git diff output</span>
              </label>
              <textarea
                rows={5}
                value={prDraft.diff}
                onChange={(e) => {
                  setPrDraft({ ...prDraft, diff: e.target.value });
                  setActivePreset('custom');
                }}
                placeholder="diff --git a/... b/..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-emerald-400/90 placeholder-slate-600 focus:outline-none focus:border-emerald-500/60 leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Audit PR with AI Doctor
            </button>
          </form>
        </div>

        {/* Right Column: AI Review Results (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {loading ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <h3 className="text-base font-semibold text-white">Running Maintainer Simulation</h3>
              <p className="text-xs text-slate-400">
                Checking conventional commit tags, test coverage, diff cleanliness, and issue references...
              </p>
            </div>
          ) : reviewResult ? (
            <div className="space-y-4">
              {/* Score & Verdict Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getScoreColor(
                        reviewResult.score
                      )}`}
                    >
                      {reviewResult.verdict}
                    </span>
                    <span className="text-xs text-slate-400">
                      Tone: <span className="text-slate-200 font-medium">{reviewResult.maintainerToneRating}</span>
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                    {reviewResult.summary}
                  </p>
                </div>

                {/* Score Gauge */}
                <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                  <div
                    className={`w-18 h-18 rounded-2xl border-2 flex flex-col items-center justify-center ${getScoreColor(
                      reviewResult.score
                    )} shadow-lg`}
                  >
                    <span className="text-2xl font-black">{reviewResult.score}</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider -mt-1">Score</span>
                  </div>
                </div>
              </div>

              {/* Pre-flight Checklist */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Pre-Flight Submission Checklist
                </h4>

                <div className="space-y-2">
                  {reviewResult.checklist.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                        item.passed
                          ? 'bg-slate-950/60 border-slate-800/80'
                          : item.severity === 'critical'
                          ? 'bg-red-500/5 border-red-500/30'
                          : 'bg-amber-500/5 border-amber-500/30'
                      }`}
                    >
                      {item.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : item.severity === 'critical' ? (
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-semibold ${
                              item.passed ? 'text-slate-200' : item.severity === 'critical' ? 'text-red-300' : 'text-amber-300'
                            }`}
                          >
                            {item.title}
                          </span>
                          {!item.passed && (
                            <span className="text-[10px] uppercase font-bold text-red-400/80 px-1.5 py-0.2 rounded bg-red-500/10 border border-red-500/20">
                              {item.severity}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-normal">{item.feedback}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Diff Warnings if any */}
              {reviewResult.diffIssues && reviewResult.diffIssues.length > 0 && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <FileDiff className="w-4 h-4" />
                    Diff Code Smells Detected
                  </h4>
                  <div className="space-y-2">
                    {reviewResult.diffIssues.map((issue, idx) => (
                      <div
                        key={idx}
                        className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 text-xs space-y-1"
                      >
                        <p className="text-amber-300 font-medium">{issue.message}</p>
                        {issue.suggestion && (
                          <p className="text-slate-400 text-[11px]">
                            <strong className="text-slate-300">Fix:</strong> {issue.suggestion}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Polished PR Description Generator */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    AI-Polished PR Description (Ready to Copy)
                  </h4>
                  <button
                    onClick={copyPolishedDescription}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all"
                  >
                    {copiedDescription ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Description</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-48">
                  {reviewResult.polishedDescription}
                </pre>
              </div>

              {/* Encouragement Card */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                <Heart className="w-5 h-5 text-emerald-400 fill-emerald-400/20 shrink-0" />
                <p className="text-xs text-emerald-200 font-medium leading-relaxed">
                  {reviewResult.encouragement}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
              Click "Audit PR with AI Doctor" to analyze your draft.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
