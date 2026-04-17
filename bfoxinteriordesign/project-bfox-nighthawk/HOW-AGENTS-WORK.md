# How the bfox Agents Work — A Beginner's Walkthrough

This document explains **what each agent does**, **how they hand work to
each other**, and **why the pipeline is shaped this way**. If you've never
touched multi-agent systems before, start here.

> 🙏 The architecture described below is adapted from
> [Project Nighthawk](../README.md). The pattern, naming conventions, and
> design principles are theirs — this document explains how they're applied
> to building a website **inside Claude Code** (Anthropic's CLI / VS Code
> extension). See [README.md](README.md) for full attribution.

---

## 🐣 The 30-Second Version

Six Claude Code subagents collaborate in a fixed pipeline. One of them (the
Orchestrator) talks to the user. The other five each do exactly one job.
They pass work between each other through structured handoffs and shared
files on disk.

```text
You ──► 🦊 Orchestrator
            │
            ├──► 🗺️  Spec-Interpreter   (reads README, makes a plan)
            ├──► 🏗️  Scaffolder         (creates folders + installs deps)
            ├──► 🧱 Component-Builder  (writes the React)
            ├──► 🎨 Stylist             (adds Tailwind + animations)
            └──► 🔍 Reviewer            (quality gate, no edits)
```

---

## 🤖 Claude Code Specifics

Before the tour, two things to know about the runtime:

1. **Agents live in `.claude/agents/*.md`** — each file is one subagent.
   The YAML frontmatter (`name`, `description`, `tools`, `model`) tells
   Claude Code when to invoke it and what it can do.
2. **Skills live in `.claude/skills/<name>/SKILL.md`** — reusable knowledge
   files loaded on-demand based on their description.

Subagents invoke each other via Claude Code's built-in `Agent` tool. Only
agents that list `Agent` in their `tools:` frontmatter can spawn other
subagents. In this pipeline, **only the Orchestrator can** — everyone else
is a leaf.

---

## 👥 Meet the Team

### 🦊 bfox-orchestrator — *the project manager*

- The only agent that talks to the user.
- Doesn't write code. Calls the other agents via the `Agent` tool.
- If something fails, it decides whether to retry, route to a different
  agent, or surface the problem to the user.
- **Tools**: `Read, Write, Edit, Grep, Glob, Bash, Agent`

### 🗺️ bfox-spec-interpreter — *the translator*

- Reads the human-written project README.
- Produces a structured `notes/.build-plan.md` with: routes, components in
  dependency order, data shape, interactions, and any open questions.
- **Cannot** launch subagents or run terminal commands.
- **Tools**: `Read, Grep, Glob, Write, Edit`

### 🏗️ bfox-scaffolder — *the carpenter*

- Runs `create-next-app`, installs Framer Motion, creates the `src/`
  folder tree, stubs every route file with a one-liner.
- After it finishes, `npm run build` succeeds even though no real
  components exist yet.
- **Tools**: `Read, Write, Edit, Grep, Glob, Bash` (one of only two agents
  with `Bash`)

### 🧱 bfox-component-builder — *the framer*

- Writes the actual React: `HomePage`, `ProjectLayout`, `SectionPage`,
  `ImageGrid`, `FullBleedView`, `VinylElement`, plus `src/data/projects.js`.
- Builds in **leaves-first** order so the build never breaks mid-pipeline.
- Uses minimal Tailwind (just enough for layout). Visual polish is the
  Stylist's job.
- **Tools**: `Read, Write, Edit, Grep, Glob` (no `Bash` — cannot install
  new dependencies)

### 🎨 bfox-stylist — *the interior designer*

- Touches `className` attributes, Framer Motion props, and `globals.css`
  only. Prompt rules prevent it from changing JSX structure or React logic.
- Implements the wood-and-vinyl aesthetic, hover-zoom on every image,
  full-bleed overlay animation, and the mobile-first responsive grids.
- **Tools**: `Read, Edit, Grep, Glob` (no `Write` — cannot create new files)

### 🔍 bfox-reviewer — *the inspector*

