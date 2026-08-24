---
name: "SkillTracker"
description: "A full-stack skill-tracking app built with Next.js and Express/MongoDB, featuring email verification, Google OAuth, and a planned analytics dashboard for tracking skill progress toward target roles."
repo_url: "https://github.com/ari2387q/skill-tracker"
tech_stack: ["Next.js", "Node.js", "Express", "TypeScript", "MongoDB", "Passport.js"]
author: "ari2387q"
author_name: "Aryan Nair"
is_verified_student: true
batch: "2026"
featured: true
---
### About the Project
SkillTracker is a full-stack web app for tracking personal skill development over time. It's built with a Next.js frontend and a Node/Express/TypeScript backend backed by MongoDB, with the backend deployed on Render and the frontend on Vercel.

Authentication is handled with a custom email verification flow (Resend API, SHA-256 token hashing, service/controller architecture) alongside Google OAuth via Passport, supporting both local and Google-provider users on the same User model. The project is being expanded into a more complete portfolio piece, with a planned data hierarchy (Skill Categories → Skills → Progress Entries), an analytics dashboard using recharts, and a skill-gap recommender tied to target roles.

### Features
- Email verification system with hashed, time-limited tokens
- Google OAuth sign-in (Passport + passport-google-oauth20)
- Local and Google-provider users unified under a single User model
- IP-based rate limiting on auth routes (login, register, resend-verification)
- Planned: analytics dashboard (recharts), skill-gap recommender, refresh-token auth flow
