"""
Shared utilities for FOSS Club RIT GitOps engine.
"""

import re
from pathlib import Path
from datetime import datetime

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
CONTENT_PROJECTS_DIR = ROOT_DIR / "content" / "projects"
CONTENT_CREATIVES_DIR = ROOT_DIR / "content" / "creatives"
FRONTEND_DATA_DIR = ROOT_DIR / "frontend" / "src" / "data"
FRONTEND_PUBLIC_DIR = ROOT_DIR / "frontend" / "public" / "data"

def parse_markdown_frontmatter(file_path: Path) -> dict:
    """Parse YAML-style frontmatter from a markdown file."""
    try:
        content = file_path.read_text(encoding="utf-8")
    except Exception as e:
        print(f"[Error] Failed to read {file_path}: {e}")
        return {}

    match = re.match(r"^---\s*\n(.*?)\n---\s*\n", content, re.DOTALL)
    if not match:
        return {}

    frontmatter_raw = match.group(1)
    data = {}
    
    for line in frontmatter_raw.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if ":" in line:
            key, val = line.split(":", 1)
            key = key.strip()
            val = val.strip().strip('"').strip("'")
            
            # Parse bracketed list syntax e.g. ["Penpot", "Figma"]
            if val.startswith("[") and val.endswith("]"):
                items = [item.strip().strip('"').strip("'") for item in val[1:-1].split(",") if item.strip()]
                data[key] = items
            elif val.lower() == "true":
                data[key] = True
            elif val.lower() == "false":
                data[key] = False
            else:
                data[key] = val

    # Also capture body text if any
    body = content[match.end():].strip()
    if body and "description" not in data:
        data["description"] = body

    return data

def format_event_date(start_date_raw: str) -> str:
    """Format ISO date string to human-friendly format."""
    if not start_date_raw or not isinstance(start_date_raw, str):
        return "Upcoming Session"
    try:
        clean_ts = start_date_raw.replace("Z", "+00:00")
        dt = datetime.fromisoformat(clean_ts)
        month_name = dt.strftime("%b")
        day = dt.strftime("%d").lstrip("0")
        year = dt.strftime("%Y")
        time_str = dt.strftime("%I:%M %p").lstrip("0") + " IST"
        return f"{month_name} {day}, {year} • {time_str}"
    except Exception:
        return str(start_date_raw)
