'use client';

import React from 'react';
import { Sparkles, GitPullRequest, Search, Compass, BookOpen, Puzzle, Settings } from 'lucide-react';
import { GithubIcon } from '@/components/Icons';

interface NavbarProps {
  activeTab: 'issues' | 'explainer' | 'pr-doctor' | 'hacktoberfest' | 'extension';
  setActiveTab: (tab: 'issues' | 'explainer' | 'pr-doctor' | 'hacktoberfest' | 'extension') => void;
  onOpenSettings: () => void;
  hasCustomKey: boolean;
}

export function Navbar({ activeTab, setActiveTab, onOpenSettings, hasCustomKey }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-[2px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">GitStart AI</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                Hacktoberfest
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Open-Source Contribution Helper for Beginners</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('issues')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'issues'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Issue Matcher
          </button>

          <button
            onClick={() => setActiveTab('explainer')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'explainer'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            ELI5 Explainer
          </button>

          <button
            onClick={() => setActiveTab('pr-doctor')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'pr-doctor'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <GitPullRequest className="w-3.5 h-3.5" />
            PR Doctor
          </button>

          <button
            onClick={() => setActiveTab('hacktoberfest')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'hacktoberfest'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Hacktoberfest Guide
          </button>

          <button
            onClick={() => setActiveTab('extension')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'extension'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Puzzle className="w-3.5 h-3.5" />
            Extension
          </button>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title="Configure Gemini & GitHub API credentials"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Settings</span>
            {hasCustomKey && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Custom Gemini API Key Active" />
            )}
          </button>

          <a
            href="https://github.com/topics/hacktoberfest"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="GitHub Hacktoberfest Topic"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-800/80 px-2 py-1.5 bg-slate-950">
        <button
          onClick={() => setActiveTab('issues')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium ${
            activeTab === 'issues' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Search className="w-4 h-4" />
          Issues
        </button>
        <button
          onClick={() => setActiveTab('explainer')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium ${
            activeTab === 'explainer' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Compass className="w-4 h-4" />
          ELI5
        </button>
        <button
          onClick={() => setActiveTab('pr-doctor')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium ${
            activeTab === 'pr-doctor' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <GitPullRequest className="w-4 h-4" />
          PR Doctor
        </button>
        <button
          onClick={() => setActiveTab('hacktoberfest')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium ${
            activeTab === 'hacktoberfest' ? 'text-orange-400' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Guide
        </button>
        <button
          onClick={() => setActiveTab('extension')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium ${
            activeTab === 'extension' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <Puzzle className="w-4 h-4" />
          Extension
        </button>
      </div>
    </header>
  );
}
