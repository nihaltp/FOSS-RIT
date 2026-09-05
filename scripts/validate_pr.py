#!/usr/bin/env python3
"""
FOSS Club RIT — Project & Creative Submission PR Validator
Validates frontmatter, security constraints, and generates supervised review summary cards
for both software repositories and creative showcases.
"""

import sys
import re
import os
import json
import urllib.request
import urllib.error
from pathlib import Path

# Ensure UTF-8 output across all platforms
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

def validate():
    projects_dir = Path("content/projects")
    creatives_dir = Path("content/creatives")

    hard_errors = []
    authors = {}
    summary_cards = []
    token = os.environ.get("GITHUB_TOKEN")

    # 1. Check for binary files or misplaced files
    allowed_root_docs = {
        "readme.md", "contributing.md", "maintainer_guide.md", "future_plan.md",
        "pull_request_template.md", "license.md", "pr_summary.md"
    }
    root_mds = [f for f in Path(".").glob("*.md") if f.name.lower() not in allowed_root_docs]
    for r_file in root_mds:
        try:
            r_text = r_file.read_text(encoding="utf-8")
            if r_text.startswith("---") and ("repo_url:" in r_text or "category:" in r_text or "name:" in r_text):
                hard_errors.append(f"Misplaced file `{r_file.name}`: Submission files must be placed in `content/projects/` or `content/creatives/`.")
        except Exception:
            pass

    # Check for binary file extensions in content/
    binary_extensions = {".png", ".jpg", ".jpeg", ".mp4", ".mov", ".zip", ".tar", ".gz", ".psd", ".blend", ".fig", ".raw"}
    for content_root in [projects_dir, creatives_dir]:
        if content_root.exists():
            for f in content_root.rglob("*"):
                if f.is_file():
                    if f.suffix.lower() in binary_extensions:
                        hard_errors.append(f"Binary file detected `{f.name}`: Media files must NOT be committed to Git. Please upload to an external CDN (e.g. Unsplash, YouTube, Figma, Penpot) and link in the markdown frontmatter.")
                    elif not f.name.endswith(".md") and not f.name.startswith("."):
                        hard_errors.append(f"Invalid file extension `{f.name}`: Must strictly have `.md` extension.")

    # 2. Validate Code Projects
    if projects_dir.exists():
        proj_files = [f for f in projects_dir.glob("*.md") if f.name != "_template.md"]
        for f in proj_files:
            text = f.read_text(encoding="utf-8")
            if not text.startswith("---"):
                hard_errors.append(f"content/projects/{f.name}: Missing frontmatter opening delimiter (---)")
                continue

            # Ensure frontmatter is properly closed
            lines_after_first = text.splitlines()[1:]
            if not any(l.strip() == "---" for l in lines_after_first):
                hard_errors.append(f"content/projects/{f.name}: Missing frontmatter closing delimiter (---). Metadata must be enclosed between two `---` markers.")

            # Check for accidental markdown headers on keys e.g. ## name:
            if re.search(r"^\s*#+\s*[a-zA-Z0-9_-]+\s*:", text, re.MULTILINE):
                hard_errors.append(f"content/projects/{f.name}: Frontmatter keys must not have heading markers (`#`). Use `name: ...` instead of `## name: ...`.")

            if "<script" in text.lower():
                hard_errors.append(f"content/projects/{f.name}: Malicious or unsafe `<script>` tags are strictly prohibited.")

            if "name:" not in text:
                hard_errors.append(f"content/projects/{f.name}: Missing required field `name:`")
            if "repo_url:" not in text:
                hard_errors.append(f"content/projects/{f.name}: Missing required field `repo_url:`")
            if "author:" not in text:
                hard_errors.append(f"content/projects/{f.name}: Missing required field `author:`")

            url_match = re.search(r"repo_url:\s*[\"']?(https://github\.com/([a-zA-Z0-9_-]+)/([a-zA-Z0-9._-]+))[\"']?", text)
            if not url_match:
                hard_errors.append(f"content/projects/{f.name}: Invalid GitHub `repo_url` (must be https://github.com/owner/repository)")
                continue

            repo_owner = url_match.group(2)
            repo_name = url_match.group(3).replace(".git", "")
            repo_url = url_match.group(1).rstrip("/")

            name_match = re.search(r"name:\s*[\"']?([^\"\n\r]+)[\"']?", text)
            author_match = re.search(r"author:\s*[\"']?@?([a-zA-Z0-9_-]+)[\"']?", text)
            batch_match = re.search(r"batch:\s*[\"']?([^\"\n\r]+)[\"']?", text)
            tech_match = re.search(r"tech_stack:\s*\[(.*?)\]", text)

            author_str = author_match.group(1).strip() if author_match else "Unknown"
            author_lower = author_str.lower()
            authors[author_lower] = authors.get(author_lower, 0) + 1
            if authors[author_lower] > 5:
                hard_errors.append(f"content/projects/{f.name}: Author @{author_str} has exceeded the submission limit.")

            # Supervised Check: Query GitHub API
            api_url = f"https://api.github.com/repos/{repo_owner}/{repo_name}"
            headers = {"User-Agent": "FOSS-RIT-PR-Validator/2.0"}
            if token:
                headers["Authorization"] = f"Bearer {token}"

            live_status_badge = "Pending verification"
            warning_notice = ""

            req = urllib.request.Request(api_url, headers=headers)
            try:
                with urllib.request.urlopen(req, timeout=8) as resp:
                    if resp.status == 200:
                        repo_payload = json.loads(resp.read().decode("utf-8"))
                        live_stars = repo_payload.get("stargazers_count", 0)
                        live_forks = repo_payload.get("forks_count", 0)
                        live_status_badge = f"Public Repository (Stars: {live_stars} | Forks: {live_forks})"
            except urllib.error.HTTPError as he:
                if he.code == 404:
                    live_status_badge = "404 Not Found (Action Required)"
                    warning_notice = (
                        f"> [!WARNING]\n"
                        f"> **Repository Returned 404 Not Found:** `{repo_url}` is private or does not exist.\n"
                        f"> Ask @{author_str} to ensure the repo is Public."
                    )
                elif he.code == 403:
                    live_status_badge = "Rate limit reached (Manually verifiable)"
                else:
                    live_status_badge = f"HTTP {he.code} during check"
            except Exception:
                live_status_badge = "Check bypassed"

            proj_name = name_match.group(1).strip() if name_match else f.stem
            batch_str = batch_match.group(1).strip() if batch_match else "2026"
            tech_str = tech_match.group(1).strip() if tech_match else "Code"

            card = f"""### Project Review: {proj_name}
- **Submitted by:** @{author_str} (Batch: {batch_str})
- **Repository:** [{repo_url}]({repo_url})
- **Status:** {live_status_badge}
- **Tech Stack:** `{tech_str}`

{warning_notice}
#### Maintainer Checklist:
- [ ] Public repository with original code.
- [ ] README present explaining the project.
- [ ] Contributor @{author_str} is an authentic student maker."""
            summary_cards.append(card)

    # 3. Validate Creative Showcases
    if creatives_dir.exists():
        creative_files = [f for f in creatives_dir.glob("*.md") if f.name != "_template.md"]
        for f in creative_files:
            text = f.read_text(encoding="utf-8")
            if not text.startswith("---"):
                hard_errors.append(f"content/creatives/{f.name}: Missing frontmatter opening delimiter (---)")
                continue

            # Ensure frontmatter is properly closed
            lines_after_first = text.splitlines()[1:]
            if not any(l.strip() == "---" for l in lines_after_first):
                hard_errors.append(f"content/creatives/{f.name}: Missing frontmatter closing delimiter (---). Metadata must be enclosed between two `---` markers.")

            if re.search(r"^\s*#+\s*[a-zA-Z0-9_-]+\s*:", text, re.MULTILINE):
                hard_errors.append(f"content/creatives/{f.name}: Frontmatter keys must not have heading markers (`#`).")

            if "<script" in text.lower():
                hard_errors.append(f"content/creatives/{f.name}: Malicious `<script>` tags are strictly prohibited.")

            title_match = re.search(r"title:\s*[\"']?([^\"\n\r]+)[\"']?", text)
            cat_match = re.search(r"(?:category|type):\s*[\"']?([a-zA-Z0-9_-]+)[\"']?", text)
            author_match = re.search(r"author:\s*[\"']?@?([a-zA-Z0-9_-]+)[\"']?", text)
            tools_match = re.search(r"tools:\s*\[(.*?)\]", text)
            media_match = re.search(r"media_url:\s*[\"']?([^\"\n\r]+)[\"']?", text)

            if not title_match:
                hard_errors.append(f"content/creatives/{f.name}: Missing required field `title:`")
            if not author_match:
                hard_errors.append(f"content/creatives/{f.name}: Missing required field `author:`")
            if not media_match:
                hard_errors.append(f"content/creatives/{f.name}: Missing required field `media_url:`")

            creative_title = title_match.group(1).strip() if title_match else f.stem
            category_str = cat_match.group(1).strip() if cat_match else "Design"
            author_str = author_match.group(1).strip() if author_match else "Unknown"
            tools_str = tools_match.group(1).strip() if tools_match else "Creative Tools"
            media_url_str = media_match.group(1).strip() if media_match else "#"

            card = f"""### Creative Showcase Review: {creative_title}
- **Category:** {category_str.title()}
- **Creator:** @{author_str}
- **Tools:** `{tools_str}`
- **Media Link:** [{media_url_str}]({media_url_str})

#### Maintainer Checklist:
- [ ] Preview link is accessible and authentic student creative work.
- [ ] Appropriate Creative Commons or open-source license declared.
- [ ] No copyrighted assets used without permission."""
            summary_cards.append(card)

    if hard_errors:
        error_items = "\n".join([f"- {err}" for err in hard_errors])
        error_card = f"""> [!CAUTION]\n> ### Validation Failed\n> Please resolve the following issues:\n>\n{error_items}"""
        summary_cards.insert(0, error_card)

    summary_md = "\n\n---\n\n".join(summary_cards)

    step_summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if step_summary_path:
        try:
            with open(step_summary_path, "a", encoding="utf-8") as ss:
                ss.write(summary_md + "\n")
        except Exception:
            pass

    with open("pr_summary.md", "w", encoding="utf-8") as sf:
        sf.write(summary_md)

    if hard_errors:
        print("Hard Validation Errors Found:")
        for e in hard_errors:
            print(f"  - {e}")
        sys.exit(1)

    print("All project and creative files passed syntax and format checks!")

if __name__ == "__main__":
    validate()
