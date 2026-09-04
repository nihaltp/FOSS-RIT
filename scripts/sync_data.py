#!/usr/bin/env python3
"""
FOSS Club RIT - GitOps Data, Events & Creative Telemetry Coordinator
Coordinates modular engines to emit static JSON feeds for frontend edge delivery.
"""

import os
import sys
import json
from pathlib import Path

# Ensure scripts directory is in python path
SCRIPTS_DIR = Path(__file__).resolve().parent
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

from engine.utils import (
    CONTENT_PROJECTS_DIR,
    CONTENT_CREATIVES_DIR,
    FRONTEND_DATA_DIR,
    FRONTEND_PUBLIC_DIR
)
from engine.projects import sync_projects
from engine.creatives import sync_creatives
from engine.events import sync_events
from engine.rankings import generate_leaderboard

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "").strip()

def main():
    print("[GitOps Coordinator] Starting FOSS Club RIT data synchronization...")

    # 1. Sync Code Projects
    projects = sync_projects(CONTENT_PROJECTS_DIR, GITHUB_TOKEN)

    # 2. Sync Creative Media Showcases
    creatives = sync_creatives(CONTENT_CREATIVES_DIR)

    # 3. Build Unified Contributor Map (Developers & Creatives)
    contributors_map = {}

    for p in projects:
        author = p.get("submitted_by_username", "rit-maker").lower()
        if author not in contributors_map:
            contributors_map[author] = {
                "username": p.get("submitted_by_username", author),
                "display_name": p.get("submitted_by_name", author),
                "avatar_url": f"https://github.com/{author}.png",
                "is_verified_student": p.get("is_verified_student", True),
                "projects": [],
                "creatives": []
            }
        contributors_map[author]["projects"].append(p)

    for c in creatives:
        author = c.get("author", "rit-creator").lower()
        if author not in contributors_map:
            contributors_map[author] = {
                "username": c.get("author", author),
                "display_name": c.get("author_name", author),
                "avatar_url": c.get("avatar_url") or f"https://github.com/{author}.png",
                "is_verified_student": c.get("is_verified_student", True),
                "projects": [],
                "creatives": []
            }
        contributors_map[author]["creatives"].append(c)

    # 4. Generate Leaderboard Rankings & RPG Badges
    leaderboard_payload = generate_leaderboard(contributors_map)

    # 5. Scrape Live TinkerHub Campus Workshops
    print("[GitOps Coordinator] Fetching campus workshops & events...")
    live_events = sync_events()

    # 6. Emit Pre-computed Static JSON Feeds
    FRONTEND_DATA_DIR.mkdir(parents=True, exist_ok=True)
    FRONTEND_PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    payloads = {
        "projects.json": projects,
        "creatives.json": creatives,
        "events.json": live_events,
        "leaderboard.json": leaderboard_payload
    }

    for filename, data in payloads.items():
        for out_dir in [FRONTEND_DATA_DIR, FRONTEND_PUBLIC_DIR]:
            (out_dir / filename).write_text(json.dumps(data, indent=2), encoding="utf-8")

    print(f"[GitOps Coordinator] Sync complete: {len(projects)} repos, {len(creatives)} creative works, {len(leaderboard_payload['contributors'])} makers, and {len(live_events)} events.")

if __name__ == "__main__":
    main()
