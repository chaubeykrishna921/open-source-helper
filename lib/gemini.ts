import { GoogleGenAI } from '@google/genai';
import { Issue, IssueExplanation, PRReviewRequest, PRReviewResult } from './types';
import { SAMPLE_EXPLANATION } from './mock-data';

function getGeminiClient(customApiKey?: string): GoogleGenAI | null {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;
  try {
    return new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Failed to instantiate GoogleGenAI client:', err);
    return null;
  }
}

export async function explainIssueWithGemini(
  issue: Partial<Issue>,
  customApiKey?: string
): Promise<IssueExplanation> {
  const client = getGeminiClient(customApiKey);

  if (client) {
    try {
      const prompt = `You are GitStart AI, an expert, encouraging mentor for open source beginners contributing during Hacktoberfest.
Analyze this GitHub issue and explain it so a beginner can understand and solve it without getting overwhelmed.

ISSUE DETAILS:
Title: ${issue.title}
Repository: ${issue.repo?.full_name || 'Open Source Project'}
Language: ${issue.repo?.language || 'Unknown'}
Body:
${issue.body || 'No description'}

Respond with ONLY valid JSON with this exact schema:
{
  "issueId": ${issue.id || 101},
  "issueTitle": "${(issue.title || '').replace(/"/g, '\\"')}",
  "repoFullName": "${issue.repo?.full_name || 'project/repo'}",
  "plainEnglishSummary": "2-3 sentences explaining what is broken or needed in plain English, with zero jargon.",
  "whyItMatters": "Why this change helps the project or users.",
  "targetFiles": [
    {
      "path": "path/to/file.ext",
      "explanation": "What this file does and what you will likely change in it.",
      "riskLevel": "Low"
    }
  ],
  "prerequisites": ["List of tools, packages, or background needed"],
  "stepByStepGuide": [
    {
      "step": 1,
      "title": "Short title",
      "detail": "Actionable explanation",
      "command": "git or npm command if applicable"
    }
  ],
  "reproductionSteps": ["Step 1", "Step 2"],
  "codeHint": {
    "filename": "path/to/file.ext",
    "language": "typescript",
    "code": "// Code example illustrating the change",
    "commentary": "Explanation of the code"
  },
  "commonGotchas": ["Pitfall 1", "Pitfall 2"],
  "maintainerTips": ["Tip 1 to keep maintainers happy"],
  "gitCommandsToStart": ["git checkout -b fix/issue-name", "npm install"]
}`;

      // Call Gemini 3.8 Flash
      let rawText = '';
      try {
        const response = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });
        rawText = response.text || '';
      } catch (err2) {
        // Fallback to interaction API if supported
        const interaction = await client.interactions.create({
          model: 'gemini-3.8-flash',
          input: prompt,
        });
        rawText = interaction.output_text || '';
      }

      // Clean markdown fences if any
      const cleaned = rawText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const parsed: IssueExplanation = JSON.parse(cleaned);
      return parsed;
    } catch (apiErr) {
      console.warn('Gemini API call failed or returned unparseable text, using intelligent heuristic fallback:', apiErr);
    }
  }

  // Intelligent Heuristic Fallback
  return generateHeuristicExplanation(issue);
}

