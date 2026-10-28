# Chrome Web Store Metadata: GitStart AI

**Last Updated:** 2026-10-28  
**Extension Name:** GitStart AI — Open-Source Contribution Helper  
**Version:** 1.0.0  

---

## Store Listing

### Summary (132 characters max)
Helping beginners make their first open source contribution with ELI5 issue explanations and pre-flight PR reviews on GitHub.

### Single-Purpose Description
GitStart AI is an open-source contribution companion designed to help newcomers navigate Hacktoberfest and GitHub repositories with confidence. It explains complex GitHub issues in plain English, highlights the exact files to edit, provides step-by-step contribution instructions, and audits pull request drafts before submission to prevent rejection.

### Key Features
- **ELI5 Issue Explainer**: Translates technical issue requirements into simple plain English instructions with no jargon.
- **Repository File Map**: Directs contributors to the exact files and functions they need to modify.
- **Pre-Flight PR Doctor**: Analyzes PR title format, issue links, descriptions, and code changes to provide an acceptance confidence score before you submit.
- **Hacktoberfest Eligibility**: Identifies official Hacktoberfest issues and tags.

---

## Permissions Justification

| Permission / Host | Why it is needed |
|---|---|
| `storage` | Saves user skill preferences and optional API credentials locally on the device. |
| `tabs` | Allows the extension popup to detect when the active browser tab is viewing a GitHub issue or pull request page. |
| `https://github.com/*` | Injects the in-page ELI5 Explainer button on GitHub issue pages and the PR Doctor button on pull request creation pages. |
| `http://localhost:3000/*` | Communicates with the local GitStart AI companion dashboard for extended analysis and roadmaps. |

---

## Privacy & Data Use
- GitStart AI does not sell or transfer user data to third parties.
- User code diffs and issue text are processed ephemerally solely to produce contribution suggestions and explanations.
