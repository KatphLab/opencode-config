---
name: opencode-custom-tool
description: Use when asked to author a new OpenCode custom tool, especially when the request starts as a plain-English tool idea and needs to become a valid .opencode/tools/*.ts file.
---

# opencode-custom-tool

## When to use

Use this skill when the job is to create a **new** OpenCode custom tool.

Do not use it for:
- debugging an existing tool
- converting tools to JavaScript
- writing non-tool OpenCode artifacts

## What to clarify first

Ask concise follow-up questions until these are clear enough to write the tool:
- the exact job the tool should do
- the expected inputs and result shape
- whether the tool should be local to the repo or global
- whether it should call another script or do everything in TypeScript
- any runtime or dependency constraints
- whether the tool name must avoid or intentionally replace a built-in tool

If the user only gives a plain-English job, infer the smallest safe tool shape and ask only for missing behavior that would change the interface.

## Core rules

- Write **TypeScript only** for tool definition files.
- Put repo-local tools in `.opencode/tools/` by default.
- Prefer one tool per file unless multiple exports are clearly better.
- Use `@opencode-ai/plugin` and the `tool()` helper by default.
- Use `tool.schema` for arguments unless direct `zod` import is clearly better.
- Keep descriptions concrete and action-oriented.
- Keep argument schemas tight; do not accept vague blobs when structured inputs are possible.
- **Tools must always return a string**—never return a custom object directly. Use `JSON.stringify()` or template literals to convert results to strings.
- Prefer unique tool names. Override a built-in tool name only when the replacement is intentional.
- The filename becomes the tool name.
- If a file exports multiple tools, each tool name becomes `<filename>_<exportname>`.

## File placement and naming

Default local path:

```text
.opencode/tools/<tool-name>.ts
```

Examples:
- `.opencode/tools/database-query.ts` -> `database-query`
- `.opencode/tools/math.ts` with `export const add` -> `math_add`

Prefer kebab-case filenames.

## Required TypeScript shape

Preferred pattern:

```ts
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Describe the tool's job clearly",
  args: {
    input: tool.schema.string().describe("What the tool needs"),
  },
  async execute(args, context) {
    return `Result: ${args.input}`
  },
})
```

## Argument schemas

Use `tool.schema`, which is Zod-backed.

Common patterns:

```ts
args: {
  query: tool.schema.string().describe("SQL query to execute"),
  limit: tool.schema.number().describe("Maximum number of rows"),
  dryRun: tool.schema.boolean().describe("Preview without making changes"),
}
```

You may also use direct Zod if needed:

```ts
import { z } from "zod"

export default {
  description: "Tool description",
  args: {
    param: z.string().describe("Parameter description"),
  },
  async execute(args, context) {
    return "result"
  },
}
```

Prefer the `tool()` helper unless there is a specific reason not to.

## Execute function and context

Tools can receive:
- `args`: validated input values
- `context`: current session metadata

Useful context fields:
- `context.agent`
- `context.sessionID`
- `context.messageID`
- `context.directory` for the session working directory
- `context.worktree` for the git worktree root

Example:

```ts
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Get project information",
  args: {},
  async execute(args, context) {
    return `Agent: ${context.agent}, Directory: ${context.directory}, Worktree: ${context.worktree}`
  },
})
```

**IMPORTANT**: Tools must always return a **string**, not a custom object. Convert any objects or arrays to strings using `JSON.stringify()` or template literals.

Use `context.directory` when the tool should act relative to the current session directory.
Use `context.worktree` when locating files from the repo root.

## Calling other languages

The tool definition file stays in TypeScript, but it may invoke scripts written in another language.

Pattern:

```ts
import { tool } from "@opencode-ai/plugin"
import path from "path"

export default tool({
  description: "Add two numbers using Python",
  args: {
    a: tool.schema.number().describe("First number"),
    b: tool.schema.number().describe("Second number"),
  },
  async execute(args, context) {
    const script = path.join(context.worktree, ".opencode/tools/add.py")
    const result = await Bun.$`python3 ${script} ${args.a} ${args.b}`.text()
    return result.trim()
  },
})
```

Use this only when another language is genuinely useful. Do not move the tool definition itself out of TypeScript.

## Recommended workflow

1. Clarify the tool's job and interface.
2. Choose the filename carefully because it becomes the tool name.
3. Decide whether one default export is enough or multiple exported tools are warranted.
4. Write a TypeScript file in `.opencode/tools/`.
5. Define a tight `args` schema with descriptions.
6. Implement `async execute(args, context)`.
7. Use `context.directory` or `context.worktree` intentionally.
8. Keep the return value simple, deterministic, and easy for an agent to consume.
9. Check for accidental collision with built-in tool names.
10. Return the finished TypeScript file content.

## Authoring defaults

When requirements are incomplete, prefer these defaults:
- local repo tool, not global
- a single default-exported tool
- TypeScript with `tool()` helper
- string/number/boolean args instead of free-form objects when possible
- direct implementation in TypeScript unless external scripting is clearly needed
- unique filename that does not replace built-in tools

## Output expectations

By default, produce code only:
- the `.opencode/tools/<name>.ts` file content

Do not add extra docs, commands, or agents unless the user asks.

## Validation checklist

Before finishing, confirm all of the following:
- The file is in `.opencode/tools/` unless the user explicitly wanted global placement.
- The tool definition file is TypeScript.
- The filename matches the intended tool name.
- `description` is present.
- `args` is defined and each argument has a clear schema.
- `execute` is async.
- `context.directory` vs `context.worktree` is used correctly if paths are involved.
- The tool does not accidentally override a built-in tool.
- The code is immediately usable without placeholders unless placeholders were explicitly requested.

## Common mistakes

- Writing JavaScript instead of TypeScript.
- Forgetting that the filename controls the tool name.
- Exporting multiple tools without realizing the names become `<filename>_<exportname>`.
- Using loose input shapes when a stricter schema is easy to define.
- Hardcoding repo paths instead of using `context.directory` or `context.worktree`.
- Overriding `bash`, `read`, or another built-in tool by accident.
- Adding extra scaffolding when the request only asked for the tool code.
