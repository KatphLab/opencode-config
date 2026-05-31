---
description: Takes one or more files and rewrites them so the instructions are better
model: openai/gpt-5.4
---

Treat `$ARGUMENTS` as a list of Markdown instruction files to optimize. If no arguments are provided, ask which file to optimize and stop.

For each file:
1. Read it carefully to understand its purpose, required/forbidden behavior, final-response requirements, and any YAML frontmatter.
2. Rewrite the same file in place; do not print the rewrite unless asked.
3. Make it shorter and clearer while preserving all essential behavior, including frontmatter, placeholders such as `$ARGUMENTS`, variables, paths, destructive-action warnings, and command semantics.
4. Remove repetition, vague wording, unnecessary motivation, and examples that do not clarify behavior.

Final response: be brief, state that the file was edited, and summarize the main change. Do not provide a long report.
