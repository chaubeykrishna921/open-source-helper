import { UserProfile, Issue, IssueExplanation, PRReviewResult } from './types';

export const DEMO_PROFILES: Record<string, UserProfile> = {
  'sarah-frontend': {
    username: 'sarah-frontend',
    name: 'Sarah Chen',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Self-taught web developer learning React, Next.js and Tailwind. Ready for my first open source contribution! 🚀',
    public_repos: 12,
    followers: 24,
    languages: [
      { name: 'TypeScript', percentage: 48, color: '#3178c6' },
      { name: 'JavaScript', percentage: 28, color: '#f7df1e' },
      { name: 'HTML/CSS', percentage: 16, color: '#e34f26' },
      { name: 'Tailwind', percentage: 8, color: '#38bdf8' },
    ],
    primaryLanguage: 'TypeScript',
    experienceLevel: 'Beginner',
    topics: ['react', 'nextjs', 'tailwind', 'ui-components', 'frontend', 'accessibility'],
    recommendationKeywords: ['good first issue', 'documentation', 'component', 'ui', 'css', 'a11y'],
    totalStarsEarned: 18,
    recentActivityScore: 78,
  },
  'alex-python': {
    username: 'alex-python',
    name: 'Alex Rivera',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    bio: 'CS student exploring Python backend, APIs, and data utilities. Hacktoberfest participant.',
    public_repos: 8,
    followers: 15,
    languages: [
      { name: 'Python', percentage: 65, color: '#3572A5' },
      { name: 'SQL', percentage: 20, color: '#e38c00' },
      { name: 'Shell', percentage: 15, color: '#89e051' },
    ],
    primaryLanguage: 'Python',
    experienceLevel: 'Beginner',
    topics: ['python', 'cli', 'fastapi', 'automation', 'data-structures'],
    recommendationKeywords: ['good first issue', 'bug', 'docs', 'type-hints', 'test', 'cli'],
    totalStarsEarned: 9,
    recentActivityScore: 82,
  },
  'maya-firsttimer': {
    username: 'maya-firsttimer',
    name: 'Maya Patel',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    bio: 'First week in code! Want to learn Git workflows, documentation improvements, and Hacktoberfest etiquette.',
    public_repos: 4,
    followers: 6,
    languages: [
      { name: 'Markdown', percentage: 55, color: '#083fa1' },
      { name: 'HTML', percentage: 30, color: '#e34f26' },
      { name: 'JavaScript', percentage: 15, color: '#f7df1e' },
    ],
    primaryLanguage: 'Markdown',
    experienceLevel: 'First-Timer',
    topics: ['documentation', 'markdown', 'tutorial', 'learning', 'community'],
    recommendationKeywords: ['docs', 'good first issue', 'typo', 'readme', 'translation'],
    totalStarsEarned: 3,
    recentActivityScore: 65,
  },
};

