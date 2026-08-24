---
name: "FeedGuard"
description: "A Chrome MV3 extension for real-time content moderation on X/Twitter, using a three-layer ML pipeline (heuristics, spam ML, toxicity ML, and an LLM fallback) to flag harmful content."
repo_url: "https://github.com/ari2387q/feedguard-ai"
tech_stack: ["TypeScript", "Node.js", "Express", "FastAPI", "scikit-learn", "Chrome Extension (MV3)", "Next.js"]
author: "ari2387q"
author_name: "Aryan Nair"
is_verified_student: true
batch: "2026"
featured: true
---
### About the Project
FeedGuard AI is a Chrome MV3 extension that moderates content in real time on X/Twitter. It runs a three-layer pipeline — rule-based heuristics, a spam classifier, a toxicity classifier, and a Groq-hosted LLM fallback — to detect and flag harmful posts as you scroll.

The system started as a standalone spam detector (TF-IDF + logistic regression, 97% accuracy) served via a FastAPI `/predict` endpoint, and has since grown into a full product: a Node/Express backend, a separate FastAPI ml-service for spam/toxicity detection, and a Next.js dashboard for stats — deployed across Render and Vercel.

The extension itself is live and was submitted to Firefox Add-ons (AMO) on Aug 4, 2026 under MIT license, currently pending Mozilla review.

### Features
- Real-time content moderation on X/Twitter via MV3 content scripts
- Three-layer detection: heuristics → spam ML → toxicity ML → LLM fallback (Groq, llama-3.1-8b-instant)
- Toxicity classifier trained on the tweet_eval hate dataset
- Persistent UUID generation and debounced MutationObserver for efficient DOM watching
- Backend + ML service deployed independently (Render), stats dashboard on Vercel
- Firefox Add-ons submission (MIT licensed, privacy policy published)
