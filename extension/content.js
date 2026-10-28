(function () {
  const currentUrl = window.location.href;
  const isIssue = /github\.com\/[^/]+\/[^/]+\/issues\/\d+/.test(currentUrl);
  const isPR = /github\.com\/[^/]+\/[^/]+\/(compare|pull)/.test(currentUrl);

  if (!isIssue && !isPR) return;

  // Listen for popup messages
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'TRIGGER_EXPLAIN') {
      showIssueExplanationModal();
    } else if (request.action === 'TRIGGER_PR_REVIEW') {
      showPRReviewModal();
    }
    sendResponse({ status: 'OK' });
    return true;
  });

  // Inject Floating Button
  const triggerBtn = document.createElement('div');
  triggerBtn.className = 'gitstart-floating-trigger';
  triggerBtn.innerHTML = isIssue
    ? '<span>✨ Explain Issue (GitStart)</span>'
    : '<span>🛡️ PR Doctor Check</span>';

  triggerBtn.addEventListener('click', () => {
    if (isIssue) {
      showIssueExplanationModal();
    } else {
      showPRReviewModal();
    }
  });

  document.body.appendChild(triggerBtn);

  // -------------------------------------------------------------
  // Issue Explainer Overlay
  // -------------------------------------------------------------
  async function showIssueExplanationModal() {
    const titleEl = document.querySelector('.gh-header-title, h1 bdi, h1.js-issue-title');
    const issueTitle = titleEl ? titleEl.textContent.trim() : document.title;
    const bodyEl = document.querySelector('.comment-body, .js-comment-body, [data-testid="issue-body"]');
    const issueBody = bodyEl ? bodyEl.textContent.trim() : '';

    const pathParts = window.location.pathname.split('/');
    const repoFullName = `${pathParts[1]}/${pathParts[2]}`;
    const issueNumber = pathParts[4] || '1';

    const overlay = createOverlay();
    overlay.innerHTML = `
      <div class="gitstart-modal-content">
        <div class="gitstart-modal-header">
          <div>
            <span class="gitstart-pill">ELI5 Codebase Explainer</span>
            <strong style="display:block; margin-top:4px; font-size:14px;">${issueTitle}</strong>
          </div>
          <button class="gitstart-close-btn" id="gitstartClose">✕</button>
        </div>
        <div class="gitstart-modal-body" id="gitstartModalBody">
          <div style="text-align:center; padding:24px;">
            <p style="color:#10b981; font-weight:600;">Analyzing issue & repository structure...</p>
            <p style="color:#64748b; font-size:11px;">GitStart AI is breaking down requirements into beginner-friendly milestones.</p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    overlay.querySelector('#gitstartClose').onclick = () => overlay.remove();

    // Call local GitStart API or use fallback
    try {
      const res = await fetch('http://localhost:3000/api/explain-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issue: {
            id: Number(issueNumber),
            title: issueTitle,
            body: issueBody,
            repo: { full_name: repoFullName, language: 'TypeScript' },
          },
        }),
      });

      if (!res.ok) throw new Error('API unavailable');
      const data = await res.json();
      renderIssueExplanation(overlay, data);
    } catch (err) {
      // Fallback
      renderIssueExplanation(overlay, {
        plainEnglishSummary: `This issue asks for an update to "${issueTitle}". Maintainers marked this as beginner-friendly because the change is isolated to specific components and docs.`,
        whyItMatters: 'Fixing this ensures clean developer experience without warnings or confusion.',
        targetFiles: [
          { path: 'src/components/ or docs/', explanation: 'Primary place where logic/markdown is defined', riskLevel: 'Low' },
        ],
        stepByStepGuide: [
          { step: 1, title: 'Fork & Clone', detail: 'Fork on GitHub, clone to local machine' },
          { step: 2, title: 'Branch', detail: 'Create a feature branch: git checkout -b fix/issue-update' },
          { step: 3, title: 'Code & Test', detail: 'Apply edits and verify tests pass' },
          { step: 4, title: 'Commit Format', detail: 'Use conventional commits: fix: your change' },
        ],
        gitCommandsToStart: ['git checkout -b fix/starter-contribution', 'npm install', 'npm test'],
      });
    }
  }

  function renderIssueExplanation(overlay, data) {
    const body = overlay.querySelector('#gitstartModalBody');
    body.innerHTML = `
      <div class="gitstart-card" style="background:rgba(16, 185, 129, 0.1); border-color:rgba(16, 185, 129, 0.3);">
        <strong style="color:#10b981; display:block; margin-bottom:6px; font-size:11px; text-transform:uppercase;">
          Plain English Summary (No Jargon)
        </strong>
        <p style="margin:0; font-size:13px; line-height:1.5;">${data.plainEnglishSummary}</p>
      </div>

      <div class="gitstart-card">
        <strong style="display:block; margin-bottom:8px; font-size:12px; color:#f8fafc;">
          Where in this repo to look:
        </strong>
        ${(data.targetFiles || [])
          .map(
            (f) => `
          <div style="margin-bottom:6px; padding:6px; background:#0f172a; border-radius:6px; font-size:11px;">
            <code style="color:#34d399;">${f.path}</code>
            <span style="color:#94a3b8; display:block; margin-top:2px;">${f.explanation}</span>
          </div>`
          )
          .join('')}
      </div>

      <div class="gitstart-card">
        <strong style="display:block; margin-bottom:8px; font-size:12px; color:#f8fafc;">
          Step-by-step contribution steps:
        </strong>
        <ol style="margin:0; padding-left:18px; color:#cbd5e1; font-size:12px;">
          ${(data.stepByStepGuide || [])
            .map((s) => `<li style="margin-bottom:6px;"><strong>${s.title}:</strong> ${s.detail}</li>`)
            .join('')}
        </ol>
      </div>

      <div style="text-align:center; padding-top:8px;">
        <a href="http://localhost:3000" target="_blank" style="color:#38bdf8; font-size:12px; text-decoration:none;">
          Open Full Roadmap & Code Hints in GitStart AI Dashboard ↗
        </a>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // PR Doctor Overlay
  // -------------------------------------------------------------
  async function showPRReviewModal() {
    const titleInput = document.querySelector('input[name="pull_request[title]"], #pull_request_title');
    const descTextarea = document.querySelector('textarea[name="pull_request[body]"], #pull_request_body');

    const prTitle = titleInput ? titleInput.value.trim() : '';
    const prDesc = descTextarea ? descTextarea.value.trim() : '';

    const overlay = createOverlay();
    overlay.innerHTML = `
      <div class="gitstart-modal-content">
        <div class="gitstart-modal-header">
          <div>
            <span class="gitstart-pill" style="background:rgba(56, 189, 248, 0.15); color:#38bdf8; border-color:rgba(56, 189, 248, 0.3);">
              Pre-Flight PR Doctor
            </span>
            <strong style="display:block; margin-top:4px; font-size:14px;">Reviewing Pull Request Draft</strong>
          </div>
          <button class="gitstart-close-btn" id="gitstartClose">✕</button>
        </div>
        <div class="gitstart-modal-body" id="gitstartModalBody">
          <div style="text-align:center; padding:24px;">
            <p style="color:#38bdf8; font-weight:600;">Auditing PR title, issue links, and descriptions...</p>
            <p style="color:#64748b; font-size:11px;">Checking against Hacktoberfest maintainer standards.</p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    overlay.querySelector('#gitstartClose').onclick = () => overlay.remove();

    try {
      const res = await fetch('http://localhost:3000/api/review-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: prTitle || 'Draft PR',
          description: prDesc || '',
          diff: '',
        }),
      });

      if (!res.ok) throw new Error('API unavailable');
      const data = await res.json();
      renderPRReview(overlay, data, descTextarea);
    } catch (err) {
      renderPRReview(
        overlay,
        {
          score: prDesc.length > 50 ? 80 : 45,
          verdict: prDesc.length > 50 ? 'Needs Improvements' : 'Critical Issues Detected',
          summary: 'We checked your PR title and description before you hit submit.',
          checklist: [
            {
              id: 'linked-issue',
              title: 'Linked Issue',
              passed: Boolean(prDesc.match(/#\d+/)),
              feedback: 'Always link an issue e.g. "Fixes #123"',
            },
            {
              id: 'conventional',
              title: 'Conventional Commit Title',
              passed: Boolean(prTitle.match(/^(feat|fix|docs):/)),
              feedback: 'Use feat:, fix:, or docs: in PR title',
            },
            {
              id: 'desc-length',
              title: 'Detailed Description',
              passed: prDesc.length > 40,
              feedback: 'Explain what was changed and how you tested it',
            },
          ],
          polishedDescription: `## Description\nFixes #[issue-number]\n\nDetailed explanation of what was changed.\n\n### How Has This Been Tested?\n- [x] Tested locally\n- [x] Passed automated unit tests`,
        },
        descTextarea
      );
    }
  }

  function renderPRReview(overlay, data, targetTextarea) {
    const body = overlay.querySelector('#gitstartModalBody');
    body.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; padding:12px; background:#020617; border-radius:10px;">
        <div>
          <span style="font-size:11px; text-transform:uppercase; color:#94a3b8;">Pre-Flight Verdict</span>
          <strong style="display:block; color:${data.score >= 80 ? '#34d399' : '#f87171'}; font-size:14px;">
            ${data.verdict}
          </strong>
        </div>
        <div style="font-size:24px; font-weight:800; color:${data.score >= 80 ? '#34d399' : '#f87171'};">
          ${data.score}/100
        </div>
      </div>

      <div class="gitstart-card">
        <strong style="display:block; margin-bottom:8px; font-size:12px;">Submission Checklist:</strong>
        ${(data.checklist || [])
          .map(
            (c) => `
          <div style="display:flex; align-items:flex-start; gap:8px; margin-bottom:6px; font-size:12px;">
            <span style="color:${c.passed ? '#34d399' : '#f87171'}; font-weight:bold;">${c.passed ? '✓' : '✕'}</span>
            <div>
              <strong>${c.title}</strong>
              <div style="color:#94a3b8; font-size:11px;">${c.feedback}</div>
            </div>
          </div>`
          )
          .join('')}
      </div>

      ${
        data.polishedDescription
          ? `
      <div class="gitstart-card">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
          <strong style="font-size:12px;">Polished PR Description:</strong>
          <button id="gitstartApplyDesc" style="background:#10b981; color:#020617; border:none; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:bold; cursor:pointer;">
            ${targetTextarea ? 'Apply to GitHub' : 'Copy'}
          </button>
        </div>
        <pre style="background:#020617; padding:8px; border-radius:6px; font-size:10px; color:#cbd5e1; max-height:100px; overflow-y:auto; white-space:pre-wrap;">${data.polishedDescription}</pre>
      </div>`
          : ''
      }
    `;

    const applyBtn = body.querySelector('#gitstartApplyDesc');
    if (applyBtn) {
      applyBtn.onclick = () => {
        if (targetTextarea) {
          targetTextarea.value = data.polishedDescription;
          applyBtn.textContent = 'Applied to PR! ✓';
        } else {
          navigator.clipboard.writeText(data.polishedDescription);
          applyBtn.textContent = 'Copied! ✓';
        }
      };
    }
  }

  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'gitstart-modal-overlay';
    return overlay;
  }
})();