export const SAMPLE_ISSUES: Issue[] = [
  {
    id: 101,
    title: 'docs: Clarify dark mode toggle initialization in Next.js 15 app router',
    number: 4821,
    html_url: 'https://github.com/shadcn-ui/ui/issues/4821',
    repo: {
      name: 'ui',
      owner: 'shadcn-ui',
      full_name: 'shadcn-ui/ui',
      stars: 74200,
      language: 'TypeScript',
      open_issues: 142,
      description: 'Beautifully designed components that you can copy and paste into your apps.',
      license: 'MIT',
      healthScore: 94,
    },
    labels: [
      { name: 'good first issue', color: '7057ff', description: 'Good for newcomers' },
      { name: 'documentation', color: '0075ca', description: 'Improvements to documentation' },
      { name: 'hacktoberfest', color: 'ff6b4a', description: 'Participating in Hacktoberfest' },
    ],
    created_at: '2026-10-20T14:32:00Z',
    updated_at: '2026-10-26T09:12:00Z',
    body: `### Description
In the current documentation under "Dark Mode -> Next.js", step 3 references the legacy theme-provider snippet which causes hydration mismatch warnings when using the new React 19 compiler flag.

### Proposed Fix
Update the markdown file \`apps/www/content/docs/dark-mode/next.mdx\` to include the \`suppressHydrationWarning\` attribute on the \`<html>\` element and ensure the script tag uses \`beforeInteractive\` strategy.

### Where to look
- \`apps/www/content/docs/dark-mode/next.mdx\`
- \`apps/www/components/theme-provider.tsx\`

Beginners are welcome! Please make sure to test local rendering by running \`pnpm dev\` inside \`apps/www\`.`,
    comments: 4,
    difficulty: 'Trivial',
    estimatedTime: '20-30 mins',
    matchScore: 98,
    isHacktoberfest: true,
    category: 'Documentation',
  },
  {
    id: 102,
    title: 'fix(button): Add missing aria-disabled attribute when loading state is active',
    number: 1204,
    html_url: 'https://github.com/radix-ui/primitives/issues/1204',
    repo: {
      name: 'primitives',
      owner: 'radix-ui',
      full_name: 'radix-ui/primitives',
      stars: 16500,
      language: 'TypeScript',
      open_issues: 88,
      description: 'An open source component library optimized for fast development and accessibility.',
      license: 'MIT',
      healthScore: 92,
    },
    labels: [
      { name: 'good first issue', color: '7057ff', description: 'Good for newcomers' },
      { name: 'a11y', color: '1d76db', description: 'Accessibility' },
      { name: 'bug', color: 'd73a4a', description: 'Something isn\'t working' },
      { name: 'hacktoberfest', color: 'ff6b4a', description: 'Hacktoberfest approved' },
    ],
    created_at: '2026-10-18T11:20:00Z',
    updated_at: '2026-10-25T16:44:00Z',
    body: `When passing \`isLoading={true}\` to the Button component, the button is rendered with pointer-events disabled via CSS, but screen readers still announce it as clickable. We need to pass \`aria-disabled="true"\` to the underlying button element and add a simple unit test in \`Button.test.tsx\`.`,
    comments: 2,
    difficulty: 'Easy',
    estimatedTime: '45 mins',
    matchScore: 95,
    isHacktoberfest: true,
    category: 'Bug Fix',
  },
  {
    id: 103,
    title: 'feat(cli): Add color-coded success message when export completes',
    number: 312,
    html_url: 'https://github.com/pallets/click/issues/312',
    repo: {
      name: 'click',
      owner: 'pallets',
      full_name: 'pallets/click',
      stars: 15400,
      language: 'Python',
      open_issues: 45,
      description: 'Python composable command line utility creation kit.',
      license: 'BSD-3-Clause',
      healthScore: 96,
    },
    labels: [
      { name: 'good first issue', color: '7057ff' },
      { name: 'cli', color: '5319e7' },
      { name: 'hacktoberfest', color: 'ff6b4a' },
    ],
    created_at: '2026-10-19T08:15:00Z',
    updated_at: '2026-10-24T18:00:00Z',
    body: `Currently the CLI exporter exits silently upon completion. Let's add a clean styled output using \`click.secho(..., fg="green")\` to give contributors positive confirmation when their artifacts are exported.`,
    comments: 3,
    difficulty: 'Easy',
    estimatedTime: '30-40 mins',
    matchScore: 92,
    isHacktoberfest: true,
    category: 'Feature',
  },
  {
    id: 104,
    title: 'test: Add unit test coverage for URL slug sanitizer edge cases',
    number: 894,
    html_url: 'https://github.com/fastapi/fastapi/issues/894',
    repo: {
      name: 'fastapi',
      owner: 'fastapi',
      full_name: 'fastapi/fastapi',
      stars: 76000,
      language: 'Python',
      open_issues: 210,
      description: 'FastAPI framework, high performance, easy to learn, fast to code.',
      license: 'MIT',
      healthScore: 95,
    },
    labels: [
      { name: 'help wanted', color: '008672' },
      { name: 'testing', color: 'c2e0c6' },
      { name: 'hacktoberfest', color: 'ff6b4a' },
    ],
    created_at: '2026-10-21T13:40:00Z',
    updated_at: '2026-10-27T10:11:00Z',
    body: `We need a few pytest cases testing unicode strings with accents (e.g., 'café -> cafe') in \`tests/test_utils.py\`. Great intro to pytest fixtures and string manipulation.`,
    comments: 5,
    difficulty: 'Easy',
    estimatedTime: '45 mins',
    matchScore: 89,
    isHacktoberfest: true,
    category: 'Testing',
  },
  {
    id: 105,
    title: 'docs: Fix broken markdown table formatting in Contributing Guidelines',
    number: 620,
    html_url: 'https://github.com/freeCodeCamp/freeCodeCamp/issues/620',
    repo: {
      name: 'freeCodeCamp',
      owner: 'freeCodeCamp',
      full_name: 'freeCodeCamp/freeCodeCamp',
      stars: 405000,
      language: 'TypeScript',
      open_issues: 380,
      description: 'freeCodeCamp.org\'s open-source codebase and curriculum.',
      license: 'BSD-3-Clause',
      healthScore: 98,
    },
    labels: [
      { name: 'first-timers-only', color: 'e4e669' },
      { name: 'documentation', color: '0075ca' },
      { name: 'hacktoberfest', color: 'ff6b4a' },
    ],
    created_at: '2026-10-22T09:00:00Z',
    updated_at: '2026-10-26T21:15:00Z',
    body: `In \`CONTRIBUTING.md\`, lines 142-150 have an unescaped pipe character inside code ticks which causes the GitHub markdown renderer to break the alignment of the table columns.`,
    comments: 1,
    difficulty: 'Trivial',
    estimatedTime: '15 mins',
    matchScore: 99,
    isHacktoberfest: true,
    category: 'Documentation',
  },
  {
    id: 106,
    title: 'feat: Add keyboard shortcut tooltip to search bar input',
    number: 2240,
    html_url: 'https://github.com/facebook/docusaurus/issues/2240',
    repo: {
      name: 'docusaurus',
      owner: 'facebook',
      full_name: 'facebook/docusaurus',
      stars: 55000,
      language: 'TypeScript',
      open_issues: 120,
      description: 'Easy to maintain open source documentation websites.',
      license: 'MIT',
      healthScore: 93,
    },
    labels: [
      { name: 'good first issue', color: '7057ff' },
      { name: 'ui', color: 'bfd4f2' },
      { name: 'hacktoberfest', color: 'ff6b4a' },
    ],
    created_at: '2026-10-15T15:22:00Z',
    updated_at: '2026-10-24T12:00:00Z',
    body: `When pressing \`Cmd+K\` or \`Ctrl+K\`, the search dialog opens. Users requested a small visual badge (⌘K / Ctrl+K) inside the search input so newcomers know the shortcut exists.`,
    comments: 6,
    difficulty: 'Medium',
    estimatedTime: '1-2 hours',
    matchScore: 88,
    isHacktoberfest: true,
    category: 'Feature',
  },
];

