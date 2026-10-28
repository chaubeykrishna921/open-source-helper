# GitStart AI — Open-Source Contribution Helper (Hacktoberfest Edition)

> Empowering beginners to make meaningful open-source contributions with AI-assisted issue matching, ELI5 codebase explanations, and pre-flight PR reviews.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-3.8_Flash-orange?style=for-the-badge&logo=google)
![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-2026-ff6b4a?style=for-the-badge)

---

## 🎯 Problem Statement
- Beginners often don't know which open-source repositories or issues match their skill level.
- Codebases with hundreds of files and confusing architectures cause intimidation and analysis paralysis.
- Many newcomers give up on open source after having their first pull request rejected or ignored due to style mistakes, missing tests, unformatted commit messages, or missing issue links.

## 💡 Solution: GitStart AI
1. **GitHub Profile Skill Scanner**: Reads a user's GitHub profile to compute a developer skill matrix (primary languages, experience level, activity score) and recommend matching issues.
2. **Curated "Good First Issue" & Hacktoberfest Finder**: Scored and ranked issues from active, beginner-friendly repositories with real maintainer responsiveness metrics.
3. **ELI5 Codebase Explainer**: Translates complex issue descriptions into simple plain English (no jargon), pinpoints the exact files to edit in the repository, and provides a step-by-step contribution roadmap with copyable git commands.
4. **Pre-Flight PR Doctor ("Anti-Rejection Shield")**: Audits PR title, description, and git diff before submission, checks conventional commit format, flags accidental debug statements (e.g. `console.log`), and generates a maintainer-ready PR description.
5. **Chrome Browser Extension (Manifest V3)**: Directly augments GitHub issue pages and pull request creation pages with inline AI buttons.
6. **Hacktoberfest Playbook**: Guidelines on quality standards, anti-spam rules, and conventional commit cheat sheets.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- npm or pnpm

### 2. Installation
```bash
git clone https://github.com/<your-username>/gitstart-ai.git
cd gitstart-ai
npm install
```

### 3. Running the App
```bash
npm run dev
# Or build and run production
npm run build
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧩 Chrome Browser Extension Setup

1. Open Google Chrome and go to `chrome://extensions`.
2. Enable **Developer mode** in the top-right corner.
3. Click **Load unpacked**.
4. Select the `extension/` folder inside this repository.
5. Visit any GitHub issue (e.g. `github.com/:owner/:repo/issues/:id`) or PR page to see the GitStart AI companion widget!

---

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **AI / LLM**: Google Gemini 3.8 Flash (`@google/genai` SDK) with built-in offline heuristic fallback
- **Data Source**: GitHub REST API
- **Browser Extension**: Manifest V3 (Chrome)

---

## 📄 License
MIT License. Created for the open-source community.
