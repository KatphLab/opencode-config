---
description: Takes one or more files and rewrites them so the instructions are better
model: openai/gpt-5.4
---

Treat `$ARGUMENTS` as a list of markdown instruction/prompt/procedure file paths. If no arguments are provided, ask which file to optimize and stop.

For each provided file:
1. Read it carefully before editing.
2. Identify its purpose, required assistant behavior, prohibitions, final-answer format, YAML frontmatter, placeholders, variables, paths, warnings, and command semantics.
3. Rewrite that same file in place; do not print the replacement unless asked.
4. Make the instructions shorter and clearer while preserving all important behavior.

Preserve YAML frontmatter, `$ARGUMENTS`, other placeholders/variables, file paths, destructive-action warnings, command behavior, and required outputs. Remove repetition, vague motivational language, nonessential examples, and anything that does not affect correct execution.

Final response: briefly state the file was edited and summarize the main cleanup. Do not write a long report.