export const SAMPLE_EXPLANATION: IssueExplanation = {
  issueId: 101,
  issueTitle: 'docs: Clarify dark mode toggle initialization in Next.js 15 app router',
  repoFullName: 'shadcn-ui/ui',
  plainEnglishSummary: 'When developers follow the documentation to add Dark Mode to a new Next.js 15 app, their browser console throws an annoying yellow hydration warning. This issue asks us to update the documentation file with a one-line attribute fix so other beginners don\'t get confused.',
  whyItMatters: 'Hundreds of developers read this doc every day. A clean setup without console warnings gives everyone an enjoyable first experience with the library.',
  targetFiles: [
    {
      path: 'apps/www/content/docs/dark-mode/next.mdx',
      explanation: 'The actual documentation page written in MDX (Markdown with JSX). This is where the code example snippet lives.',
      riskLevel: 'Low',
    },
    {
      path: 'apps/www/components/theme-provider.tsx',
      explanation: 'The reference component implementation used by the docs website itself. Good to cross-check.',
      riskLevel: 'Low',
    },
  ],
  prerequisites: [
    'Git installed on your computer',
    'Node.js 18+ and pnpm installed (pnpm is used for this monorepo)',
    'A code editor like VS Code',
  ],
  stepByStepGuide: [
    {
      step: 1,
      title: 'Fork and clone the repository',
      detail: 'Click "Fork" on GitHub to create your own copy, then clone it to your local machine.',
      command: 'git clone https://github.com/<your-username>/ui.git',
    },
    {
      step: 2,
      title: 'Create a descriptive feature branch',
      detail: 'Never make edits directly on main. Create a fresh branch named after the fix.',
      command: 'git checkout -b docs/fix-dark-mode-hydration-snippet',
    },
    {
      step: 3,
      title: 'Install dependencies with pnpm',
      detail: 'Install packages using the repository\'s designated package manager.',
      command: 'pnpm install',
    },
    {
      step: 4,
      title: 'Open apps/www/content/docs/dark-mode/next.mdx',
      detail: 'Locate the RootLayout code snippet in Step 3 of the guide. Add suppressHydrationWarning to the <html> tag.',
    },
    {
      step: 5,
      title: 'Preview the docs locally',
      detail: 'Run the docs server to make sure the page renders cleanly and formatting is preserved.',
      command: 'pnpm --filter www dev',
    },
    {
      step: 6,
      title: 'Commit using Conventional Commits',
      detail: 'Maintainers love conventional commits: "docs: add suppressHydrationWarning to nextjs dark mode guide"',
      command: 'git commit -m "docs: clarify dark mode initialization in Next.js 15"',
    },
  ],
  reproductionSteps: [
    'Create a fresh Next.js app with `npx create-next-app@latest`',
    'Follow current Step 3 of the dark-mode/next documentation',
    'Notice browser warning: "Warning: Extra attributes from the server: class"',
    'Adding `suppressHydrationWarning` to `<html>` eliminates the warning immediately',
  ],
  codeHint: {
    filename: 'apps/www/content/docs/dark-mode/next.mdx',
    language: 'tsx',
    code: `// Before:
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  )
}

// After (The Fix):
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>{children}</body>
    </html>
  )
}`,
    commentary: 'Next-themes modifies the html class at runtime on the client, which React interprets as a server-client mismatch unless suppressHydrationWarning is explicitly placed on <html>.',
  },
  commonGotchas: [
    'Do not run `npm install` — this repository uses pnpm workspaces and will generate an unnecessary package-lock.json.',
    'Do not reformat unrelated markdown files with your editor\'s auto-save prettier formatting.',
    'Ensure you reference issue #4821 in your pull request description using "Fixes #4821".',
  ],
  maintainerTips: [
    'Keep your PR diff minimal (only 2-4 lines changed).',
    'Include a screenshot or mention that you tested it locally.',
    'Be courteous in your PR description: say thank you for maintaining the library!',
  ],
  gitCommandsToStart: [
    'git checkout -b docs/fix-dark-mode-hydration',
    'pnpm install',
    'pnpm --filter www dev',
    'git status',
    'git diff',
  ],
};

