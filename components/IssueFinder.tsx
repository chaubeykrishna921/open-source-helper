'use client';

import React, { useState } from 'react';
import { Issue } from '@/lib/types';
import {
  Search,
  Filter,
  Sparkles,
  ExternalLink,
  Star,
  Clock,
  Compass,
  CheckCircle,
  Flame,
  MessageSquare,
  BookOpen,
  Code2,
} from 'lucide-react';

interface IssueFinderProps {
  issues: Issue[];
  loading: boolean;
  onSelectIssueToExplain: (issue: Issue) => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  hacktoberfestOnly: boolean;
  onToggleHacktoberfest: (enabled: boolean) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  searchKeyword: string;
  onSearchKeywordChange: (kw: string) => void;
}

export function IssueFinder({
  issues,
  loading,
  onSelectIssueToExplain,
  selectedLanguage,
  onLanguageChange,
  hacktoberfestOnly,
  onToggleHacktoberfest,
  selectedCategory,
  onCategoryChange,
  searchKeyword,
  onSearchKeywordChange,
}: IssueFinderProps) {
  const categories = ['All', 'Documentation', 'Bug Fix', 'Feature', 'Testing'];
  const languages = ['All', 'TypeScript', 'JavaScript', 'Python', 'Markdown'];

  const getDifficultyBadge = (difficulty: Issue['difficulty']) => {
    switch (difficulty) {
      case 'Trivial':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Easy':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Challenging':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls / Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => onSearchKeywordChange(e.target.value)}
              placeholder="Search issues by title, keyword or repository..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 pl-9 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>

          {/* Hacktoberfest Toggle */}
          <button
            type="button"
            onClick={() => onToggleHacktoberfest(!hacktoberfestOnly)}
            className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
              hacktoberfestOnly
                ? 'bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-sm shadow-orange-500/10'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Flame className={`w-4 h-4 ${hacktoberfestOnly ? 'text-orange-400 fill-orange-400' : 'text-slate-500'}`} />
            <span>Hacktoberfest Only</span>
            {hacktoberfestOnly && (
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-800/60">
          {/* Language selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-slate-500" /> Language:
            </span>
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  selectedLanguage.toLowerCase() === lang.toLowerCase()
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-medium'
                    : 'bg-slate-950/40 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Category selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-500" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-medium'
                    : 'bg-slate-950/40 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div>
          Showing <span className="font-semibold text-white">{issues.length}</span> curated beginner-friendly issues
        </div>
        <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
          <CheckCircle className="w-3.5 h-3.5" /> Maintainer-friendly repos verified
        </div>
      </div>

      {/* Issues Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 h-48 animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-4 bg-slate-800 rounded w-1/3" />
                <div className="h-5 bg-slate-800 rounded w-4/5" />
                <div className="h-3 bg-slate-800 rounded w-2/3" />
              </div>
              <div className="h-8 bg-slate-800 rounded w-full" />
            </div>
          ))}
        </div>
      ) : issues.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No matching issues found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try resetting your language or category filters, or disable the Hacktoberfest-only switch to see more results.
          </p>
          <button
            onClick={() => {
              onLanguageChange('All');
              onCategoryChange('All');
              onToggleHacktoberfest(false);
              onSearchKeywordChange('');
            }}
            className="mt-4 px-4 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between shadow-lg shadow-black/20"
            >
              <div>
                {/* Repo info & Match score */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300 group-hover:text-emerald-400 transition-colors">
                      {issue.repo.full_name}
                    </span>
                    <span className="flex items-center gap-0.5 text-slate-500">
                      <Star className="w-3 h-3 text-amber-400/80 fill-amber-400/20" />
                      {issue.repo.stars > 1000 ? `${(issue.repo.stars / 1000).toFixed(1)}k` : issue.repo.stars}
                    </span>
                  </div>

                  {/* Beginner Match Badge */}
                  <div className="flex items-center gap-1.5">
                    {issue.isHacktoberfest && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30">
                        <Flame className="w-2.5 h-2.5 fill-orange-400" />
                        Hacktoberfest
                      </span>
                    )}
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm">
                      {issue.matchScore}% Match
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-white text-sm sm:text-base leading-snug line-clamp-2 mb-2">
                  <a
                    href={issue.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-emerald-300 transition-colors"
                  >
                    {issue.title}
                  </a>
                </h3>

                {/* Body snippet */}
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                  {issue.body.replace(/[#*`]/g, '')}
                </p>

                {/* Tags & Metadata */}
                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getDifficultyBadge(issue.difficulty)}`}>
                    {issue.difficulty}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 flex items-center gap-1 border border-slate-700/60">
                    <Clock className="w-2.5 h-2.5 text-slate-400" />
                    {issue.estimatedTime}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400 border border-slate-700/40">
                    {issue.category}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400 border border-slate-700/40">
                    {issue.repo.language}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => onSelectIssueToExplain(issue)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all shadow-sm group/btn"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 group-hover/btn:scale-110 transition-transform" />
                  Explain with AI (ELI5)
                </button>

                <a
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition-colors"
                  title="View on GitHub"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
