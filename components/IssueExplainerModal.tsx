'use client';

import React, { useState, useEffect } from 'react';
import { Issue, IssueExplanation } from '@/lib/types';
import {
  X,
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
} from 'lucide-react';

interface IssueExplainerModalProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
  customApiKey?: string;
  aiProvider?: 'auto' | 'gemini' | 'ollama';
  ollamaModel?: string;
  ollamaEndpoint?: string;
}

export function IssueExplainerModal({
  issue,
  isOpen,
  onClose,
  customApiKey,
  aiProvider = 'auto',
  ollamaModel,
  ollamaEndpoint,
}: IssueExplainerModalProps) {
  const [activeSubTab, setActiveSubTab] = useState<'summary' | 'files' | 'steps' | 'code' | 'gotchas'>('summary');
  const [explanation, setExplanation] = useState<IssueExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (isOpen && issue) {
      loadExplanation(issue);
    }
  }, [isOpen, issue]);

  const loadExplanation = async (targetIssue: Issue) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/explain-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issue: targetIssue,
          customApiKey,
          provider: aiProvider,
          ollamaModel,
          ollamaEndpoint,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate AI issue explanation');
      }

      const data: IssueExplanation = await res.json();
      setExplanation(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error generating explanation');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index?: number) => {
    navigator.clipboard.writeText(text);
    if (typeof index === 'number') {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (!isOpen || !issue) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ELI5 Codebase Navigator
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {issue.repo.full_name} • #{issue.number}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
              {issue.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-1 px-5 py-2.5 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveSubTab('summary')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeSubTab === 'summary'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            ELI5 Summary
          </button>

          <button
            onClick={() => setActiveSubTab('files')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeSubTab === 'files'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            Files to Touch
          </button>

          <button
            onClick={() => setActiveSubTab('steps')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeSubTab === 'steps'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            Step-by-Step Guide
          </button>

          <button
            onClick={() => setActiveSubTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeSubTab === 'code'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Starter Code Hint
          </button>

          <button
            onClick={() => setActiveSubTab('gotchas')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeSubTab === 'gotchas'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Gotchas & Etiquette
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-white">Analyzing repository & simplifying issue...</p>
              <p className="text-xs text-slate-400">Gemini LLM is extracting key files and breaking down technical jargon.</p>
            </div>
          ) : errorMsg ? (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
              {errorMsg}
            </div>
          ) : explanation ? (
            <div>
              {/* TAB 1: SUMMARY */}
              {activeSubTab === 'summary' && (
                <div className="space-y-6">
                  {/* Plain English Banner */}
                  <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-xl p-5">
                    <h3 className="text-xs uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4" /> Plain English Explanation (No Jargon)
                    </h3>
                    <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium">
                      {explanation.plainEnglishSummary}
                    </p>
                  </div>

                  {/* Why it matters */}
                  <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Why this matters
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {explanation.whyItMatters}
                    </p>
                  </div>

                  {/* Prerequisites */}
                  <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Prerequisites for this contribution
                    </h4>
                    <ul className="space-y-1.5">
                      {explanation.prerequisites.map((p, i) => (
                        <li key={i} className="text-xs text-slate-400 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quick Starter Terminal */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs">
                    <div className="flex items-center justify-between text-slate-400 pb-2 mb-2 border-b border-slate-800 text-[11px]">
                      <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Quick Start Terminal Commands
                      </span>
                    </div>
                    <div className="space-y-2">
                      {explanation.gitCommandsToStart.map((cmd, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800/80 group">
                          <span className="text-emerald-400">{cmd}</span>
                          <button
                            onClick={() => copyToClipboard(cmd, idx)}
                            className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
                            title="Copy command"
                          >
                            {copiedIndex === idx ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: FILES TO TOUCH */}
              {activeSubTab === 'files' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">
                    Open source codebases can be intimidating with hundreds of folders. Here are the exact files you need to look at:
                  </p>

                  <div className="space-y-3">
                    {explanation.targetFiles.map((file, i) => (
                      <div
                        key={i}
                        className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              {file.path}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                file.riskLevel === 'Low'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}
                            >
                              {file.riskLevel} Risk
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {file.explanation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: STEP BY STEP GUIDE */}
              {activeSubTab === 'steps' && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {explanation.stepByStepGuide.map((step) => (
                      <div
                        key={step.step}
                        className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start gap-3.5"
                      >
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {step.step}
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">{step.detail}</p>
                          {step.command && (
                            <div className="mt-2 flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 font-mono text-xs text-emerald-400">
                              <span>{step.command}</span>
                              <button
                                onClick={() => copyToClipboard(step.command!)}
                                className="text-slate-500 hover:text-slate-300"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: CODE HINT */}
              {activeSubTab === 'code' && (
                <div className="space-y-4">
                  {explanation.codeHint ? (
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span className="font-mono text-emerald-400 font-semibold">{explanation.codeHint.filename}</span>
                        <button
                          onClick={() => copyToClipboard(explanation.codeHint!.code)}
                          className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCode ? 'Copied' : 'Copy Snippet'}</span>
                        </button>
                      </div>

                      <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                        <code>{explanation.codeHint.code}</code>
                      </pre>

                      <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
                        <strong className="text-slate-200">Tip:</strong> {explanation.codeHint.commentary}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No specific code snippet available for this issue.</p>
                  )}
                </div>
              )}

              {/* TAB 5: GOTCHAS & ETIQUETTE */}
              {activeSubTab === 'gotchas' && (
                <div className="space-y-6">
                  {/* Common Gotchas */}
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                      <AlertTriangle className="w-4 h-4" /> Common Beginner Pitfalls (Avoid These!)
                    </h4>
                    <ul className="space-y-2">
                      {explanation.commonGotchas.map((gotcha, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          {gotcha}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Maintainer Tips */}
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                      <HeartHandshake className="w-4 h-4" /> Maintainer Etiquette (How to get approved fast)
                    </h4>
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
              )}
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <a
            href={issue.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition-colors font-medium"
          >
            <span>Open Issue #{issue.number} on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
