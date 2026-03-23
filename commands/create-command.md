---
description: Interactively create or update an OpenCode command.
agent: creation-orchestrator
---

Create or update an OpenCode command.

Use `$ARGUMENTS` as the initial brief only.
If present, treat:

- `$1` as the proposed command name.
- `$2` as the command's main job.
- `$3` as a routing or isolation constraint.

Follow this workflow:

1. Inspect existing `.opencode/commands/**` or `commands/**`, related agents, and related skills first.
2. Use the `command-creator` skill to shape the command design and validation.
3. Ask focused scoping questions one at a time until the command's trigger, target user, prompt behavior, placeholders, routing, and success criteria are clear.
4. Keep command names short and action-oriented.
5. Use `agent` only if the command should route through a specific agent.
6. Use `subtask: true` only if isolation is clearly needed.
7. Support `$ARGUMENTS` and positional placeholders when helpful, but do not force them unnecessarily.
8. Before writing, output a requirement summary and assumptions.
9. Then write the full command file content and any related agent or skill updates needed for consistency.
10. If updating an existing file, overwrite it directly once the requirements are confirmed.

Output in this order:

1. Requirement summary.
2. Assumptions.
3. File tree.
4. Why each file exists.
5. Compliance checklist.
