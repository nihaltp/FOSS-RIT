"""
Creative showcase ingestion & media telemetry engine.
Handles UI/UX designs, photography, video edits, and 3D artwork.
"""

import re
from pathlib import Path
from .utils import parse_markdown_frontmatter, CONTENT_CREATIVES_DIR

def extract_youtube_id(url: str) -> str | None:
    """Extract standard 11-character YouTube video ID from various YouTube URL formats."""
    if not url:
        return None
    if "youtube.com" not in url and "youtu.be" not in url:
        return None
    patterns = [
        r"(?:v=|\/embed\/|\/v\/|youtu\.be\/|\/shorts\/)([0-9A-Za-z_-]{11})",
        r"youtube\.com\/watch\?.*v=([0-9A-Za-z_-]{11})"
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

def normalize_tools(tools_raw) -> list:
    """Normalize tools list from string or list input."""
    if isinstance(tools_raw, list):
        return [str(t).strip() for t in tools_raw if str(t).strip()]
    if isinstance(tools_raw, str):
        return [t.strip() for t in tools_raw.split(",") if t.strip()]
    return ["Creative Tools"]

def sync_creatives(content_dir: Path = CONTENT_CREATIVES_DIR) -> list:
    """Scan and process all creative showcase markdown files."""
    if not content_dir.exists():
        content_dir.mkdir(parents=True, exist_ok=True)

    creatives = []
    md_files = [f for f in content_dir.glob("*.md") if f.name != "_template.md"]
    print(f"[GitOps Engine] Found {len(md_files)} creative showcase markdown files.")

    for f in sorted(md_files):
        fm = parse_markdown_frontmatter(f)
        title = fm.get("title") or fm.get("name")
        if not title:
            print(f"[GitOps Engine] Skipping invalid creative file: {f.name}")
            continue

        media_url = fm.get("media_url") or fm.get("live_url") or fm.get("image_url") or ""
        thumbnail_url = fm.get("thumbnail_url") or fm.get("cover_image") or ""
        category = str(fm.get("category") or fm.get("type") or "design").lower()

        # Extract YouTube ID & generate cover if video
        youtube_id = fm.get("youtube_id") or extract_youtube_id(media_url)
        if youtube_id:
            category = "video"
            if not thumbnail_url:
                thumbnail_url = f"https://img.youtube.com/vi/{youtube_id}/maxresdefault.jpg"

        author = fm.get("author", "rit-creator").strip().lstrip("@")
        author_name = fm.get("author_name") or author

        tools = normalize_tools(fm.get("tools"))
        aspect_ratio = fm.get("aspect_ratio") or ("16:9" if category == "video" else ("3:2" if category == "photography" else "16:9"))

        creative_obj = {
            "id": f"creative-{f.stem.lower()}",
            "title": title,
            "description": fm.get("description", "Creative work crafted at RIT Kottayam."),
            "category": category, # 'design' | 'photography' | 'video' | '3d'
            "author": author,
            "author_name": author_name,
            "avatar_url": fm.get("avatar_url") or f"https://github.com/{author}.png",
            "batch": str(fm.get("batch", "2026")),
            "department": fm.get("department", "Campus"),
            "tools": tools,
            "license": fm.get("license", "CC-BY-4.0"),
            "media_url": media_url,
            "thumbnail_url": thumbnail_url,
            "youtube_id": youtube_id,
            "aspect_ratio": aspect_ratio,
            "duration": fm.get("duration"),
            "camera_meta": fm.get("camera_meta") if isinstance(fm.get("camera_meta"), dict) else None,
            "is_verified_student": fm.get("is_verified_student", True),
            "featured": fm.get("featured", True)
        }
        creatives.append(creative_obj)

    return creatives
