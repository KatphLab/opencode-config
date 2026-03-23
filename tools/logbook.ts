import { tool } from '@opencode-ai/plugin';
import { Database } from 'bun:sqlite';
import { existsSync } from 'fs';
import { resolve } from 'path';

function resolveDbPath(path: string) {
  const abs = resolve(path);
  if (!abs.endsWith('.db') && !abs.endsWith('.sqlite') && !abs.endsWith('.sqlite3')) {
    throw new Error(`❌ Database path must end with .db, .sqlite, or .sqlite3. Got: "${path}"`);
  }
  return abs;
}

function openDb(path: string) {
  const abs = resolveDbPath(path);
  if (!existsSync(abs)) {
    throw new Error(`❌ Database not found: "${abs}"`);
  }
  return new Database(abs);
}

function normalizeFilePaths(value?: string[] | null) {
  return JSON.stringify(value ?? []);
}

export const write = tool({
  description: 'Append a logbook entry to a SQLite database using the logbook table schema.',
  args: {
    db_path: tool.schema.string().describe('Path to the SQLite database file'),
    session_id: tool.schema.string().optional().describe('Session identifier'),
    model: tool.schema.string().optional().describe('Model name used'),
    task_name: tool.schema.string().optional().describe('High-level task name'),
    tool_used: tool.schema.string().optional().describe('Tool used by the agent'),
    file_paths: tool.schema.array(tool.schema.string()).optional().describe('List of file paths touched'),
    what: tool.schema.string().describe('What the agent did'),
    why: tool.schema.string().describe('Why the agent did it'),
  },
  async execute({ db_path, session_id, model, task_name, tool_used, file_paths, what, why }) {
    const db = openDb(db_path);

    try {
      const stmt = db.prepare(`
        INSERT INTO logbook (
          session_id,
          model,
          task_name,
          tool_used,
          file_paths,
          what,
          why
        ) VALUES (
          $session_id,
          $model,
          $task_name,
          $tool_used,
          $file_paths,
          $what,
          $why
        )
      `);

      const result = stmt.run({
        $session_id: session_id ?? null,
        $model: model ?? null,
        $task_name: task_name ?? null,
        $tool_used: tool_used ?? null,
        $file_paths: normalizeFilePaths(file_paths),
        $what: what,
        $why: why,
      });

      return `✅ Inserted logbook entry #${result.lastInsertRowid}`;
    } finally {
      db.close();
    }
  },
});

export const read = tool({
  description: 'Read logbook entries from a SQLite database with optional filters.',
  args: {
    db_path: tool.schema.string().describe('Path to the SQLite database file'),
    limit: tool.schema.number().int().positive().max(200).optional().default(20).describe('Max rows'),
    session_id: tool.schema.string().optional().describe('Filter by session_id'),
    task_name: tool.schema.string().optional().describe('Filter by task_name'),
    tool_used: tool.schema.string().optional().describe('Filter by tool_used'),
  },
  async execute({ db_path, limit, session_id, task_name, tool_used }) {
    const db = openDb(db_path);

    try {
      const where: string[] = [];
      const params: Record<string, unknown> = { $limit: limit };

      if (session_id) {
        where.push('session_id = $session_id');
        params.$session_id = session_id;
      }

      if (task_name) {
        where.push('task_name = $task_name');
        params.$task_name = task_name;
      }

      if (tool_used) {
        where.push('tool_used = $tool_used');
        params.$tool_used = tool_used;
      }

      const sql = `
        SELECT id, ts, session_id, model, task_name, tool_used, file_paths, what, why
        FROM logbook
        ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
        ORDER BY ts DESC, id DESC
        LIMIT $limit
      `;

      const rows = db
        .prepare(sql)
        .all(params)
        .map((row: any) => {
          let parsedFilePaths: string[] = [];
          try {
            parsedFilePaths = row.file_paths ? JSON.parse(row.file_paths) : [];
          } catch {
            parsedFilePaths = [];
          }

          return {
            id: row.id,
            ts: row.ts,
            session_id: row.session_id,
            model: row.model,
            task_name: row.task_name,
            tool_used: row.tool_used,
            file_paths: parsedFilePaths,
            what: row.what,
            why: row.why,
          };
        });

      return rows
        .map((row: any) =>
          [
            `#${row.id} ${row.ts}`,
            `session: ${row.session_id ?? ''}`,
            `model: ${row.model ?? ''}`,
            `task: ${row.task_name ?? ''}`,
            `tool: ${row.tool_used ?? ''}`,
            `files: ${(row.file_paths ?? []).join(', ')}`,
            `what: ${row.what ?? ''}`,
            `why: ${row.why ?? ''}`,
          ].join('\n'),
        )
        .join('\n\n---\n\n');
    } finally {
      db.close();
    }
  },
});
