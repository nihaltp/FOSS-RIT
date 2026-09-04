# FOSS Club RIT — Maintainer & Reviewer Handbook

Welcome to the FOSS Club RIT core maintainer team!

Your role is to help review and verify open-source projects and creative media submissions from students. This handbook outlines the review procedures for both code and creative media.

---

## 4-Step Review Workflow

### Step 1: Check the Automated Review Card
When a student opens a PR, GitHub Actions automatically runs `scripts/validate_pr.py` and posts a **Review Summary Card**.
- **Green Pass:** All frontmatter syntax and required fields are present.
- **Red Failure:** Identifies the exact problem (e.g. missing `media_url`, missing `repo_url`, or binary file committed to Git).

### Step 2: Verification by Category

#### For Code Projects (`content/projects/*.md`):
1. **Public Repository:** Click the repo link—verify it is public and contains working code.
2. **README:** Verify a README exists explaining how to run the project.
3. **Student Maker:** Confirm the contributor is a student or alumnus of RIT.

#### For Creative Showcases (`content/creatives/*.md`):
1. **Media Preview:** Click the `media_url` or `thumbnail_url`—verify the link is accessible.
2. **No Raw Binaries in Git:** Ensure the PR only contains a `.md` file, not large `.png`, `.jpg`, or `.mp4` files.
3. **Authenticity & Licensing:** Confirm the work has an appropriate Creative Commons license (`CC-BY`, `CC0`, etc.) and does not violate copyright.

### Step 3: Friendly Review & Feedback
- **Approve:** *"Great work! Approved for the campus showcase."*
- **Request Changes:** *"Hey @username! Please ensure your media is hosted on YouTube/Unsplash/Figma and linked via URL rather than committing raw video/photo files to Git."*

### Step 4: Merge the Pull Request
1. Click **Merge pull request** -> **Confirm merge**.
2. GitHub Actions runs `scripts/sync_data.py`, recalculates Leaderboard XP, generates `projects.json` / `creatives.json`, and deploys the live site in ~10 seconds.

---

## Submission Criteria & Guardrails

| Situation | Action to Take |
| :--- | :--- |
| **Empty repo or placeholder link** | Ask the student to add actual code/media before approval. |
| **Raw binary file committed in PR** | Close or request change: ask student to remove the binary and use an external CDN link. |
| **Unmodified clone of external work** | Politely decline: submissions must be original work or active contributions. |
| **Spam / non-student submissions** | Close the PR with a brief explanation. |

---

## Escalations & Architecture Guidelines

- Only PRs touching `content/projects/*.md` and `content/creatives/*.md` should be merged by junior maintainers.
- Any PR altering `scripts/`, `frontend/`, or `.github/` workflows requires senior core review from `@vertigotalks7`.
