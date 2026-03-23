---
name: skill-creator
description: Create or update reusable OpenCode skills for any project using interactive scoping, concise skill design, and opinionated best practices.
---

# Skill Creator

Use this skill when the task is to create or update one or more files in `.opencode/skills/<skill-name>/SKILL.md`.

## What to clarify first

Ask concise follow-up questions until these are clear:

- The exact job the skill should help with.
- The kind of projects or repos it should work across.
- When the skill should be invoked.
- What inputs the user will usually provide.
- What outputs or artifacts the skill should produce.
- Whether the skill should research live information before writing.
- Which file paths or artifact types it should generate or update.
- What best-practice rules it should enforce.
- What good and bad outcomes look like.

Do not write the skill until the requirement is specific enough to avoid generic instructions.

## Design rules

- Use a short kebab-case folder name.
- Put the file at `.opencode/skills/<skill-name>/SKILL.md`.
- Keep frontmatter minimal:
  - `name`
  - `description`
- Make the skill reusable across projects unless the user explicitly wants repo-specific behavior.
- Prefer concise, operational instructions over long explanations.
- If the skill would become too large, keep the core flow in `SKILL.md` and recommend related local resources separately.
- Make the skill tell the model how to scope, research, draft, and validate.

## Recommended workflow

1. Read any existing `.opencode/**` files related to the target workflow.
2. Ask only the missing scoping questions.
3. Research current docs, ecosystem conventions, or domain-specific terminology when it will improve the skill.
4. Draft a skill that includes:

- When to use it.
- What to clarify first.
- Design rules.
- A recommended workflow.
- A validation checklist.
- Output expectations.

5. Validate that the skill is specific, reusable, and not just boilerplate.
6. Overwrite existing files directly if the approved task is an update.

## Validation checklist

Confirm all of the following:

- The folder name matches the skill name.
- The file path is `.opencode/skills/<skill-name>/SKILL.md`.
- The frontmatter uses `name` and `description`.
- The skill is reusable across projects unless a narrower scope was requested.
- The instructions tell the model what to ask before writing.
- The instructions define a drafting workflow.
- The instructions include validation steps.
- The skill avoids generic filler.

## Output standard

When asked to produce deliverables, output:

1. Requirement summary.
2. Assumptions.
3. File tree.
4. Why each file exists.
5. Compliance checklist.

## Avoid

- Repo-specific assumptions unless the user asked for them.
- Bloated frontmatter.
- Huge walls of prose that hide the actual workflow.
- Skills that skip clarifying questions.
- Boilerplate that ignores current documentation or domain context.
