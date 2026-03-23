---
description: Interactively create or update an OpenCode agent.
agent: creation-orchestrator
---

Create or update an OpenCode agent.

Use `$ARGUMENTS` as the initial brief only.
If present, treat:

- `$1` as the proposed agent name.
- `$2` as the proposed job or role.
- `$3` as a special constraint or permission note.

Follow this workflow:

1. Inspect existing `.opencode/agents/**` or `agents/**`, related commands, and related skills first.
2. Ask focused scoping questions one at a time until the agent's purpose, users, workflow, mode, permissions, file name, and success criteria are clear.
3. Prefer opinionated best practices: short names, explicit mode, minimal permissions, and narrow scope.
4. Research live documentation or domain conventions when that would improve the agent.
5. Before writing, output a requirement summary and assumptions.
6. Then write the full agent file content and any closely related command or skill updates needed for consistency.
7. If updating an existing file, overwrite it directly once the requirements are confirmed.

Output in this order:

1. Requirement summary.
2. Assumptions.
3. File tree.
4. Why each file exists.
5. Compliance checklist.
