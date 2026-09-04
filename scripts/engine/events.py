"""
TinkerHub campus event scraper & synchronizer.
"""

import os
import re
import json
import urllib.request
import urllib.error
from datetime import datetime
from .utils import format_event_date

TINKERHUB_CAMPUS_URL = os.environ.get(
    "TINKERHUB_CAMPUS_URL",
    "https://tinkerhub.org/campus/2160/Rajiv%20Gandhi%20Institute%20of%20Technology,%20Velloor"
)

def get_default_events() -> list:
    """Standard starter events if TinkerHub scraper is unreachable."""
    return [
        {
            "id": "th-rit-1",
            "title": "Git & GitHub 101: Your First Open Source PR",
            "description": "Hands-on workshop in collaboration with TinkerHub RIT. Learn branching, fork-and-pull workflows, and make your first open source contribution.",
            "date_time": "Saturday, Aug 29, 2026 • 1:30 PM - 4:30 PM",
            "location": "MCA Seminar Hall, RIT Kottayam",
            "capacity": 80,
            "registered_count": 38,
            "is_open": True,
            "is_collab": True,
            "source": "tinkerhub",
            "event_type": "Workshop",
            "event_url": TINKERHUB_CAMPUS_URL
        },
        {
            "id": "th-rit-2",
            "title": "Meet the Maker: From Beginner to Open Source Hacker",
            "description": "Interactive talk session on building in public, campus maker culture, and shipping FOSS projects.",
            "date_time": "Thursday, Sep 03, 2026 • 2:30 PM",
            "location": "Google Meet Virtual Session",
            "capacity": 80,
            "registered_count": 0,
            "is_open": True,
            "is_collab": True,
            "source": "tinkerhub",
            "event_type": "Talk Session",
            "meet_url": "https://meet.google.com/mrj-csgy-mez",
            "event_url": TINKERHUB_CAMPUS_URL
        },
        {
            "id": "th-rit-3",
            "title": "TinkerHack '26: 24hr Campus FOSS Hackathon",
            "description": "Our annual 24-hour hackathon co-hosted with TinkerHub. Build open-source software solutions for campus and public good.",
            "date_time": "Sep 25 - Sep 26, 2026 • 24 Hours",
            "location": "Central Computing Facility, RIT Kottayam",
            "capacity": 100,
            "registered_count": 52,
            "is_open": True,
            "is_collab": True,
            "source": "tinkerhub",
            "event_type": "Hackathon",
            "event_url": TINKERHUB_CAMPUS_URL
        }
    ]

def scrape_live_tinkerhub_events(campus_url: str = TINKERHUB_CAMPUS_URL) -> list:
    """Scrape real upcoming and past workshops from TinkerHub RIT Campus."""
    req = urllib.request.Request(
        campus_url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=12) as response:
            html = response.read().decode("utf-8", errors="ignore")
            m = re.search(r'<script[^>]*id="__NUXT_DATA__"[^>]*>(.*?)</script>', html, re.DOTALL)
            if not m:
                return []
            
            data = json.loads(m.group(1))
            seen = {}
            def resolve(val):
                if val is None:
                    return None
                if isinstance(val, int):
                    if val in seen:
                        return seen[val]
                    if 0 <= val < len(data):
                        item = data[val]
                        if isinstance(item, (str, bool, float)) or item is None:
                            seen[val] = item
                            return item
                        if isinstance(item, list):
                            resolved_list = [resolve(x) for x in item]
                            seen[val] = resolved_list
                            return resolved_list
                        if isinstance(item, dict):
                            resolved_dict = {k: resolve(v) for k, v in item.items()}
                            seen[val] = resolved_dict
                            return resolved_dict
                    return val
                if isinstance(val, list):
                    return [resolve(x) for x in val]
                if isinstance(val, dict):
                    return {k: resolve(v) for k, v in val.items()}
                return val

            events = []
            for item in data:
                if isinstance(item, dict) and "name" in item and ("startDate" in item or "meetUrl" in item or "type" in item or "uniqueId" in item):
                    name_val = resolve(item.get("name"))
                    desc_val = resolve(item.get("description"))
                    start_date = resolve(item.get("startDate"))
                    end_date = resolve(item.get("endDate"))
                    banner = resolve(item.get("banner"))
                    location_val = resolve(item.get("location"))
                    event_type = resolve(item.get("type"))
                    is_virtual = resolve(item.get("isVirtual"))
                    unique_id = resolve(item.get("uniqueId")) or resolve(item.get("id"))
                    meet_url = resolve(item.get("meetUrl"))
                    number_of_seats = resolve(item.get("numberOfSeats")) or 80
                    
                    if name_val and isinstance(name_val, str) and len(name_val.strip()) > 2 and "Rajiv Gandhi" not in name_val:
                        mode = "virtual" if is_virtual else "offline"
                        raw_type = str(event_type).replace("_", " ").title() if event_type else "Workshop"
                        
                        # Determine if event is upcoming
                        is_upcoming = False
                        if start_date and isinstance(start_date, str):
                            try:
                                clean_start = start_date.replace("Z", "+00:00")
                                dt_start = datetime.fromisoformat(clean_start)
                                if dt_start.timestamp() > datetime.now().timestamp() - 86400:
                                    is_upcoming = True
                            except Exception:
                                pass

                        events.append({
                            "id": f"th-rit-{str(unique_id or len(events))}",
                            "title": name_val.strip(),
                            "description": desc_val if (desc_val and isinstance(desc_val, str)) else "Campus session organized by TinkerHub RIT & FOSS Club.",
                            "date_time": format_event_date(start_date),
                            "raw_date": start_date if isinstance(start_date, str) else "",
                            "location": location_val or ("Google Meet Virtual Session" if is_virtual else "RIT Kottayam Campus (Velloor)"),
                            "capacity": number_of_seats if isinstance(number_of_seats, int) else 80,
                            "registered_count": 0,
                            "is_open": True,
                            "is_collab": True,
                            "is_upcoming": is_upcoming,
                            "source": "tinkerhub",
                            "event_type": raw_type,
                            "meet_url": meet_url if (meet_url and isinstance(meet_url, str) and meet_url.startswith("http")) else None,
                            "event_url": f"https://tinkerhub.org/events/{unique_id}" if (unique_id and str(unique_id).isalnum()) else campus_url,
                            "banner_url": banner if (banner and isinstance(banner, str) and banner.startswith("http")) else None
                        })
            
            # Sort: Upcoming events first
            events.sort(key=lambda ev: (1 if ev.get("is_upcoming") else 0, ev.get("raw_date") or ""), reverse=True)
            return events
    except Exception as e:
        print(f"[Events Scraper] Notice: {e}. Using fallback events.")
        return []

def sync_events(campus_url: str = TINKERHUB_CAMPUS_URL) -> list:
    """Scrape live TinkerHub events with fallback."""
    events = scrape_live_tinkerhub_events(campus_url)
    if not events:
        events = get_default_events()
    return events
