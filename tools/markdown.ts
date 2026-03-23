import { tool } from '@opencode-ai/plugin';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';

function assertMarkdown(path: string) {
  if (!resolve(path).endsWith('.md')) throw new Error(`❌ Only .md files are allowed. Got: "${path}"`);
}

export const write = tool({
  description: 'Create or overwrite a Markdown (.md) file with full content.',
  args: {
    path: tool.schema.string().describe('Target file path, must end with .md'),
    content: tool.schema.string().describe('Full Markdown content to write'),
  },
  async execute({ path, content }) {
    assertMarkdown(path);
    const abs = resolve(path);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, content, 'utf8');
    return `✅ Written ${content.length} chars to ${abs}`;
  },
});

export const edit = tool({
  description:
    'Edit an existing Markdown (.md) file by replacing a specific string. ' +
    'Prefer this over write when making small targeted changes.',
  args: {
    path: tool.schema.string().describe('Target file path, must end with .md'),
    old_str: tool.schema.string().describe('Exact string to find and replace'),
    new_str: tool.schema.string().describe('Replacement string'),
    expected_replacements: tool.schema
      .number()
      .int()
      .positive()
      .optional()
      .default(1)
      .describe('How many occurrences to replace (default: 1)'),
  },
  async execute({ path, old_str, new_str, expected_replacements }) {
    assertMarkdown(path);
    const abs = resolve(path);

    if (!existsSync(abs)) throw new Error(`❌ File not found: "${abs}"`);

    const original = readFileSync(abs, 'utf8');
    const occurrences = original.split(old_str).length - 1;

    if (occurrences === 0) throw new Error(`❌ old_str not found in "${abs}"`);

    if (occurrences !== expected_replacements)
      throw new Error(
        `❌ Expected ${expected_replacements} occurrence(s) but found ${occurrences}. ` +
          `Make old_str more unique to avoid ambiguous replacements.`,
      );

    let count = 0;
    const updated = original.replace(new RegExp(old_str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), (match) => {
      count++;
      return count <= expected_replacements ? new_str : match;
    });

    writeFileSync(abs, updated, 'utf8');
    return `✅ Replaced ${count} occurrence(s) in ${abs}`;
  },
});

export const insert = tool({
  description:
    'Insert new content into an existing Markdown (.md) file at a specific ' +
    'location: before/after a matched string, at the top, or at the bottom.',
  args: {
    path: tool.schema.string().describe('Target file path, must end with .md'),
    content: tool.schema.string().describe('New Markdown content to insert'),
    position: tool.schema
      .enum(['before', 'after', 'top', 'bottom'])
      .describe('Where to insert relative to anchor (or top/bottom of file)'),
    anchor: tool.schema
      .string()
      .optional()
      .describe("Exact string to insert before/after. Required when position is 'before' or 'after'"),
  },
  async execute({ path, content, position, anchor }) {
    assertMarkdown(path);
    const abs = resolve(path);

    if (!existsSync(abs)) throw new Error(`❌ File not found: "${abs}"`);

    if ((position === 'before' || position === 'after') && !anchor)
      throw new Error(`❌ 'anchor' is required when position is "${position}"`);

    const original = readFileSync(abs, 'utf8');
    let updated: string;

    if (position === 'top') {
      updated = content + '\n' + original;
    } else if (position === 'bottom') {
      updated = original.trimEnd() + '\n' + content;
    } else {
      if (!original.includes(anchor!)) throw new Error(`❌ Anchor string not found in "${abs}": "${anchor}"`);
      const replacement = position === 'before' ? content + '\n' + anchor! : anchor! + '\n' + content;
      updated = original.replace(anchor!, replacement);
    }

    writeFileSync(abs, updated, 'utf8');
    return `✅ Inserted content at "${position}"${anchor ? ` of anchor` : ''} in ${abs}`;
  },
});
