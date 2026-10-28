'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/lib/types';
import { DEMO_PROFILES } from '@/lib/mock-data';
import { Search, Sparkles, Star, GitFork, Award, CheckCircle2, User, Loader2 } from 'lucide-react';

interface ProfileScannerProps {
  currentProfile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
  onLanguageSelect?: (language: string) => void;
  selectedLanguage?: string;
}

export function ProfileScanner({
  currentProfile,
  onProfileChange,
  onLanguageSelect,
  selectedLanguage,
}: ProfileScannerProps) {
  const [usernameInput, setUsernameInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput.trim() }),
      });

      if (!res.ok) {
        throw new Error('Could not find GitHub user or rate limit reached');
      }

      const data: UserProfile = await res.json();
      onProfileChange(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to scan profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = (presetKey: string) => {
    if (DEMO_PROFILES[presetKey]) {
      onProfileChange(DEMO_PROFILES[presetKey]);
      setUsernameInput('');
      setErrorMsg(null);
    }
  };

  const getTierColor = (tier: UserProfile['experienceLevel']) => {
    switch (tier) {
      case 'First-Timer':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Beginner':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Intermediate':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Advanced':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
      {/* Background glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top search & demo selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" />
            GitHub Profile Skill Scanner
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Analyze your GitHub repos & languages to get personalized "Good First Issue" recommendations.
          </p>
        </div>

        {/* Input form */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Enter any GitHub username..."
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2 pl-9 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>
          <button
            type="submit"
            disabled={loading || !usernameInput.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-md shadow-emerald-500/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Scan
          </button>
        </form>
      </div>

      {/* Preset demo pills */}
      <div className="flex flex-wrap items-center gap-2 pt-3 pb-4">
        <span className="text-xs text-slate-400 font-medium mr-1">Quick Demo Personas:</span>
        <button
          type="button"
          onClick={() => handleSelectDemo('sarah-frontend')}
          className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
            currentProfile.username === 'sarah-frontend'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
              : 'bg-slate-800/40 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Sarah (Frontend • React/TS)
        </button>
        <button
          type="button"
          onClick={() => handleSelectDemo('alex-python')}
          className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
            currentProfile.username === 'alex-python'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
              : 'bg-slate-800/40 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Alex (Python • Backend/CLI)
        </button>
        <button
          type="button"
          onClick={() => handleSelectDemo('maya-firsttimer')}
          className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
            currentProfile.username === 'maya-firsttimer'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
              : 'bg-slate-800/40 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Maya (First-Timer • Docs/Markdown)
        </button>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
          {errorMsg} (Tip: Click one of the quick personas above to test right away!)
        </div>
      )}

      {/* Contributor Profile Snapshot Card */}
      <div className="mt-2 bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Avatar & Info */}
          <div className="flex items-center gap-3.5">
            <img
              src={currentProfile.avatar_url}
              alt={currentProfile.name}
              className="w-13 h-13 rounded-full border-2 border-emerald-500/30 object-cover shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base tracking-tight">{currentProfile.name}</h3>
                <span className="text-xs text-slate-500">@{currentProfile.username}</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getTierColor(currentProfile.experienceLevel)}`}>
                  {currentProfile.experienceLevel}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{currentProfile.bio}</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-xs text-slate-400 self-stretch sm:self-auto justify-around sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800/60">
            <div className="text-center sm:text-right">
              <span className="text-slate-500 text-[10px] uppercase font-semibold block">Repos</span>
              <span className="text-white font-bold text-sm">{currentProfile.public_repos}</span>
            </div>
            <div className="w-[1px] h-6 bg-slate-800" />
            <div className="text-center sm:text-right">
              <span className="text-slate-500 text-[10px] uppercase font-semibold block">Stars</span>
              <span className="text-white font-bold text-sm flex items-center justify-center sm:justify-end gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                {currentProfile.totalStarsEarned}
              </span>
            </div>
            <div className="w-[1px] h-6 bg-slate-800" />
            <div className="text-center sm:text-right">
              <span className="text-slate-500 text-[10px] uppercase font-semibold block">Readiness</span>
              <span className="text-emerald-400 font-bold text-sm">{currentProfile.recentActivityScore}%</span>
            </div>
          </div>
        </div>

        {/* Skill Language Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800/60">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-medium">Top Detected Languages & Frameworks:</span>
            <span className="text-slate-500 text-[11px]">Click a language to filter issues</span>
          </div>

          {/* Stacked Bar */}
          <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-800 mb-3">
            {currentProfile.languages.map((lang) => (
              <div
                key={lang.name}
                style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                className="h-full transition-all"
                title={`${lang.name}: ${lang.percentage}%`}
              />
            ))}
          </div>

          {/* Language Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {currentProfile.languages.map((lang) => {
              const isSelected = selectedLanguage?.toLowerCase() === lang.name.toLowerCase();
              return (
                <button
                  key={lang.name}
                  type="button"
                  onClick={() => onLanguageSelect && onLanguageSelect(isSelected ? 'All' : lang.name)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
                  {lang.name}
                  <span className="text-slate-500 text-[10px]">{lang.percentage}%</span>
                </button>
              );
            })}
            {selectedLanguage && selectedLanguage !== 'All' && (
              <button
                type="button"
                onClick={() => onLanguageSelect && onLanguageSelect('All')}
                className="text-[11px] text-slate-500 hover:text-slate-300 underline ml-1"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
