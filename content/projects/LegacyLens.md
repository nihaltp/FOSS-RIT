---

## name: "LegacyLens"
description: "Intelligent context engineering tool combining deterministic static analysis and multi-agent verification for legacy code comprehension."
repo_url: "https://github.com/knaaps/LegacyLens"
tech_stack: ["Python", "JavaScript", "Flask"]
author: "knaaps"
author_name: "Vinayak S"
is_verified_student: true
batch: "2026"
featured: true

### About the Project

LegacyLens is a developer tool designed to demystify complex, undocumented legacy codebases. Instead of relying strictly on vector retrieval or probabilistic LLM outputs, LegacyLens utilizes a smart hybrid pipeline combining deterministic static analysis (Call Graphs and ASTs via Tree-sitter) with a Multi-Agent Verification Loop (Writer-Critic-Finalizer) to produce accurate, structurally grounded explanations without hallucinations.

#### Key Features

* **Smart Hybrid Context:** Prioritizes in-memory call graph slicing, blending semantic vector search from ChromaDB only when deterministic context is insufficient.
* **Multi-Agent Audit Loop:** Employs a Writer-Critic-Finalizer verification workflow to cross-reference code entities against AST structures, enforcing factual accuracy, completeness, and security risk detection.
* **CodeBalance Metrics:** Evaluates code health on three deterministic structural axes—Energy (computational cost), Debt (maintainability burden), and Safety (OWASP security risks).
* **Interactive Dashboard & CLI:** Features Plotly 3D codebase health exploration, d3.js risk heatmaps, and a seamless terminal-to-web interface.

#### Quick Start

1. **Installation:**
```bash
git clone https://github.com/knaaps/LegacyLens
cd LegacyLens
python3 -m venv venv && source venv/bin/activate
pip install -e .

```


2. **Execution:**
```bash
legacylens index path/to/target-repo
legacylens explain "functionName" --web

```