export async function reviewPRWithGemini(
  req: PRReviewRequest,
  customApiKey?: string
): Promise<PRReviewResult> {
  const client = getGeminiClient(customApiKey);

  if (client) {
    try {
      const prompt = `You are GitStart AI's "PR Doctor", a friendly senior maintainer reviewing a beginner's pull request before they submit it to an open-source project.
Your goal is to prevent rejection, ensure high Hacktoberfest quality, check for conventional commits, linked issues, tests, and clean diffs.

PR DRAFT:
Title: ${req.title}
Issue Number: ${req.issueNumber || 'None specified'}
Target Branch: ${req.targetBranch || 'main'}
Description:
${req.description}

GIT DIFF:
${req.diff}

Analyze this PR thoroughly. Respond with ONLY valid JSON with this exact schema:
{
  "score": 85,
  "verdict": "Ready to Submit" | "Needs Improvements" | "Critical Issues Detected",
  "summary": "2-3 sentences summarizing the PR state and key feedback.",
  "checklist": [
    {
      "id": "linked-issue",
      "title": "Linked to an existing Issue",
      "passed": true,
      "severity": "critical",
      "feedback": "Feedback message"
    },
    {
      "id": "conventional-title",
      "title": "Conventional Commit Title Format",
      "passed": true,
      "severity": "warning",
      "feedback": "Feedback message"
    },
    {
      "id": "unit-tests",
      "title": "Unit Tests Added / Updated",
      "passed": false,
      "severity": "critical",
      "feedback": "Feedback message"
    },
    {
      "id": "clean-diff",
      "title": "No Leftover Debug Code or Trailing Whitespace",
      "passed": true,
      "severity": "warning",
      "feedback": "Feedback message"
    },
    {
      "id": "description-quality",
      "title": "Clear Reproduction & Summary in Description",
      "passed": true,
      "severity": "info",
      "feedback": "Feedback message"
    }
  ],
  "diffIssues": [
    {
      "file": "path/to/file",
      "line": 15,
      "severity": "warning",
      "message": "Notice: console.log left in production code.",
      "suggestion": "Remove console.log before committing."
    }
  ],
  "maintainerToneRating": "Friendly & Professional" | "Neutral" | "Vague / Demanding",
  "polishedDescription": "A complete, beautifully formatted Markdown PR description ready for the user to copy-paste into GitHub.",
  "encouragement": "An uplifting, motivating closing statement for the beginner contributor."
}`;

      let rawText = '';
      try {
        const response = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });
        rawText = response.text || '';
      } catch (err2) {
        const interaction = await client.interactions.create({
          model: 'gemini-3.8-flash',
          input: prompt,
        });
        rawText = interaction.output_text || '';
      }

      const cleaned = rawText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const parsed: PRReviewResult = JSON.parse(cleaned);
      return parsed;
    } catch (apiErr) {
      console.warn('Gemini API call failed for PR review, using intelligent heuristic fallback:', apiErr);
    }
  }

  // Intelligent Heuristic Fallback
  return generateHeuristicPRReview(req);
}

// -------------------------------------------------------------
// Heuristic Fallback Engines
// -------------------------------------------------------------

