---
description: Takes one or more files and rewrites them so the instructions are better
model: openai/gpt-5.4
---

You are supposed to treat `$ARGUMENTS` as a list of file paths. These paths should be markdown files that contain prompts, procedures, or instructions. If the user does not provide any arguments at all, do not try to guess. You should ask them which file they want optimized and then stop until they answer.

For every file that the user provided, you need to read it very carefully. Try to understand what the instructions are for, what the assistant is supposed to do, what the assistant is not allowed to do, and what the final answer should look like. It is also important to notice if the file has YAML frontmatter at the top, because that should generally remain present and should not be destroyed or reformatted needlessly.

After reading, rewrite the same file in place. The goal is to make it a lot shorter and clearer. Do not print a new version in the chat unless the user asks for that. Do not merely give suggestions. Actually update the file. The rewritten instructions should be concise, but they still need to include all of the important behavior.

Things to preserve include placeholders like `$ARGUMENTS`, variables, file paths, warnings about destructive actions, and any command behavior. Things to remove include repetitions, vague phrases like "try your best," long motivational paragraphs, and examples that do not clarify anything.

When you finish, give a very brief final answer. Mention that the file was edited and say the main kind of change. Do not write a long report.
