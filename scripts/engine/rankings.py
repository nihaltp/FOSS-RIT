"""
Contributor ranking, XP calculation, and badge engine.
Supports unified metrics for both software builders and creative makers.
"""

def compute_contributor_rank(user_data: dict, projects: list, creatives: list) -> dict:
    """Calculate Boot.dev RPG XP, character tiers, progress, and badges."""
    is_verified = user_data.get("is_verified_student", False)
    proj_count = len(projects)
    creative_count = len(creatives)
    total_stars = sum(p.get("stars", 0) for p in projects)
    total_forks = sum(p.get("forks", 0) for p in projects)

    all_techs = set()
    for p in projects:
        for t in p.get("tech_stack", []):
            all_techs.add(t.lower())

    creative_tools = set()
    creative_categories = set()
    for c in creatives:
        creative_categories.add(c.get("category", "").lower())
        for tool in c.get("tools", []):
            creative_tools.add(tool.lower())

    # --- XP Balancing Rules ---
    xp = 0
    if is_verified:
        xp += 50  # Campus student verified

    # Project submission XP: progressive scaling
    if proj_count >= 1:
        xp += 100
    if proj_count >= 2:
        xp += 60
    if proj_count >= 3:
        xp += 40
    if proj_count > 3:
        xp += (proj_count - 3) * 25

    # Creative submission XP: progressive scaling
    if creative_count >= 1:
        xp += 100
    if creative_count >= 2:
        xp += 60
    if creative_count >= 3:
        xp += 40
    if creative_count > 3:
        xp += (creative_count - 3) * 25

    # Peer engagement XP: Stars & Forks capped per repository to reward authentic impact and prevent gaming
    for p in projects:
        # Forks: 20 XP per fork, capped at 100 XP per repo (prevents bot/self-fork spamming)
        xp += min(p.get("forks", 0) * 20, 100)
        # Stars: 10 XP per star, capped at 150 XP per repo (rewards community appreciation with safe upper limit)
        xp += min(p.get("stars", 0) * 10, 150)

    # Tech stack & tool versatility
    xp += min(len(all_techs) * 15, 60)
    xp += min(len(creative_tools) * 15, 60)

    # FOSS creative tool adoption bonus
    foss_tools = {"penpot", "blender", "krita", "gimp", "inkscape", "kdenlive", "rawtherapee", "darktable"}
    if any(t in foss_tools for t in creative_tools):
        xp += 40

    # --- Level & Tier Mapping ---
    if xp >= 1500:
        level, title, min_xp, max_xp = 5, "Kernel Overlord", 1500, 3000
    elif xp >= 700:
        level, title, min_xp, max_xp = 4, "Systems Architect", 700, 1499
    elif xp >= 300:
        level, title, min_xp, max_xp = 3, "Byte Craftsman", 300, 699
    elif xp >= 100:
        level, title, min_xp, max_xp = 2, "Open Source Novice", 100, 299
    else:
        level, title, min_xp, max_xp = 1, "Script Tinkerer", 0, 99

    tier_range = max(max_xp - min_xp, 1)
    progress = min(max(int(((xp - min_xp) / tier_range) * 100), 0), 100)

    # --- Achievement Badges ---
    badges = []
    if is_verified:
        badges.append({"id": "verified", "name": "Campus Verified", "icon": "🎓", "color": "#08B74F"})
    if proj_count >= 1:
        badges.append({"id": "first_ship", "name": "First Ship", "icon": "🚀", "color": "#2B7FFF"})
    if proj_count + creative_count >= 3:
        badges.append({"id": "trilogy", "name": "The Trilogy", "icon": "🔱", "color": "#F5C040"})
    if total_forks >= 3:
        badges.append({"id": "peer_forked", "name": "Peer Forked", "icon": "🍴", "color": "#A855F7"})
    if len(all_techs) >= 3:
        badges.append({"id": "polyglot", "name": "Polyglot", "icon": "⚡", "color": "#EC4899"})
    if total_stars >= 10:
        badges.append({"id": "star_hunter", "name": "Star Hunter", "icon": "⭐", "color": "#EAB308"})
    
    # Creative Badges
    if "design" in creative_categories:
        badges.append({"id": "pixel_architect", "name": "Pixel Architect", "icon": "🎨", "color": "#38BDF8"})
    if "photography" in creative_categories:
        badges.append({"id": "lens_master", "name": "Lens Master", "icon": "📸", "color": "#FB923C"})
    if "video" in creative_categories:
        badges.append({"id": "frame_crafter", "name": "Frame Crafter", "icon": "🎬", "color": "#F43F5E"})
    if "3d" in creative_categories or any("blender" in t for t in creative_tools):
        badges.append({"id": "artisan_3d", "name": "3D Artisan", "icon": "🧊", "color": "#F97316"})
    if any(t in foss_tools for t in creative_tools):
        badges.append({"id": "foss_purist", "name": "Open Creator", "icon": "🐧", "color": "#10B981"})

    return {
        "xp": xp,
        "level": level,
        "title": title,
        "min_xp": min_xp,
        "max_xp": max_xp,
        "progress": progress,
        "total_projects": proj_count,
        "total_creatives": creative_count,
        "total_stars": total_stars,
        "total_forks": total_forks,
        "badges": badges
    }

def generate_leaderboard(contributors_map: dict) -> dict:
    """Compile and rank all contributors."""
    ranked_list = []
    for author_key, c_data in contributors_map.items():
        stats = compute_contributor_rank(c_data, c_data.get("projects", []), c_data.get("creatives", []))
        ranked_list.append({
            "user_id": f"usr-{author_key}",
            "username": c_data["username"],
            "display_name": c_data["display_name"],
            "avatar_url": c_data["avatar_url"],
            "is_verified_student": c_data["is_verified_student"],
            "xp": stats["xp"],
            "level": stats["level"],
            "title": stats["title"],
            "min_xp": stats["min_xp"],
            "max_xp": stats["max_xp"],
            "progress": stats["progress"],
            "total_projects": stats["total_projects"],
            "total_creatives": stats["total_creatives"],
            "total_stars": stats["total_stars"],
            "total_forks": stats["total_forks"],
            "badges": stats["badges"]
        })

    # Sort contributors primarily by XP.
    # Tie-breakers: total works shipped > total peer impact (stars + forks) > verified status
    ranked_list.sort(
        key=lambda x: (
            x["xp"],
            x["total_projects"] + x["total_creatives"],
            x["total_forks"] + x["total_stars"],
            1 if x.get("is_verified_student") else 0
        ),
        reverse=True
    )

    # Assign Rank & Medals
    for idx, c in enumerate(ranked_list):
        c["rank"] = idx + 1
        if c["rank"] == 1:
            c["medal"] = "🥇"
        elif c["rank"] == 2:
            c["medal"] = "🥈"
        elif c["rank"] == 3:
            c["medal"] = "🥉"
        else:
            c["medal"] = f"#{c['rank']}"

    return {
        "status": "success",
        "timeframe": "all_time",
        "total_contributors": len(ranked_list),
        "contributors": ranked_list
    }
