'use client';

import React, { useState } from 'react';
import {
  Flame,
  ShieldAlert,
  CheckCircle,
  HelpCircle,
  Award,
  BookOpen,
  GitCommit,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export function HacktoberfestGuide() {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
  });

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const isAllReady = completedCount === 5;

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-900 border border-orange-500/30 rounded-2xl p-5 sm:p-6 backdrop-blur-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 inline-flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-orange-400" />
              Official Hacktoberfest Playbook
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              The Beginner's Guide to Winning Hacktoberfest
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              How to make meaningful contributions, respect maintainers, and get all 4 PRs merged without rejection.
            </p>
          </div>

          <a
            href="https://hacktoberfest.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-400 text-slate-950 shadow-md shadow-orange-500/20 transition-all shrink-0"
          >
            <span>Visit Hacktoberfest</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: What Counts vs What Gets Rejected */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">What Counts as a Valid PR</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>
                <strong>Opted-in Repositories:</strong> The repo has the <code className="text-orange-300">hacktoberfest</code> topic or the PR gets labeled with <code className="text-orange-300">hacktoberfest-accepted</code>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>
                <strong>Substantive Changes:</strong> Fixing a legitimate bug, improving documentation with examples, adding tests, or implementing a requested feature.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>
                <strong>Approved or Merged:</strong> A maintainer approves the pull request or merges it into the default branch.
              </span>
            </li>
          </ul>

          <div className="pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <ShieldAlert className="w-4 h-4" />
              <h4 className="font-bold text-xs uppercase tracking-wider">What Gets You Disqualified (Spam)</h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>Submitting whitespace changes, indentation fixes, or automated bot changes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>Changing a single letter in a README without maintainer discussion.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>Opening PRs against your own dummy repositories to game the counter.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Card 2: Interactive Self-Checklist */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Beginner Readiness Checklist</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {completedCount}/5 Complete
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Tick these off before opening your pull request to guarantee maintainer appreciation:
            </p>

            <div className="space-y-2.5">
              {[
                { key: 'step1', label: 'I read the project CONTRIBUTING.md file' },
                { key: 'step2', label: 'I commented on the issue and got assigned before coding' },
                { key: 'step3', label: 'I created a dedicated feature branch (not main)' },
                { key: 'step4', label: 'I tested the change locally and automated tests pass' },
                { key: 'step5', label: 'I linked the issue using "Fixes #..." in the description' },
              ].map(({ key, label }) => (
                <label
                  key={key}
                  onClick={() => toggleCheck(key)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                    checklist[key]
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checklist[key]}
                    onChange={() => {}}
                    className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0"
                  />
                  <span className="font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-3">
            {isAllReady ? (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                100% Ready! Your PR is primed for swift maintainer approval!
              </div>
            ) : (
              <div className="text-[11px] text-slate-500 text-center">
                Check all 5 requirements above before pushing your pull request.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conventional Commits Reference Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <GitCommit className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-white text-base">Conventional Commit Cheatsheet</h3>
        </div>
        <p className="text-xs text-slate-400">
          Almost all major open source repositories enforce Conventional Commits. Use this guide to format your branch and commit messages:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 space-y-1">
            <span className="font-mono text-emerald-400 font-bold">feat:</span>
            <p className="text-slate-400 text-[11px]">A new feature or functionality added to the codebase.</p>
            <span className="font-mono text-[10px] text-slate-500 block">feat(ui): add dark mode button</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 space-y-1">
            <span className="font-mono text-blue-400 font-bold">fix:</span>
            <p className="text-slate-400 text-[11px]">A bug fix or patch resolving an existing issue.</p>
            <span className="font-mono text-[10px] text-slate-500 block">fix(a11y): correct aria attribute</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 space-y-1">
            <span className="font-mono text-amber-400 font-bold">docs:</span>
            <p className="text-slate-400 text-[11px]">Documentation-only changes (README, guides, comments).</p>
            <span className="font-mono text-[10px] text-slate-500 block">docs: fix broken links in setup</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 space-y-1">
            <span className="font-mono text-purple-400 font-bold">test:</span>
            <p className="text-slate-400 text-[11px]">Adding missing tests or correcting existing tests.</p>
            <span className="font-mono text-[10px] text-slate-500 block">test: add coverage for url parser</span>
          </div>
        </div>
      </div>
    </div>
  );
}
