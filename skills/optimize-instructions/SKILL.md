---
name: optimize-instructions
description: Directly compress and improve markdown instruction files while preserving their intent and behavior. Use this skill whenever the user asks to optimize, tighten, simplify, compress, clarify, clean up, or rewrite instructions/prompts/system prompts/agent docs/skill docs in markdown, especially when they want the file edited in place rather than advice. Also use it for slash-command style instruction files with frontmatter, placeholders like $ARGUMENTS, or operational workflows that need to become shorter and more reliable.
---

# Optimize Instructions

Rewrite markdown instruction files to be shorter, clearer, and more operational while preserving what they do.

The user wants the target file updated, not a critique or a suggested replacement, unless they explicitly ask for review only.

## Workflow

### 1. Identify target files

Treat the user's named path(s) as the markdown instruction files to optimize.

If no target path is provided, ask for the path before doing anything else.

If multiple files are provided, process each independently and update each in place.

### 2. Read before editing

For each file, read the whole relevant file first. Identify:

- purpose and intended user outcome
- hard constraints and safety rules
- required command behavior or placeholders
- decision order and branching logic
- interaction model and pacing
- required output format
- dependencies or environment assumptions
- frontmatter and metadata that must be preserved

### 3. Rewrite for execution quality

Edit the file in place. Make it concise, precise, and easy for an agent to execute.

Optimize for:

- clear role and end goal
- explicit decision order
- robust handling of ambiguity
- dependency checks before expensive work
- concrete output requirements
- minimal but sufficient interaction with the user
- instructions that improve reasoning rather than decorative style

Prefer operational instructions over explanation. Keep only content that helps correct execution.

### 4. Preserve intent and behavior

Preserve:

- YAML frontmatter and important metadata
- placeholders such as `$ARGUMENTS`, `{previous}`, file paths, command names, and template variables
- safety constraints, permission boundaries, and destructive-action warnings
- required output formats and command semantics
- important edge cases and fallback behavior

Do not invent requirements, broaden scope, or add new workflow steps unless needed to preserve the original intent under ambiguity.

### 5. Remove low-value material

Remove or collapse:

- duplicated instructions
- vague motivational language
- redundant examples
- unnecessary formatting
- style rules that do not affect correctness
- TODOs, unresolved variants, and speculative alternatives

If the file has multiple goals, separate the primary goal from secondary preferences instead of blending them together.

### 6. Final response

After editing, briefly state:

- which file(s) were updated
- the main type of cleanup performed

Do not include large rewritten blocks, alternatives, or a detailed report unless the user asks for them.
