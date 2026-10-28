import { Issue, IssueExplanation, PRReviewRequest, PRReviewResult } from './types';

const DEFAULT_OLLAMA_ENDPOINT = 'http://localhost:11434';
const DEFAULT_MODEL = 'qwen3.5:4b';

export interface OllamaOptions {
  endpoint?: string;
  model?: string;
}

export async function checkOllamaStatus(endpoint: string = DEFAULT_OLLAMA_ENDPOINT): Promise<{
  running: boolean;
  models: string[];
  endpoint: string;
}> {
  try {
    const res = await fetch(`${endpoint.replace(/\/$/, '')}/api/tags`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return { running: false, models: [], endpoint };
    }

    const data = await res.json();
    const models = (data.models || []).map((m: any) => m.name || m.model);
    return { running: true, models, endpoint };
  } catch (err) {
    return { running: false, models: [], endpoint };
  }
}

export async function explainIssueWithOllama(
  issue: Partial<Issue>,
  options?: OllamaOptions
): Promise<IssueExplanation> {
  const endpoint = options?.endpoint || process.env.OLLAMA_ENDPOINT || DEFAULT_OLLAMA_ENDPOINT;
  const model = options?.model || process.env.OLLAMA_MODEL || DEFAULT_MODEL;

  const prompt = `You are GitStart AI, an expert, encouraging mentor for open-source beginners contributing during Hacktoberfest.
Analyze this GitHub issue and explain it so a beginner can understand and solve it without getting overwhelmed.

ISSUE DETAILS:
Title: ${issue.title}
Repository: ${issue.repo?.full_name || 'Open Source Project'}
Language: ${issue.repo?.language || 'TypeScript'}
Body:
${issue.body || 'No description provided.'}

Respond strictly with valid JSON with this exact schema:
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

  const res = await fetch(`${endpoint.replace(/\/$/, '')}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      format: 'json',
      stream: false,
    }),
  });

  if (!res.ok) {
    throw new Error(`Ollama API error: ${res.statusText}`);
  }

  const data = await res.json();
  const rawText = data.response || '{}';
  const cleaned = rawText
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  const parsed: IssueExplanation = JSON.parse(cleaned);
  return parsed;
}

export async function reviewPRWithOllama(
  req: PRReviewRequest,
  options?: OllamaOptions
): Promise<PRReviewResult> {
  const endpoint = options?.endpoint || process.env.OLLAMA_ENDPOINT || DEFAULT_OLLAMA_ENDPOINT;
  const model = options?.model || process.env.OLLAMA_MODEL || DEFAULT_MODEL;

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

Analyze this PR thoroughly. Respond strictly with valid JSON with this exact schema:
{
  "score": 85,
  "verdict": "Ready to Submit",
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
  "maintainerToneRating": "Friendly & Professional",
  "polishedDescription": "A complete, beautifully formatted Markdown PR description ready for the user to copy-paste into GitHub.",
  "encouragement": "An uplifting, motivating closing statement for the beginner contributor."
}`;

  const res = await fetch(`${endpoint.replace(/\/$/, '')}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      format: 'json',
      stream: false,
    }),
  });

  if (!res.ok) {
    throw new Error(`Ollama API error: ${res.statusText}`);
  }

  const data = await res.json();
  const rawText = data.response || '{}';
  const cleaned = rawText
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  const parsed: PRReviewResult = JSON.parse(cleaned);
  return parsed;
}
