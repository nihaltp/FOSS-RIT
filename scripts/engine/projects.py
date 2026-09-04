"""
Project & GitHub repository telemetry engine.
"""

import re
import json
import urllib.request
import urllib.error
from pathlib import Path
from .utils import parse_markdown_frontmatter, CONTENT_PROJECTS_DIR

def fetch_github_repo_telemetry(repo_url: str, token: str = "") -> dict:
    """Fetch live star, fork, and issue counts for a GitHub repository."""
    match = re.search(r"github\.com/([^/]+)/([^/]+)", repo_url.rstrip("/"))
    if not match:
        return {"stars": 0, "forks": 0, "open_issues": 0, "language": "Code"}

    owner, repo = match.group(1), match.group(2).replace(".git", "")
    api_url = f"https://api.github.com/repos/{owner}/{repo}"

    headers = {"User-Agent": "FOSS-Club-RIT-Telemetry/2.0"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    req = urllib.request.Request(api_url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=8) as response:
            if response.status == 200:
                payload = json.loads(response.read().decode("utf-8"))
                open_issues = payload.get("open_issues_count", 0)
                
                # Exclude pull requests from issue count if possible
                if open_issues > 0:
                    pulls_url = f"https://api.github.com/repos/{owner}/{repo}/pulls?state=open&per_page=1"
                    pulls_req = urllib.request.Request(pulls_url, headers=headers)
                    pulls_count = 0
                    try:
                        with urllib.request.urlopen(pulls_req, timeout=5) as p_res:
                            if p_res.status == 200:
                                pulls_data = json.loads(p_res.read().decode("utf-8"))
                                if not pulls_data:
                                    pulls_count = 0
                                else:
                                    link_header = p_res.getheader('Link')
                                    if link_header:
                                        last_match = re.search(r'<[^>]+[?&]page=(\d+)[^>]*>;\s*rel="last"', link_header)
                                        if last_match:
                                            pulls_count = int(last_match.group(1))
                                        else:
                                            pulls_count = 1
                                    else:
                                        pulls_count = 1
                    except Exception:
                        pass
                    open_issues = max(0, open_issues - pulls_count)

                return {
                    "stars": payload.get("stargazers_count", 0),
                    "forks": payload.get("forks_count", 0),
                    "open_issues": open_issues,
                    "language": payload.get("language") or "Code",
                    "pushed_at": payload.get("pushed_at", "")
                }
    except Exception as err:
        print(f"[Telemetry] Notice for {owner}/{repo}: {err}. Using fallback metrics.")

    return {"stars": 0, "forks": 0, "open_issues": 0, "language": "Code"}

def sync_projects(content_dir: Path = CONTENT_PROJECTS_DIR, token: str = "") -> list:
    """Scan and process all project markdown files."""
    if not content_dir.exists():
        content_dir.mkdir(parents=True, exist_ok=True)

    projects = []
    md_files = [f for f in content_dir.glob("*.md") if f.name != "_template.md"]
    print(f"[GitOps Engine] Found {len(md_files)} project markdown files.")

    for f in sorted(md_files):
        fm = parse_markdown_frontmatter(f)
        if not fm.get("name") or not fm.get("repo_url"):
            print(f"[GitOps Engine] Skipping invalid file: {f.name}")
            continue

        repo_url = fm["repo_url"]
        telemetry = fetch_github_repo_telemetry(repo_url, token)

        author = fm.get("author", "rit-maker").strip().lstrip("@")
        author_name = fm.get("author_name") or author

        proj_id = f"proj-{f.stem.lower()}"
        tech_stack = fm.get("tech_stack") or [telemetry["language"]]
        if isinstance(tech_stack, str):
            tech_stack = [tech_stack]

        proj_obj = {
            "id": proj_id,
            "name": fm["name"],
            "description": fm.get("description", "Open source software built at RIT Kottayam."),
            "repo_url": repo_url,
            "tech_stack": tech_stack,
            "stars": telemetry["stars"],
            "forks": telemetry["forks"],
            "open_issues": telemetry["open_issues"],
            "is_verified_student": fm.get("is_verified_student", True),
            "submitted_by_username": author,
            "submitted_by_name": author_name,
            "batch": str(fm.get("batch", "2026")),
            "featured": fm.get("featured", True)
        }
        projects.append(proj_obj)

    # Sort projects by stars descending
    projects.sort(key=lambda p: p["stars"], reverse=True)
    return projects
