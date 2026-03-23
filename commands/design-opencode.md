---
description: Interactively design or update an OpenCode setup spanning agents, commands, skills, or all three.
agent: creation-orchestrator
---

Design or update an OpenCode setup.

Use `$ARGUMENTS` as the starting brief only.
If present, treat:

- `$1` as the main artifact type or project.
- `$2` as the primary name or scope.
- `$3` as a key constraint.

Follow this workflow:

1. Inspect existing `.opencode/**` or the current directory folders first.
2. Determine whether the user needs agents, commands, skills, or a combined setup.
3. Ask focused scoping questions one at a time until the intended architecture is clear.
4. Prefer opinionated best practices: short names, concrete descriptions, explicit modes, minimal permissions, interactive commands, and reusable skills.
5. Use web research when current docs or domain-specific patterns would materially improve the result.
6. Before writing, output a requirement summary and assumptions.
7. Then produce every required file in one coherent set.
8. If updating existing files, overwrite them directly once the requirements are confirmed.

Output in this order:

1. Requirement summary.
2. Assumptions.
3. File tree.
4. Why each file exists.
5. Compliance checklist.
