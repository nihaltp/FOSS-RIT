# FOSS Club RIT — Maintainer & Reviewer Handbook

Welcome to the FOSS Club RIT core maintainer team!

Your role is to help review and verify open-source projects and creative media submissions from students. This handbook outlines the triage procedures for both **Issue Form Submissions** and **Pull Requests**.

---

## 1. Issue Form Submissions (Creative Showcases)

When a student submits via the [Creative Showcase Form](https://github.com/vertigotalks7/FOSS-RIT/issues/new?template=creative-submission.yml):
1. **Notification:** The issue arrives with labels `showcase-submission` and `triage`.
2. **Review Checklist:**
   - [ ] Click the **Media / Preview URL** to confirm it is valid, public, and safe for campus display.
   - [ ] Check the **College Roll No. / KTU ID** (e.g. `RIT22CS045`) to confirm active student maker status.
   - [ ] Confirm tools and license (`CC-BY-4.0`, etc.) are provided.
3. **Approve & Publish (1 Click):**
   - Attach the label **`approved`** to the issue.
   - The automated GitHub Action ([`.github/workflows/publish-showcase.yml`](.github/workflows/publish-showcase.yml)) will:
     - Generate `content/creatives/<slug>.md`.
     - Set `is_verified_student: true` if roll number is valid.
     - Recalculate leaderboard XP and sync feeds via `scripts/sync_data.py`.
     - Commit and push to `main`.
     - Comment thanking the contributor and close the issue automatically.
4. **If Changes are Needed:**
   - Comment on the issue: *"Hey @username! Loved the submission, but your Figma link is set to private. Please set it to 'Anyone with link can view' and we'll approve it right away!"*

---

## 2. Pull Request Reviews (Code Projects)

When a developer opens a PR touching `content/projects/*.md`:
1. **Automated Validation:** GitHub Actions runs `scripts/validate_pr.py` and posts a **Review Summary Card**.
   - **Green Pass:** All frontmatter syntax and fields are valid.
   - **Red Failure:** Identifies issues (e.g., missing `repo_url`, 404 repository, or binary files in Git).
2. **Review Checklist:**
   - [ ] **Public Repository:** Repo is public with original code.
   - [ ] **README:** Clear explanation of how to run the project.
   - [ ] **Student Maker:** Authentic student or alumnus of RIT.
3. **Merge the PR:**
   - Click **Merge pull request** -> **Confirm merge**.
   - The site syncs and redeploys in ~10 seconds.

---

## Submission Criteria & Guardrails

| Situation | Action to Take |
| :--- | :--- |
| **Empty repo or placeholder link** | Ask the student to add actual code/media before approval. |
| **Raw binary file committed in PR** | Close or request change: ask student to remove the binary and use an external CDN link. |
| **Unmodified clone of external work** | Politely decline: submissions must be original work or active contributions. |
| **Spam / non-student submissions** | Close the issue/PR with a brief explanation. |

---

## Escalations & Architecture Guidelines

- Only PRs/Issues touching `content/projects/*.md` and `content/creatives/*.md` should be merged by junior maintainers.
- Any PR altering `scripts/`, `frontend/`, or `.github/` workflows requires senior core review from `@vertigotalks7`.