- Walks the README spec line by line, checks the built code, writes a
  verdict file: `APPROVE` / `APPROVE WITH WARNINGS` / `NEEDS REVISION`.
- Has `Write` but prompt-scoped to `notes/.review-*.md` only. **Cannot
  `Edit`** any existing source file — enforced by the tools list.
- If `NEEDS REVISION`, hands a list of failing checks back to the
  Orchestrator, who routes each item to the right specialist.
- **Tools**: `Read, Grep, Glob, Write`

---

## 🔁 How Work Flows Between Them

Agents don't message each other directly. Every handoff goes through the
Orchestrator and uses one of two channels:

### Channel 1: Structured return values

Short, predictable text the Orchestrator parses from the subagent's final
message:

```text
SCAFFOLD COMPLETE
Routes stubbed: 13
Dependencies installed: next, react, react-dom, tailwindcss, framer-motion
Build check: ✅
```

### Channel 2: Files on disk

Long outputs get written to `notes/` instead of returned in messages.
Two files matter:

| File                          | Written by         | Read by                       |
|-------------------------------|--------------------|-------------------------------|
| `notes/.build-plan.md`        | Spec-Interpreter   | Scaffolder, Component-Builder |
| `notes/.review-YYYY-MM-DD.md` | Reviewer           | Orchestrator (& human)        |

> 💡 **Why files instead of messages?** Long content blows past the LLM's
> context window. Writing to disk creates an audit trail and lets multiple
> agents read the same source of truth without duplication.

---

## 🛠️ Why Each Agent Has Different Tools

This is **the most important design choice** in the whole system. It comes
straight from Project Nighthawk and is called **tool isolation**.

| Agent              | Read | Edit  | Write | Bash | Agent |
|--------------------|------|-------|-------|------|-------|
| orchestrator       | ✅   | ✅    | ✅    | ✅   | ✅    |
| spec-interpreter   | ✅   | ✅    | ✅    | ❌   | ❌    |
| scaffolder         | ✅   | ✅    | ✅    | ✅   | ❌    |
| component-builder  | ✅   | ✅    | ✅    | ❌   | ❌    |
| stylist            | ✅   | ✅    | ❌    | ❌   | ❌    |
| reviewer           | ✅   | ❌    | ✅    | ❌   | ❌    |

### Why this matters

- **Only the Orchestrator has `Agent`** → the pipeline can't fork in
  unexpected directions. If the Stylist could spawn subagents, it might
  "helpfully" launch a re-scaffolder to fix a CSS issue that's actually a
  logic issue.
- **Spec-Interpreter has no `Bash`** → it can't run npm, can't clone repos,
  can't sneak ahead and start building before the plan is approved.
- **Component-Builder has no `Bash`** → it can't install random new
  dependencies mid-build, which would break the experiment's reproducibility.
- **Stylist has no `Write`** → it physically cannot create a new file. If
  it needs one, it has to stop and hand back.
- **Reviewer has no `Edit`** → it cannot mark its own homework. If it could
  edit source files, the quality gate would be meaningless.

> 📚 **Beginner takeaway:** restricting what an agent *can* do is more
> reliable than asking it nicely *not* to do things. Tools enforce
> boundaries; prompts only suggest them.

---

## 🧠 Why Each Agent Reads Different Skills

Skills are reusable knowledge files in `.claude/skills/`. Claude Code
auto-loads skills based on their `description` frontmatter — the model
decides which are relevant at runtime.

| Agent              | Skills it typically uses                          |
|--------------------|---------------------------------------------------|
| orchestrator       | `bfox-project-spec`                               |
| spec-interpreter   | `bfox-project-spec`                               |
| scaffolder         | `bfox-course-repo`, `bfox-project-spec`           |
| component-builder  | `bfox-course-repo`, `bfox-project-spec`           |
| stylist            | `bfox-style-patterns`, `bfox-project-spec`        |
| reviewer           | (none — reviews against the README directly)      |

- **`bfox-project-spec`** — the canonical contract: routes, props, data
  shape. Almost every agent reads this so they all speak the same dictionary.
