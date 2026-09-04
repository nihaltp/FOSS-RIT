# FOSS Club — RIT Kottayam

> [**Overview**](README.md) • [**Contributing Guide**](CONTRIBUTING.md) • [**Maintainer Handbook**](MAINTAINER_GUIDE.md) • [**Future Scaling Blueprint**](FUTURE_PLAN.md) • [**License**](LICENSE)

The official community platform for the Free and Open Source Software (FOSS) Club at Rajiv Gandhi Institute of Technology (RIT), Government Engineering College, Kottayam, in collaboration with the [TinkerHub Foundation](https://tinkerhub.org) (Campus Chapter 2160).

**Motto:** *Learn. Share. Contribute.*

---

## What Can You Feature on the Platform?

We showcase all student makers and creators across campus:
1. **Code Repositories (`content/projects/`):** Web apps, AI models, mobile apps, hardware firmware, and automation scripts.
2. **Creative Showcases (`content/creatives/`):** UI/UX design systems (Penpot/Figma), event photography series, video aftermovies/teasers (DaVinci Resolve/Kdenlive), and 3D artwork (Blender).

---

## How to Feature Your Work (3-Step GitOps Flow)

You do not need to install local development tools. Submissions are processed via simple Markdown Pull Requests.

### Step 1: Fork This Repository
1. Click the **Fork** button at the top right of this repository ([github.com/vertigotalks7/FOSS-RIT](https://github.com/vertigotalks7/FOSS-RIT)).
2. This creates your personal copy of the project.

### Step 2: Add Your Markdown File
Choose the appropriate directory:

- **For Software / Code Projects:** Create `content/projects/<project-name>.md`
- **For Design, Photo, Video & 3D:** Create `content/creatives/<work-name>.md`

#### Template A: Code Project (`content/projects/smart-parking.md`)
```markdown
---
name: "Smart Campus Parking Radar"
description: "IoT sensor and computer vision system tracking real-time parking space occupancy at RIT."
repo_url: "https://github.com/your-username/smart-parking"
tech_stack: ["Python", "OpenCV", "React"]
author: "your-github-username"
author_name: "Your Full Name"
is_verified_student: true
batch: "2026"
featured: true
---

### About the Project
Summary of what the project does, key features, and how to run it.
```

#### Template B: Creative Showcase (`content/creatives/campus-transit-ui.md`)
```markdown
---
title: "Campus Transit App Design System"
category: "design" # Options: design | photography | video | 3d
author: "your-github-or-handle"
author_name: "Your Full Name"
batch: "2026"
department: "CSE"
tools: ["Penpot", "Inkscape"]
media_url: "https://design.penpot.app/#/view/..."
thumbnail_url: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800"
aspect_ratio: "16:9" # Options: 16:9 | 3:2 | 1:1
license: "CC-BY-SA-4.0"
is_verified_student: true
featured: true
---

A modern, open design system for campus navigation and transit schedules.
```

### Step 3: Submit a Pull Request
1. Commit the file and open a **Pull Request** to `main`.
2. Automated GitHub Actions will validate your frontmatter, verify links, and block raw binary files to keep repository storage light.
3. Once approved and merged, your work automatically goes live on the website!

---

## Contributor Leaderboard & XP System

XP and achievement badges are awarded to developers and creative creators equally:

| Milestone / Metric | XP Award | Criteria |
| :--- | :--- | :--- |
| **Campus Verified** | `+50 XP` | Verified RIT student maker |
| **First Submission** | `+100 XP` | First project or creative showcase featured |
| **Additional Works** | `+75 XP` each | 2nd and 3rd featured works |
| **Peer Forks** | `+20 XP` per fork | When peers fork your repository |
| **GitHub Stars** | `+5 XP` per star | Capped at 100 XP per project |
| **Tool / Tech Versatility** | `+15 XP` | Bonus for exploring diverse stacks & creative tools |
| **Open Tool Bonus** | `+30 XP` | Work made with FOSS tools (Penpot, Blender, Krita, Kdenlive) |

### Contributor Levels:
- **Level 1 (0 – 99 XP):** *Script Tinkerer*
- **Level 2 (100 – 299 XP):** *Open Source Novice*
- **Level 3 (300 – 699 XP):** *Byte Craftsman*
- **Level 4 (700 – 1499 XP):** *Systems Architect*
- **Level 5 (1500+ XP):** *Kernel Overlord*

---

## Documentation & Maintainer Guides

- [**Contributor Guide**](CONTRIBUTING.md): Detailed step-by-step submission rules.
- [**Maintainer Triage Guide**](MAINTAINER_GUIDE.md): Review checklist for club maintainers.
- [**Future Architecture Blueprint**](FUTURE_PLAN.md): Technical roadmap and scaling patterns.

---

## License

This project is open-source under the [MIT License](https://opensource.org/licenses/MIT).

- **Institution:** [Rajiv Gandhi Institute of Technology (RIT), Kottayam](https://rit.ac.in)
- **Partner Community:** [TinkerHub Foundation](https://tinkerhub.org)
- **Created & Maintained by:** [@vertigotalks7](https://github.com/vertigotalks7)