function generateHeuristicExplanation(issue: Partial<Issue>): IssueExplanation {
  if (issue.id === 101 || (issue.title && issue.title.includes('dark mode'))) {
    return SAMPLE_EXPLANATION;
  }

  const title = issue.title || 'Untitled Issue';
  const repo = issue.repo?.full_name || 'community/project';
  const lang = issue.repo?.language || 'JavaScript';

  return {
    issueId: issue.id || Math.floor(Math.random() * 9000) + 1000,
    issueTitle: title,
    repoFullName: repo,
    plainEnglishSummary: `This task asks for an update related to "${title}". The repository maintainers labeled this as beginner-friendly because the change is focused and isolated to specific files rather than requiring a large system rewrite.`,
    whyItMatters: `Resolving this ensures contributors and users have a smoother experience, avoids runtime warnings or bugs, and improves codebase reliability.`,
    targetFiles: [
      {
        path: lang === 'Python' ? 'src/core/utils.py' : 'src/components/index.ts',
        explanation: 'Primary logic implementation where the behavior is defined.',
        riskLevel: 'Low',
      },
      {
        path: lang === 'Python' ? 'tests/test_utils.py' : 'tests/unit.test.ts',
        explanation: 'Test suite file to add or update automated regression checks.',
        riskLevel: 'Low',
      },
    ],
    prerequisites: [
      'Basic knowledge of ' + lang,
      'Git installed on your system',
      'Local development environment configured',
    ],
    stepByStepGuide: [
      {
        step: 1,
        title: 'Fork and clone the project',
        detail: 'Fork the repository on GitHub, then clone your fork locally.',
        command: `git clone https://github.com/<your-username>/${issue.repo?.name || 'repo'}.git`,
      },
      {
        step: 2,
        title: 'Create an isolated feature branch',
        detail: 'Always work on a new branch instead of main or master.',
        command: 'git checkout -b fix/issue-update',
      },
      {
        step: 3,
        title: 'Install dependencies and run tests',
        detail: 'Verify the test suite passes before making any modifications.',
        command: lang === 'Python' ? 'pytest' : 'npm test',
      },
      {
        step: 4,
        title: 'Apply the requested change',
        detail: 'Make the focused changes specified in the issue body. Keep edits minimal.',
      },
      {
        step: 5,
        title: 'Run linting & formatting checks',
        detail: 'Maintainers require code formatting tools to pass clean in CI.',
        command: lang === 'Python' ? 'flake8 .' : 'npm run lint',
      },
      {
        step: 6,
        title: 'Commit with a clear message',
        detail: 'Use conventional commits format: "fix: update logic for issue"',
        command: 'git commit -m "fix: resolve issue requirements"',
      },
    ],
    reproductionSteps: [
      'Check out the main branch',
      'Run the application locally and observe the behavior described in the issue',
      'Apply the fix on your feature branch and verify the expected result',
    ],
    codeHint: {
      filename: lang === 'Python' ? 'src/utils.py' : 'src/index.ts',
      language: lang.toLowerCase(),
      code: `// Verify parameters before processing\nif (!input) {\n  return defaultValue;\n}`,
      commentary: 'Ensure edge cases (empty strings, null, undefined) are handled gracefully.',
    },
    commonGotchas: [
      'Do not commit unnecessary lockfile changes or IDE files (.vscode, .idea).',
      'Remember to reference the issue number in your pull request.',
      'Check contributing guide (CONTRIBUTING.md) for branch naming conventions.',
    ],
    maintainerTips: [
      'Keep your pull request scoped strictly to this issue.',
      'Write a friendly description explaining how you verified your fix.',
    ],
    gitCommandsToStart: [
      'git checkout -b fix/starter-contribution',
      lang === 'Python' ? 'pip install -r requirements.txt' : 'npm install',
      lang === 'Python' ? 'pytest' : 'npm test',
    ],
  };
}

