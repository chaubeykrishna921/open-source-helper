'use client';

import React, { useState } from 'react';
import {
  Puzzle,
  Download,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Folder,
} from 'lucide-react';
import { ChromeIcon } from '@/components/Icons';

export function ExtensionDownloadModal() {
  const [copiedPath, setCopiedPath] = useState(false);
  const extensionPath = 'C:\\Users\\ravi\\.gemini\\antigravity\\scratch\\gitstart-ai\\extension';

  const copyPath = () => {
    navigator.clipboard.writeText(extensionPath);
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 rounded-2xl p-5 sm:p-6 backdrop-blur-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 inline-flex items-center gap-1">
              <Puzzle className="w-3.5 h-3.5" />
              Manifest V3 Chrome Extension
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              GitStart AI for GitHub (Browser Companion)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Bring the ELI5 Explainer and PR Doctor directly onto GitHub.com pages without leaving your pull request!
            </p>
          </div>

          <button
            onClick={copyPath}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 transition-all shrink-0"
          >
            {copiedPath ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedPath ? 'Path Copied!' : 'Copy Extension Folder Path'}</span>
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* On Issue Pages */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">On GitHub Issue Pages</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            When you visit any issue on GitHub (e.g. <code className="text-emerald-300">github.com/:owner/:repo/issues/:id</code>), GitStart AI injects a floating button:
          </p>
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
              ✨ GitStart ELI5
            </span>
            <span>Translates the issue into simple terms and identifies files to edit.</span>
          </div>
          <ul className="text-xs text-slate-400 space-y-1.5 pt-1">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Instant Hacktoberfest eligibility detection
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Extracts reproduction steps without leaving GitHub
            </li>
          </ul>
        </div>

        {/* On PR Pages */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">On Pull Request Pages</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            When opening or creating a pull request (e.g. <code className="text-cyan-300">github.com/:owner/:repo/compare/...</code>), GitStart AI checks your draft:
          </p>
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold">
              🛡️ PR Doctor Check
            </span>
            <span>Audits your PR description, conventional commit title, and diff before submitting.</span>
          </div>
          <ul className="text-xs text-slate-400 space-y-1.5 pt-1">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Warns if you forgot to link the issue (e.g. "Fixes #...")
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Flags accidental debug statements like console.log
            </li>
          </ul>
        </div>
      </div>

      {/* How to Install / Load in Chrome */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <ChromeIcon className="w-5 h-5 text-amber-400" />
          <span>How to Load Unpacked in Chrome (30 seconds)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h4 className="font-semibold text-white">Open Extensions</h4>
            <p className="text-slate-400 text-[11px]">
              Navigate to <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">chrome://extensions</code> in your Chrome browser address bar.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center text-xs">
              2
            </div>
            <h4 className="font-semibold text-white">Enable Developer Mode</h4>
            <p className="text-slate-400 text-[11px]">
              Toggle the <strong>Developer mode</strong> switch located in the top-right corner of the page.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h4 className="font-semibold text-white">Click "Load Unpacked"</h4>
            <p className="text-slate-400 text-[11px]">
              Click the <strong>Load unpacked</strong> button on the top-left toolbar.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center text-xs">
              4
            </div>
            <h4 className="font-semibold text-white">Select Extension Folder</h4>
            <p className="text-slate-400 text-[11px]">
              Select the directory:
            </p>
            <div className="p-1.5 bg-slate-900 rounded font-mono text-[10px] text-cyan-300 truncate">
              {extensionPath}
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-mono text-[11px] text-slate-300">{extensionPath}</span>
          </div>
          <button
            onClick={copyPath}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs font-semibold"
          >
            {copiedPath ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedPath ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
