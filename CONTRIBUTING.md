# Contributing to FOSS Club RIT

Welcome to the **FOSS Club RIT** community platform! We showcase open-source software, developer tools, UI/UX designs, event photography, video aftermovies, and 3D models created by students and alumni of **Rajiv Gandhi Institute of Technology (RIT Kottayam)**.

---

## Submission Methods

We offer two frictionless ways to submit your work:

### 1. 🎨 Fast Web Form (Recommended for Designers, Photographers & Video Editors)
If you don't use Git or terminal tools, you can submit via our visual GitHub Issue Form:
1. Open the [**Creative Showcase Submission Form**](https://github.com/vertigotalks7/FOSS-RIT/issues/new?template=creative-submission.yml).
2. Fill in your artwork title, craft category, tools used, media URL (YouTube, Figma, Penpot, Unsplash), and college KTU roll number.
3. Click **Submit new issue**.
4. Our club maintainers will review the preview and apply the `approved` label, which triggers our automated publisher bot to commit your file and update the live website!

*(Requires a free GitHub account — takes < 2 minutes to create).*

---

### 2. 💻 Git Pull Request (For Developers & Code Projects)

#### Step 1: Fork This Repository
Click the **Fork** button at the top right of [github.com/vertigotalks7/FOSS-RIT](https://github.com/vertigotalks7/FOSS-RIT) to create your copy.

#### Step 2: Add Your Markdown Submission File

##### Option A: Software Project (`content/projects/your-project.md`)
```markdown
---
name: "Campus Transit Radar"
description: "Real-time shuttle and bus tracking web application for RIT students."
repo_url: "https://github.com/your-username/transit-radar"
tech_stack: ["TypeScript", "React", "FastAPI"]
author: "your-github-username"
author_name: "Your Full Name"
is_verified_student: true
batch: "2026"
featured: true
---
```

##### Option B: Creative Showcase via PR (`content/creatives/your-showcase.md`)
```markdown
---
title: "Campus Design System / Video Aftermovie"
category: "design" # Options: design | photography | video | 3d
author: "your-handle"
author_name: "Your Full Name"
batch: "2026"
department: "CSE" # e.g. CSE, ECE, ME, B.Arch
tools: ["Penpot", "Figma", "Blender", "DaVinci Resolve"]
media_url: "https://design.penpot.app/... OR https://youtu.be/... OR Unsplash Link"
thumbnail_url: "https://images.unsplash.com/... OR Direct Image Link"
aspect_ratio: "16:9" # Options: 16:9 | 3:2 | 1:1
license: "CC-BY-4.0" # Creative Commons: CC-BY-4.0, CC-BY-SA-4.0, CC0-1.0
is_verified_student: true
featured: true
---
```

> **Important Rule for Media Assets:**  
> **Do NOT commit raw video, heavy photos, or .psd/.blend binary files into Git.**  
> Upload your media to an external host (YouTube, Figma, Penpot, Unsplash, Imgur) and link the URL in your markdown file.

#### Step 3: Open a Pull Request
1. Commit your changes and push to your fork.
2. Open a **Pull Request** to the `main` branch.
3. Automated GitHub Actions will test and validate your file formatting.
4. Once merged, your work automatically displays on the live website!

---

## Contributor Leaderboard & Badges

All contributors earn XP towards their campus rank:
- **First Submission:** `+100 XP`
- **Subsequent Works:** `+75 XP` each
- **Campus Verified Student:** `+50 XP`
- **Peer Forks / Repos:** `+20 XP` per fork
- **FOSS Tool Usage (Penpot, Blender, Krita, Kdenlive):** `+30 XP` bonus

### Badges You Can Unlock:
- `🎓 Campus Verified`: Enrolled student at RIT Kottayam.
- `🚀 First Ship`: Published your first campus project.
- `🎨 Pixel Architect`: Published an approved UI/UX design.
- `📸 Lens Master`: Photographed an official campus FOSS event.
- `🎬 Frame Crafter`: Produced an event video or aftermovie.
- `🧊 3D Artisan`: Created a 3D model with Blender.
- `🐧 Open Creator`: Built work using 100% open-source creative tools.
