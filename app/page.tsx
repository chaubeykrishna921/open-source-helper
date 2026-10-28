'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile, Issue } from '@/lib/types';
import { DEMO_PROFILES, SAMPLE_ISSUES } from '@/lib/mock-data';
import { Navbar } from '@/components/Navbar';
import { ProfileScanner } from '@/components/ProfileScanner';
import { IssueFinder } from '@/components/IssueFinder';
import { IssueExplainerModal } from '@/components/IssueExplainerModal';
import { IssueExplainerView } from '@/components/IssueExplainerView';
import { PRDoctor } from '@/components/PRDoctor';
import { HacktoberfestGuide } from '@/components/HacktoberfestGuide';
import { ExtensionDownloadModal } from '@/components/ExtensionDownloadModal';
import { SettingsModal } from '@/components/SettingsModal';
import { Sparkles, Flame, Shield, ArrowRight, Heart } from 'lucide-react';
import { GithubIcon } from '@/components/Icons';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'issues' | 'explainer' | 'pr-doctor' | 'hacktoberfest' | 'extension'>('issues');
  const [profile, setProfile] = useState<UserProfile>(DEMO_PROFILES['sarah-frontend']);
  const [issues, setIssues] = useState<Issue[]>(SAMPLE_ISSUES);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('TypeScript');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [hacktoberfestOnly, setHacktoberfestOnly] = useState<boolean>(true);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Modals
  const [explainingIssue, setExplainingIssue] = useState<Issue | null>(null);
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // API Credentials stored in state / localStorage
  const [geminiKey, setGeminiKey] = useState<string>('');
  const [githubToken, setGithubToken] = useState<string>('');

  useEffect(() => {
    // Load stored keys if any
    const storedGemini = localStorage.getItem('gitstart_gemini_key') || '';
    const storedGithub = localStorage.getItem('gitstart_github_token') || '';
    setGeminiKey(storedGemini);
    setGithubToken(storedGithub);
  }, []);

  const handleSaveSettings = (newGeminiKey: string, newGithubToken: string) => {
    setGeminiKey(newGeminiKey);
    setGithubToken(newGithubToken);
    localStorage.setItem('gitstart_gemini_key', newGeminiKey);
    localStorage.setItem('gitstart_github_token', newGithubToken);
  };

  // Fetch / filter issues whenever controls change
  useEffect(() => {
    let ignore = false;
    const fetchIssues = async () => {
      setLoadingIssues(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedLanguage && selectedLanguage !== 'All') {
          queryParams.set('language', selectedLanguage);
        }
        if (selectedCategory && selectedCategory !== 'All') {
          queryParams.set('category', selectedCategory);
        }
        if (hacktoberfestOnly) {
          queryParams.set('hacktoberfestOnly', 'true');
        }
        if (searchKeyword.trim()) {
          queryParams.set('keyword', searchKeyword.trim());
        }

        const headers: Record<string, string> = {};
        if (githubToken) {
          headers['x-github-token'] = githubToken;
        }

        const res = await fetch(`/api/issues?${queryParams.toString()}`, { headers });
        if (!res.ok) throw new Error('Failed to query issues');
        const data = await res.json();
        if (!ignore && data.issues) {
          setIssues(data.issues);
        }
      } catch (err) {
        console.error('Error fetching issues:', err);
      } finally {
        if (!ignore) setLoadingIssues(false);
      }
    };

    fetchIssues();
    return () => {
      ignore = true;
    };
  }, [selectedLanguage, selectedCategory, hacktoberfestOnly, searchKeyword, githubToken]);

  const handleProfileChange = (newProfile: UserProfile) => {
    setProfile(newProfile);
    if (newProfile.primaryLanguage) {
      setSelectedLanguage(newProfile.primaryLanguage);
    }
  };

  const handleSelectIssueToExplain = (issue: Issue) => {
    setExplainingIssue(issue);
    setIsExplainerOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasCustomKey={Boolean(geminiKey)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* TAB 1: ISSUES FINDER & PROFILE SCANNER */}
        {activeTab === 'issues' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Quick Hero Banner */}
            <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 p-6 sm:p-8 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  <Flame className="w-3.5 h-3.5 fill-emerald-400" />
                  Hacktoberfest 2026 Ready
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Your AI Launchpad for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Open-Source Contributions</span>
                </h1>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  Stop feeling overwhelmed by massive repositories. Match beginner-friendly issues to your personal skillset, understand codebases in plain English, and pre-screen your PRs before submission.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('pr-doctor')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <Shield className="w-4 h-4" />
                    Try Pre-Flight PR Doctor
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('hacktoberfest')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold text-xs sm:text-sm transition-all"
                  >
                    Hacktoberfest Rules & Playbook
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Scanner */}
            <ProfileScanner
              currentProfile={profile}
              onProfileChange={handleProfileChange}
              onLanguageSelect={(lang) => setSelectedLanguage(lang)}
              selectedLanguage={selectedLanguage}
            />

            {/* Issue Finder Grid */}
            <IssueFinder
              issues={issues}
              loading={loadingIssues}
              onSelectIssueToExplain={handleSelectIssueToExplain}
              selectedLanguage={selectedLanguage}
              onLanguageChange={(lang) => setSelectedLanguage(lang)}
              hacktoberfestOnly={hacktoberfestOnly}
              onToggleHacktoberfest={(enabled) => setHacktoberfestOnly(enabled)}
              selectedCategory={selectedCategory}
              onCategoryChange={(cat) => setSelectedCategory(cat)}
              searchKeyword={searchKeyword}
              onSearchKeywordChange={(kw) => setSearchKeyword(kw)}
            />
          </div>
        )}

        {/* TAB 2: ELI5 CODEBASE EXPLAINER */}
        {activeTab === 'explainer' && (
          <div className="animate-in fade-in duration-150">
            <IssueExplainerView customApiKey={geminiKey} />
          </div>
        )}

        {/* TAB 3: PRE-FLIGHT PR DOCTOR */}
        {activeTab === 'pr-doctor' && (
          <div className="animate-in fade-in duration-150">
            <PRDoctor customApiKey={geminiKey} />
          </div>
        )}

        {/* TAB 4: HACKTOBERFEST GUIDE */}
        {activeTab === 'hacktoberfest' && (
          <div className="animate-in fade-in duration-150">
            <HacktoberfestGuide />
          </div>
        )}

        {/* TAB 5: CHROME EXTENSION */}
        {activeTab === 'extension' && (
          <div className="animate-in fade-in duration-150">
            <ExtensionDownloadModal />
          </div>
        )}
      </main>

      {/* Explainer Modal (triggered from issue card click) */}
      <IssueExplainerModal
        issue={explainingIssue}
        isOpen={isExplainerOpen}
        onClose={() => setIsExplainerOpen(false)}
        customApiKey={geminiKey}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        geminiKey={geminiKey}
        githubToken={githubToken}
        onSave={handleSaveSettings}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">GitStart AI</span>
            <span>— Empowering the next generation of open-source contributors.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Powered by <span className="text-emerald-400 font-medium">Gemini 3.8 Flash</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-800" />
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 flex items-center gap-1 transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub API</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
