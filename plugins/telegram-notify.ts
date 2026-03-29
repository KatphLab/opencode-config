import fs from 'fs';

const ERROR_FILE = '/tmp/opencode-telegram-notify-error.log';

const log = (client: any, msg: string, data?: any, level: 'debug' | 'error' = 'debug') => {
  const line = `[${new Date().toISOString()}] ${msg} ${data ? JSON.stringify(data, null, 2) : ''}\n`;
  if (level === 'error') {
    fs.appendFileSync(ERROR_FILE, line);
  }
  client.app.log({
    body: {
      service: 'telegram-notify',
      level,
      message: line,
    },
  });
};

export default async function TelegramNotifyPlugin({ project, client, directory, worktree }: any) {
  const BOT_TOKEN = process.env.OPENCODE_TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.OPENCODE_TELEGRAM_CHAT_ID;
  const ENABLED = process.env.OPENCODE_TELEGRAM_NOTIFY_ENABLED !== 'false';

  log(client, 'Plugin loaded', {
    project,
    directory,
    worktree,
    hasClient: !!client,
    enabled: ENABLED,
    hasBotToken: !!BOT_TOKEN,
    hasChatId: !!CHAT_ID,
  });

  if (!ENABLED) {
    log(client, 'Telegram notify plugin is disabled via OPENCODE_TELEGRAM_NOTIFY_ENABLED env var');
  }

  return {
    event: async ({ event }: any) => {
      log(client, 'event received', {
        type: event?.type,
        properties: event?.properties,
      });

      if (event?.type !== 'session.idle') return;
      
      if (!ENABLED) {
        log(client, 'Plugin disabled via OPENCODE_TELEGRAM_NOTIFY_ENABLED env var');
        return;
      }

      try {
        if (!BOT_TOKEN || !CHAT_ID) {
          log(client, 'Missing env vars', { hasBotToken: !!BOT_TOKEN, hasChatId: !!CHAT_ID }, 'error');
          return;
        }

        const sessionID = event?.properties?.sessionID;
        log(client, 'session.idle matched', { sessionID });

        if (!sessionID) return;

        const [sessionRes, messagesRes] = await Promise.all([
          client.session.get({ path: { id: sessionID } }),
          client.session.messages({ path: { id: sessionID } }),
        ]);

        const sessionTitle = sessionRes?.data?.title ?? sessionID;
        const messages = messagesRes?.data ?? [];

        const lastUser = [...messages].reverse().find((m: any) => m?.info?.role === 'user');
        const lastAssistant = [...messages].reverse().find((m: any) => m?.info?.role === 'assistant');
        const agentName = lastAssistant?.info?.agent ?? 'unknown';
        if (['builder', 'reviewer'].includes(agentName)) return; // skip subagent messages

        function escapeHtml(s: string) {
          return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        function extractText(msg: any, limit = 600): string {
          if (!msg) return '<i>none</i>';

          const text = (msg.parts ?? [])
            .filter((p: any) => p?.type === 'text')
            .map((p: any) => p?.text ?? '')
            .join('')
            .trim();

          if (!text) return '<i>none</i>';

          const truncated = text.length > limit ? text.slice(0, limit) + '…' : text;
          return escapeHtml(truncated);
        }

        const projectName = escapeHtml(project?.name ?? directory?.split('/').at(-1) ?? 'Unknown');
        const sessionName = escapeHtml(sessionTitle);

        const text = [
          `✅ <b>OpenCode Finished</b>`,
          ``,
          `📦 <b>Project:</b> <code>${projectName}</code>`,
          `🧠 <b>Session:</b> <code>${sessionName}</code>`,
          `📂 <b>Worktree:</b> <code>${escapeHtml(worktree ?? 'unknown')}</code>`,
          ``,
          `🙋 <b>Last User Message</b>`,
          `<blockquote>${extractText(lastUser)}</blockquote>`,
          ``,
          `🤖 <b>Last Assistant Message</b>`,
          `<blockquote>${extractText(lastAssistant)}</blockquote>`,
        ].join('\n');

        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text,
            parse_mode: 'HTML',
          }),
        });

        const body = await res.text();
      } catch (error: any) {
        log(client, 'event handler error', { message: error?.message, stack: error?.stack }, 'error');
      }
    },
  };
}