- **`bfox-course-repo`** — points at Kaley's class repo
  ([ashx3s/sd-web-2](https://github.com/ashx3s/sd-web-2)) and lists course
  conventions (JSX over TSX, `function Foo()` style, etc.). Keeps the
  generated code looking like something a student in that class might
  reasonably have written.
- **`bfox-style-patterns`** — the style cookbook. Reusable Tailwind +
  Framer Motion snippets so every hover, every overlay, every responsive
  grid uses the same recipe.

---

## 🧯 What Happens When Things Go Wrong

The pipeline has explicit stop conditions at every stage. Agents do not
"try their best" past a real error — they hand control back.

| Failure                            | Who stops it      | What happens                                 |
|------------------------------------|-------------------|----------------------------------------------|
| README has ambiguous spec          | Spec-Interpreter  | Lists open questions, Orchestrator asks user |
| `npm install` fails                | Scaffolder        | Returns the error, no retry                  |
| Component contract is unclear      | Component-Builder | Asks Orchestrator                            |
| Visual effect needs a logic change | Stylist           | Hands back to Component-Builder              |
| Reviewer says NEEDS REVISION twice | Orchestrator      | Stops and asks the user — possible loop      |

This "stop early, surface clearly" discipline is what makes the system
debuggable. If the Stylist silently rewrote React logic to achieve a hover
effect, you'd never know which agent broke what.

---

## 🪴 Why This Architecture Is Worth Using

Compared to a single all-purpose agent doing the whole build, this pipeline
gives you:

1. **Traceability.** Every line of code can be traced to one specific agent.
   When something looks wrong, you know exactly which prompt to fix.
2. **Consistency.** The skill files act as a shared memory. Three agents
   reading `bfox-project-spec` is more reliable than three agents each
   inferring the spec from the README.
3. **A real quality gate.** The Reviewer is structurally prevented from
   modifying what it reviews. That's not a discipline thing — it's enforced
   by the tools list.
4. **Maintainability.** Want to change the visual recipe? Edit one file
   (`bfox-style-patterns/SKILL.md`). Want to support a new framework?
   Replace the Scaffolder. Each piece is independently swappable.
5. **Honest scope control.** The Spec-Interpreter and Reviewer both
   reference the same out-of-scope list. If an over-eager agent adds a
   contact form, the Reviewer flags it.

---

## 🧭 Compared to a Single-Agent Approach

| Concern                           | Single agent       | This pipeline          |
|-----------------------------------|--------------------|------------------------|
| Easy to set up                    | ✅                 | ❌ (more files)        |
| Predictable output structure      | ❌                 | ✅                     |
| Catches its own mistakes          | ❌                 | ✅ (Reviewer)          |
| Stays in scope                    | ❌                 | ✅                     |
| Easy to debug a single bad output | ❌                 | ✅ (one prompt to fix) |
| Adapts to bigger projects         | ❌ (context bloat) | ✅                     |

The trade-off is **complexity up front for predictability over time** —
which is the right trade for a project that's also part of a comparison
experiment, since predictability is what makes the comparison fair.

---

## ✅ Quick Reference

- One pipeline run = one user prompt that invokes the Orchestrator
- Five stages, in order, each with a structured handoff
- Two shared files in `notes/` carry long content between stages
- Three skill files carry shared knowledge across agents
- Only the Orchestrator has the `Agent` tool (can spawn subagents)
- Only the Scaffolder and Orchestrator have `Bash` (can run terminal)
- The Reviewer is the only quality gate and cannot edit source code

For the canonical contracts every agent obeys, read
[../.claude/skills/bfox-project-spec/SKILL.md](../.claude/skills/bfox-project-spec/SKILL.md).

For the style cookbook the Stylist works from, read
[../.claude/skills/bfox-style-patterns/SKILL.md](../.claude/skills/bfox-style-patterns/SKILL.md).

For Kaley's class-repo conventions, read
[../.claude/skills/bfox-course-repo/SKILL.md](../.claude/skills/bfox-course-repo/SKILL.md).
