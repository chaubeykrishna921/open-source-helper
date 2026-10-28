export interface UserProfile {
  username: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  languages: { name: string; percentage: number; color: string }[];
  primaryLanguage: string;
  experienceLevel: 'First-Timer' | 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
  recommendationKeywords: string[];
  totalStarsEarned: number;
  recentActivityScore: number; // 0 - 100
}

export interface Issue {
  id: number;
  title: string;
  html_url: string;
  number: number;
  repo: {
    name: string;
    owner: string;
    full_name: string;
    stars: number;
    language: string;
    open_issues: number;
    description: string;
    license?: string;
    healthScore?: number; // 0 - 100
  };
  labels: { name: string; color: string; description?: string }[];
  created_at: string;
  updated_at: string;
  body: string;
  comments: number;
  difficulty: 'Trivial' | 'Easy' | 'Medium' | 'Challenging';
  estimatedTime: string; // e.g. "30 mins", "1-2 hours"
  matchScore: number; // 0 - 100 match with user profile
  isHacktoberfest: boolean;
  category: 'Documentation' | 'Bug Fix' | 'Feature' | 'Testing' | 'Refactor';
}

export interface IssueExplanation {
  issueId: number;
  issueTitle: string;
  repoFullName: string;
  plainEnglishSummary: string;
  whyItMatters: string;
  targetFiles: { path: string; explanation: string; riskLevel: 'Low' | 'Medium' | 'High' }[];
  prerequisites: string[];
  stepByStepGuide: { step: number; title: string; detail: string; command?: string }[];
  reproductionSteps: string[];
  codeHint?: {
    filename: string;
    language: string;
    code: string;
    commentary: string;
  };
  commonGotchas: string[];
  maintainerTips: string[];
  gitCommandsToStart: string[];
}

export interface PRReviewRequest {
  title: string;
  description: string;
  diff: string;
  issueNumber?: string;
  targetBranch?: string;
  repoContext?: string;
}

export interface PRCheckItem {
  id: string;
  title: string;
  passed: boolean;
  severity: 'critical' | 'warning' | 'info';
  feedback: string;
}

export interface PRReviewResult {
  score: number; // 0 - 100
  verdict: 'Ready to Submit' | 'Needs Improvements' | 'Critical Issues Detected';
  summary: string;
  checklist: PRCheckItem[];
  diffIssues: {
    file?: string;
    line?: number;
    severity: 'error' | 'warning' | 'suggestion';
    message: string;
    suggestion?: string;
  }[];
  maintainerToneRating: 'Friendly & Professional' | 'Neutral' | 'Vague / Demanding';
  polishedDescription: string;
  encouragement: string;
}