export const SAMPLE_PRS = {
  messyBeginner: {
    title: 'fixed the bug',
    description: 'i changed some files and it works now please merge thanks',
    issueNumber: '',
    targetBranch: 'main',
    diff: `diff --git a/src/components/ThemeToggle.tsx b/src/components/ThemeToggle.tsx
index 83a1b02..4c88a12 100644
--- a/src/components/ThemeToggle.tsx
+++ b/src/components/ThemeToggle.tsx
@@ -12,6 +12,8 @@ export function ThemeToggle() {
   const { theme, setTheme } = useTheme();
 
   const handleClick = () => {
+    console.log("theme clicked! current is:", theme); // DEBUG REMOVE LATER
+    var newTheme = theme === 'dark' ? 'light' : 'dark';
     setTheme(newTheme);
   };
 
@@ -25,4 +27,4 @@ export function ThemeToggle() {
       Toggle
     </button>
   );
-}
\ No newline at end of file
+}`,
  },
  polishedPR: {
    title: 'fix(a11y): Add aria-disabled attribute to Button during loading state',
    description: `## Summary of Changes
Fixes #1204

This pull request addresses an accessibility oversight where screen readers continued to announce the Button component as interactive while \`isLoading={true}\`.

### Changes made
- Added \`aria-disabled={isLoading || disabled}\` attribute to the native \`<button>\` element in \`src/components/Button.tsx\`.
- Added unit tests in \`src/components/Button.test.tsx\` verifying screen reader accessibility attributes.
- Verified in local Storybook with VoiceOver on Chrome.

### Checklist
- [x] My code follows the code style guidelines of this project
- [x] I have performed a self-review of my own code
- [x] I have added tests that prove my fix is effective
- [x] New and existing unit tests pass locally with my changes`,
    issueNumber: '1204',
    targetBranch: 'main',
    diff: `diff --git a/src/components/Button.tsx b/src/components/Button.tsx
index 1029ab4..5829ef1 100644
--- a/src/components/Button.tsx
+++ b/src/components/Button.tsx
@@ -18,6 +18,7 @@ export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
     return (
       <button
         ref={ref}
+        aria-disabled={isLoading || disabled ? 'true' : undefined}
         disabled={disabled || isLoading}
         className={buttonVariants({ variant, size, className })}
         {...props}
diff --git a/src/components/Button.test.tsx b/src/components/Button.test.tsx
index 9238c1a..3194a2b 100644
--- a/src/components/Button.test.tsx
+++ b/src/components/Button.test.tsx
@@ -40,4 +40,10 @@ describe('Button Component', () => {
     render(<Button disabled>Click</Button>);
     expect(screen.getByRole('button')).toBeDisabled();
   });
+
+  it('sets aria-disabled when isLoading is true', () => {
+    render(<Button isLoading>Submitting</Button>);
+    const btn = screen.getByRole('button');
+    expect(btn).toHaveAttribute('aria-disabled', 'true');
+  });
 });`,
  },
};
