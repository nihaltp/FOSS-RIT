#!/usr/bin/env python3
"""
publish_submission.py
---------------------
Parses a GitHub Issue Form submission body for creative works,
generates content/creatives/<slug>.md, and triggers sync_data.py.

Used by the .github/workflows/publish-showcase.yml automation when a maintainer
labels an issue as 'approved'.
"""

import os
import re
import sys
import argparse
import unicodedata
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from scripts.engine.utils import CONTENT_CREATIVES_DIR
from scripts.sync_data import main as run_sync


def slugify(value: str) -> str:
    """Normalizes string, converts to lowercase, removes non-alphanumerics, converts spaces to hyphens."""
    value = unicodedata.normalize('NFKD', str(value)).encode('ascii', 'ignore').decode('ascii')
    value = re.sub(r'[^\w\s-]', '', value.lower().strip())
    slug = re.sub(r'[-\s]+', '-', value)
    return slug or 'artwork'


def parse_issue_form_body(body_text: str) -> dict:
    """
    Parses GitHub Issue Form Markdown structure:
    ### Field Header
    Field Value
    """
    sections = {}
    current_header = None
    current_lines = []

    for line in body_text.splitlines():
        header_match = re.match(r'^###\s+(.+)$', line.strip())
        if header_match:
            if current_header:
                content = "\n".join(current_lines).strip()
                if content and content != "_No response_":
                    sections[current_header.lower()] = content
            current_header = header_match.group(1).strip()
            current_lines = []
        else:
            if current_header:
                current_lines.append(line)

    if current_header:
        content = "\n".join(current_lines).strip()
        if content and content != "_No response_":
            sections[current_header.lower()] = content

    return sections


def find_field(sections: dict, *candidates: str, default: str = "") -> str:
    """Finds section value by partial or full header match."""
    for cand in candidates:
        cand_lower = cand.lower()
        for key, val in sections.items():
            if cand_lower in key:
                return val
    return default


def process_submission(body_text: str, submitter_username: str = "", issue_title: str = "") -> str:
    """
    Parses issue body, generates markdown file in content/creatives/, and returns the file path.
    """
    sections = parse_issue_form_body(body_text)

    # Extract title from issue title or form body fallback
    clean_title = ""
    if issue_title:
        clean_title = re.sub(r'^\[Showcase\]:?\s*', '', issue_title, flags=re.IGNORECASE).strip()

    if not clean_title:
        clean_title = find_field(sections, "artwork / project title", "title", default="Untitled Artwork")

    title = clean_title or "Untitled Artwork"
    category = find_field(sections, "craft category", "category", default="design").lower()
    author_name = find_field(sections, "your full name", "name", default=submitter_username or "FOSS Maker")
    college_id = find_field(sections, "college roll", "student verification", default="")
    batch = find_field(sections, "graduation batch", "batch", default="2026")
    department = find_field(sections, "department", "branch", default="CSE")
    tools_raw = find_field(sections, "creative tools", "tools", default="Open Source Tools")
    media_url = find_field(sections, "media / preview url", "media url", default="")
    thumbnail_url = find_field(sections, "custom cover", "thumbnail", default="")
    aspect_ratio = find_field(sections, "aspect ratio", default="16:9")
    license_type = find_field(sections, "license", default="CC-BY-4.0")
    description = find_field(sections, "short description", "description", default="")

    # Clean category
    valid_categories = {"design", "photography", "video", "3d"}
    if category not in valid_categories:
        category = "design"

    # Clean tools into YAML list
    tools_list = [t.strip().strip("'\"") for t in re.split(r'[,/|]', tools_raw) if t.strip()]
    if not tools_list:
        tools_list = ["Penpot"]

    # Slugify filename
    slug = slugify(title)
    CONTENT_CREATIVES_DIR.mkdir(parents=True, exist_ok=True)
    target_file = CONTENT_CREATIVES_DIR / f"{slug}.md"

    # Handle collision
    counter = 2
    while target_file.exists():
        target_file = CONTENT_CREATIVES_DIR / f"{slug}-{counter}.md"
        counter += 1

    # Author handle
    author_handle = submitter_username or slugify(author_name)
    is_verified = bool(college_id.strip())

    # Build YAML content
    yaml_lines = [
        "---",
        f'title: "{title}"',
        f'category: "{category}"',
        f'author: "{author_handle}"',
        f'author_name: "{author_name}"',
        f'batch: "{batch}"',
        f'department: "{department}"',
        f"tools: {repr(tools_list)}",
        f'media_url: "{media_url}"',
    ]

    if thumbnail_url and thumbnail_url != "_No response_":
        yaml_lines.append(f'thumbnail_url: "{thumbnail_url}"')

    yaml_lines.extend([
        f'aspect_ratio: "{aspect_ratio}"',
        f'license: "{license_type}"',
        f'is_verified_student: {str(is_verified).lower()}',
        "featured: true",
        "---",
        "",
        description if description else f"Creative showcase by {author_name} ({department}, {batch}).",
        ""
    ])

    file_content = "\n".join(yaml_lines)
    target_file.write_text(file_content, encoding="utf-8")
    print(f"Created creative showcase entry: {target_file}")

    # Run data sync
    print("Running sync_data engine...")
    run_sync()

    return str(target_file)


def main():
    parser = argparse.ArgumentParser(description="Publish creative submission from issue form.")
    parser.add_argument("--body-file", help="Path to file containing raw issue body")
    parser.add_argument("--title", default="", help="Title of the GitHub issue")
    parser.add_argument("--user", default="", help="GitHub username of the submitter")
    args = parser.parse_args()

    if args.body_file:
        body_text = Path(args.body_file).read_text(encoding="utf-8")
    elif "ISSUE_BODY" in os.environ:
        body_text = os.environ["ISSUE_BODY"]
    else:
        # Read from stdin
        body_text = sys.stdin.read()

    issue_title = args.title or os.environ.get("ISSUE_TITLE", "")

    if not body_text.strip():
        print("Error: Issue body is empty.", file=sys.stderr)
        sys.exit(1)

    created_path = process_submission(body_text, submitter_username=args.user, issue_title=issue_title)
    print(f"Successfully published: {created_path}")


if __name__ == "__main__":
    main()
