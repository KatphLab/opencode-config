---
name: command-creator
description: Create or update reusable OpenCode commands for any project using interactive scoping, concise command design, and opinionated best practices.
---

# Command Creator

Use this skill when the task is to create or update one or more files in `.opencode/commands/`.

## What to clarify first

Ask concise follow-up questions until these are clear:

- The exact job the command should perform.
- Who will run it.
- Whether it should be interactive or one-shot.
- What arguments or placeholders it should support.
- Whether it should route through a specific agent.
- Whether it should run as an isolated subtask.
- What related agents or skills it depends on.
- Whether the command should create, update, review, or orchestrate files.
- What good and bad outcomes look like.

Do not write the command until the requirement is specific enough to avoid generic prompts.

## Design rules

- Use a short kebab-case filename.
- Put the file at `.opencode/commands/<name>.md`.
- Remember that the markdown filename becomes the slash-command name.
- Include YAML frontmatter with at least:
  - `description`
- Add `agent` only when routing through a specific agent is clearly useful.
- Add `subtask: true` only when isolation is clearly required.
- Support `$ARGUMENTS` and positional placeholders when they improve usability.
- Keep prompts interactive when details are likely to be missing.
- Prefer direct task instructions over broad, chatty prose.

## Recommended workflow

1. Read existing `.opencode/commands/**` plus any related agents and skills.
2. Identify missing requirements and ask only those.
3. If the command depends on current platform behavior or domain conventions, do live research before drafting.
4. Draft the command with:

- A concrete description.
- Only the needed frontmatter fields.
- Clear prompt instructions.
- Useful placeholder handling.
- Routing only when justified.

5. Validate the result against the checklist below.
6. Overwrite existing files directly if the approved task is an update.

## Validation checklist

Confirm all of the following:

- The path is `.opencode/commands/<name>.md`.
- The filename matches the intended slash-command name.
- The frontmatter has a concrete `description`.
- `agent` is present only if routing is intentional.
- `subtask: true` is present only if isolation is intentional.
- `$ARGUMENTS` and positional placeholders are used only when helpful.
- The prompt tells the model what to do, not just the topic.
- The command is specific enough to be immediately useful.
- The result matches the requested safety and interaction style.

## Output standard

When asked to produce deliverables, output:

1. Requirement summary.
2. Assumptions.
3. File tree.
4. Why the file exists.
5. Compliance checklist.

## Avoid

- Vague commands like "help with stuff".
- Long generic prompts with no real workflow.
- Unnecessary routing through an agent.
- Unnecessary `subtask: true`.
- Placeholder-heavy templates that make normal use harder.
- Commands that ignore existing repo conventions.
