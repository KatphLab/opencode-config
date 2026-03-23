---
name: agent-creator
description: Create or update OpenCode agents for any project using interactive scoping, minimal permissions, and opinionated best practices.
---

# Agent Creator

Use this skill when the task is to create or update one or more files in `.opencode/agents/`.

## What to clarify first

Ask concise follow-up questions until these are clear:

- The exact job the agent must do.
- Who will use it.
- Whether it should be `primary` or `subagent`.
- What inputs it should expect.
- What outputs it should produce.
- Which tools or permissions it truly needs.
- Whether it should coordinate commands, skills, or other agents.
- Whether it must only read, or also edit specific paths.
- What good and bad outcomes look like.

Do not write the agent file until the scope is specific enough to avoid generic instructions.

## Design rules

- Give the agent one clear responsibility.
- Use a short kebab-case filename.
- Always include YAML frontmatter with at least:
  - `description`
  - `mode`
- Add permissions only when needed.
- Keep risky permissions off unless the user clearly needs them.
- Use `hidden: true` only for internal subagents.
- If edits should be narrow, state the allowed path scope in the body.
- Prefer crisp operational checklists over long narrative instructions.

## Recommended workflow

1. Read existing `.opencode/**` files that may interact with the new or updated agent.
2. Identify missing requirements and ask only those.
3. If conventions, domain terminology, or platform behavior matter, do live research before drafting.
4. Draft the agent with:

- A concrete description.
- Explicit mode.
- Minimal permissions.
- A step-by-step operating workflow.
- Guardrails and output expectations.

5. Validate the result against the checklist below.
6. Overwrite existing files directly if the approved task is an update.

## Validation checklist

Confirm all of the following:

- The path is `.opencode/agents/<name>.md`.
- The filename matches the intended agent name.
- The frontmatter has a concrete `description`.
- The frontmatter sets `mode` explicitly.
- Permissions are minimal and justified.
- The body tells the agent what to do, not just what it is.
- The workflow is specific enough to be reusable.
- The file matches the project's requested safety level.

## Output standard

When asked to produce deliverables, output:

1. Requirement summary.
2. Assumptions.
3. File tree.
4. Why the file exists.
5. Compliance checklist.

## Avoid

- Vague roles such as "help with coding tasks".
- Broad permissions without a reason.
- Mixing multiple unrelated jobs into one agent.
- Hidden subagents unless they are truly internal.
- Generic prompts that do not reflect the user's actual workflow.
