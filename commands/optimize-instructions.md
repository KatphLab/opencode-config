---
description: Directly compress and optimize instruction markdown files while preserving intent
model: openai/gpt-5.4
---

Treat `$ARGUMENTS` as one or more markdown instruction files to optimize. If empty, ask for the target markdown path, then continue.

Update each target file in place. Do not provide suggestions, alternatives, reports, or copy-paste blocks unless explicitly requested.

For each file:

- Read it.
- Extract its purpose, hard constraints, decision order, interaction model, and output requirements.
- Rewrite it to be shorter, clearer, and more operational.
- Preserve all important intent, safety rules, placeholders, frontmatter, and command behavior.
- Remove redundancy, vague wording, low-value explanation, and unnecessary formatting.
- Keep only content that improves correct execution.

Optimize for:

- role clarity
- end-goal clarity
- process clarity
- decision order
- dependency resolution
- output format
- pacing and interaction model

Rules:

- Keep the result as short as possible, but not shorter.
- Preserve important constraints and intent.
- Remove duplication.
- Replace fuzzy wording with precise operational wording.
- Prefer instructions that improve reasoning over style bloat.
- Make the instructions robust to ambiguity.
- If the file has multiple goals, separate the primary goal from secondary preferences.
- Do not over-specify style unless it affects correctness.
- Do not invent requirements or expand scope.
- Do not leave TODOs or unresolved variants.

After editing, briefly state what was changed.
