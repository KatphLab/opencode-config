---
description: Interactively create or update an OpenCode skill.
agent: creation-orchestrator
---

Create or update an OpenCode skill.

Use `$ARGUMENTS` as the starting brief only.
If present, treat:

- `$1` as the proposed skill name.
- `$2` as the target job the skill should perform.
- `$3` as a domain, stack, or special constraint.

Follow this workflow:

1. Inspect existing `.opencode/skills/**` or `skills/**`, related agents, and related commands first.
2. Ask focused scoping questions one at a time until the skill's trigger, purpose, inputs, outputs, workflow, research needs, and success criteria are specific.
3. Keep the skill reusable across projects unless the user explicitly wants repo-specific behavior.
4. Prefer concise, opinionated skill instructions over boilerplate.
5. Research current domain conventions when they matter to the skill's usefulness.
6. Before writing, output a requirement summary and assumptions.
7. Then write the full skill file content and any related command or agent updates needed for consistency.
8. If updating an existing file, overwrite it directly once the requirements are confirmed.

Output in this order:

1. Requirement summary.
2. Assumptions.
3. File tree.
4. Why each file exists.
5. Compliance checklist.