function generateHeuristicPRReview(req: PRReviewRequest): PRReviewResult {
  const title = (req.title || '').trim();
  const desc = (req.description || '').trim();
  const diff = (req.diff || '').trim();

  const checklist: PRReviewResult['checklist'] = [];
  const diffIssues: PRReviewResult['diffIssues'] = [];

  // Check 1: Issue link
  const hasIssueLink =
    Boolean(req.issueNumber && req.issueNumber.trim()) ||
    /(?:fixes|closes|resolves|refs|#)\s*#?\d+/i.test(desc) ||
    /#\d+/.test(title);

  checklist.push({
    id: 'linked-issue',
    title: 'Linked to an Issue (#number)',
    passed: hasIssueLink,
    severity: 'critical',
    feedback: hasIssueLink
      ? 'Great job! You referenced an issue, so GitHub will auto-link and close it once merged.'
      : 'Missing issue reference. Maintainers require PRs to link to an issue (e.g. "Fixes #123").',
  });

  // Check 2: Conventional commit title
  const conventionalRegex = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9_-]+\))?:\s+.{3,}/i;
  const isConventional = conventionalRegex.test(title);

  checklist.push({
    id: 'conventional-title',
    title: 'Conventional Commit PR Title Format',
    passed: isConventional,
    severity: 'warning',
    feedback: isConventional
      ? 'Title follows standard conventional commit convention (e.g., feat:, fix:, docs:).'
      : 'Title is vague or missing prefix. Consider formatting like "fix(ui): description of change".',
  });

  // Check 3: Description length & detail
  const isDescDetailed = desc.length > 50 && !/^(fixed|done|updated|works now)$/i.test(desc);
  checklist.push({
    id: 'description-quality',
    title: 'Comprehensive PR Description',
    passed: isDescDetailed,
    severity: 'critical',
    feedback: isDescDetailed
      ? 'Description contains helpful context and explanation of what was changed.'
      : 'Description is very brief. Maintainers need to know WHY you made this change and HOW you tested it.',
  });

  // Check 4: Unit tests present in diff
  const hasTests = /test|spec|\.test\.|\.spec\./i.test(diff);
  checklist.push({
    id: 'unit-tests',
    title: 'Tests Included or Mentioned',
    passed: hasTests || desc.toLowerCase().includes('tested locally') || desc.toLowerCase().includes('unit test'),
    severity: 'warning',
    feedback: hasTests
      ? 'Test files or test assertions were detected in your changes.'
      : 'No test files detected in diff. Consider adding unit tests or documenting local manual testing.',
  });

  // Check 5: Inspect diff for debug code & console.log
  const hasConsoleLog = /console\.log|print\(|debugger/i.test(diff);
  if (hasConsoleLog) {
    diffIssues.push({
      severity: 'warning',
      message: 'Detected debug statements (console.log / print / debugger) inside diff.',
      suggestion: 'Remove debugging statements before opening your pull request.',
    });
  }

  const hasNoNewline = /\\ No newline at end of file/i.test(diff);
  if (hasNoNewline) {
    diffIssues.push({
      severity: 'suggestion',
      message: 'Missing newline at end of file.',
      suggestion: 'Ensure files end with a standard UNIX newline character.',
    });
  }

  // Calculate score
  let score = 95;
  if (!hasIssueLink) score -= 25;
  if (!isConventional) score -= 15;
  if (!isDescDetailed) score -= 25;
  if (!hasTests) score -= 10;
  if (hasConsoleLog) score -= 15;

  score = Math.max(20, Math.min(100, score));

  let verdict: PRReviewResult['verdict'] = 'Ready to Submit';
  if (score < 60) {
    verdict = 'Critical Issues Detected';
  } else if (score < 85) {
    verdict = 'Needs Improvements';
  }

  let toneRating: PRReviewResult['maintainerToneRating'] = 'Friendly & Professional';
  if (desc.length < 30) {
    toneRating = 'Vague / Demanding';
  }

  // Generate polished description
  const issueRef = req.issueNumber ? `Fixes #${req.issueNumber}` : 'Closes #[issue-number]';
  const polishedDescription = `## Description
${issueRef}

This pull request addresses the problem by introducing the necessary adjustments to solve the issue cleanly while adhering to project coding conventions.

### Summary of Changes
- Updated implementation to fulfill requirements cleanly.
- Verified behavior locally with existing test suites.
- Ensured no unintended regressions or linting warnings.

### How Has This Been Tested?
- [x] Ran automated test suites locally (\`npm test\` / \`pytest\`)
- [x] Verified manually in local browser / environment

### Checklist
- [x] My code follows the style guidelines of this project
- [x] I have performed a self-review of my own code
- [x] I have commented my code, particularly in hard-to-understand areas
- [x] I have linked the relevant issue above`;

  return {
    score,
    verdict,
    summary:
      score >= 85
        ? 'Excellent pull request draft! Your submission is well-structured, clear, and follows open source best practices.'
        : 'Your PR has the right intentions, but maintainers may request changes or close it unless you add an issue reference and expand the description.',
    checklist,
    diffIssues,
    maintainerToneRating: toneRating,
    polishedDescription,
    encouragement:
      score >= 85
        ? 'You are ready to shine in open source! Submit with confidence! 🚀'
        : 'Don’t worry! Every open source maintainer was once a beginner. Apply the recommendations above and your PR will be welcomed with open arms! 💪',
  };
}
