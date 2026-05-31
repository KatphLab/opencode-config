import fs from 'fs';

const ERROR_FILE = '/tmp/opencode-anti-terminate-error.log';

const log = (client: any, msg: string, data?: any, level: 'debug' | 'error' = 'debug') => {
  const line = `[${new Date().toISOString()}] ${msg} ${data ? JSON.stringify(data, null, 2) : ''}\n`;
  if (level === 'error') {
    fs.appendFileSync(ERROR_FILE, line);
  }
  client.app.log({
    body: {
      service: 'anti-terminate',
      level,
      message: line,
    },
  });
};

type SessionState = {
  phase: 'idle' | 'challenged' | 'continue_sent' | 'done';
  lastActivityTime: number;
};

/**
 * Anti-Terminate Plugin
 *
 * Prevents agents from stopping early by hooking into session.idle events.
 * When an agent tries to stop, it is explicitly challenged to:
 * 1. State its current goal
 * 2. Confirm whether the goal is fully achieved (YES/NO)
 * 3. If NO, the agent is commanded to continue without stopping
 *
 * This works via explicit hooks rather than system prompts because
 * agents forget system prompt instructions after context compaction.
 */
export default async function AntiTerminatePlugin({ client, project, directory, worktree }: any) {
  log(client, 'Anti-terminate plugin loaded', {
    project,
    directory,
    worktree,
  });

  const sessionStates = new Map<string, SessionState>();

  // Clean up old session states periodically (older than 2 hours)
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [sessionID, state] of sessionStates.entries()) {
      if (now - state.lastActivityTime > 2 * 60 * 60 * 1000) {
        sessionStates.delete(sessionID);
      }
    }
  }, 10 * 60 * 1000);

  process.on('beforeExit', () => clearInterval(cleanupInterval));

  // Phrases that indicate the agent is trying to stop or hand off to user
  const STOP_PHRASES = [
    'would you like', 'do you want', 'let me know', 'is there anything else',
    'have completed', 'all done', 'task complete', 'finished',
    'am done', "that's it", 'that is it', 'anything else you need',
    'shall i', 'should i', 'can i help', 'need anything else',
    'i have completed', 'i am done', 'i\'m done', 'work is complete',
    'completed the task', 'finished the task', 'task is done',
    'would you like me to', 'do you need me to', 'shall we stop',
    'shall we continue', 'should we stop', 'should we continue',
    'is that all', 'anything else', 'what else', 'need further assistance',
    'further assistance', 'happy to help', 'glad to help',
    'if you have any questions', 'if you need anything', 'feel free to ask',
    'reach out if', 'let me know if you need'
  ];

  // Phrases that indicate the user explicitly told the agent to stop
  const USER_STOP_COMMANDS = [
    'stop', 'that\'s enough', 'that is enough', 'enough',
    'you can stop', 'no need to continue', 'don\'t continue',
    'halt', 'abort', 'cancel', 'nevermind', 'never mind'
  ];

  function getLastMessages(messages: any[]) {
    const reversed = [...messages].reverse();
    const lastAssistant = reversed.find((m: any) => m?.info?.role === 'assistant');
    const lastUser = reversed.find((m: any) => m?.info?.role === 'user');
    return { lastAssistant, lastUser };
  }

  function extractText(message: any): string {
    if (!message) return '';
    return (message.parts ?? [])
      .filter((p: any) => p?.type === 'text')
      .map((p: any) => p?.text ?? '')
      .join('')
      .trim();
  }

  function looksLikeStopping(text: string): boolean {
    const lower = text.toLowerCase();
    const hasStopPhrase = STOP_PHRASES.some(phrase => lower.includes(phrase));
    const isAskingQuestion = text.endsWith('?') && text.length > 15;
    const isShortCompletion = text.length < 300 && (
      (lower.includes('done') && !lower.includes('done so far')) ||
      (lower.includes('complete') && !lower.includes('incomplete')) ||
      (lower.includes('finished') && !lower.includes('not finished'))
    );
    return hasStopPhrase || isAskingQuestion || isShortCompletion;
  }

  function userSaidStop(userText: string): boolean {
    const lower = userText.toLowerCase().trim();
    return USER_STOP_COMMANDS.some(cmd => lower.includes(cmd));
  }

  function agentSaysNo(text: string): boolean {
    const lower = text.toLowerCase();
    // Look for explicit NO or indicators of incompletion
    const negativeIndicators = [
      'no,', 'no.', 'no ', 'not achieved', 'not complete', 'not done',
      'not finished', 'incomplete', 'partially', 'still working',
      'ongoing', 'remaining', 'pending', 'not yet', 'haven\'t',
      'have not', 'has not', 'needs more', 'need to', 'in progress'
    ];
    return negativeIndicators.some(phrase => lower.includes(phrase));
  }

  function agentSaysYes(text: string): boolean {
    const lower = text.toLowerCase();
    // Look for explicit YES or strong completion indicators
    const positiveIndicators = [
      'yes,', 'yes.', 'yes ', 'fully achieved', 'completely done',
      'task is complete', 'goal achieved', 'finished completely',
      'all done', 'fully complete', 'successfully completed'
    ];
    return positiveIndicators.some(phrase => lower.includes(phrase));
  }

  return {
    /**
     * Main hook: session.idle event
     * Challenges the agent when it tries to stop prematurely.
     */
    event: async ({ event }: any) => {
      if (event?.type !== 'session.idle') return;

      const sessionID = event?.properties?.sessionID;
      if (!sessionID) return;

      const now = Date.now();
      let state = sessionStates.get(sessionID);
      if (!state) {
        state = { phase: 'idle', lastActivityTime: now };
        sessionStates.set(sessionID, state);
      }
      state.lastActivityTime = now;

      try {
        const messagesRes = await client.session.messages({ path: { id: sessionID } });
        const messages = messagesRes?.data ?? [];
        const { lastAssistant, lastUser } = getLastMessages(messages);

        if (!lastAssistant) return;

        // Skip subagents - orchestrators manage their lifecycle
        const agentName = lastAssistant?.info?.agent ?? 'unknown';
        if (['builder', 'reviewer', 'discovery', 'feature-manager', 'plan', 'orchestrator'].includes(agentName)) {
          return;
        }

        const assistantText = extractText(lastAssistant);
        const userText = extractText(lastUser);

        if (!assistantText) return;

        // If user explicitly said to stop, respect that
        if (userText && userSaidStop(userText)) {
          log(client, 'User explicitly requested stop, allowing', { sessionID });
          state.phase = 'done';
          return;
        }

        // State machine
        switch (state.phase) {
          case 'done':
            // Already processed, allow idle
            return;

          case 'continue_sent': {
            // We previously told the agent to continue.
            // Accept this idle as legitimate completion (agent should have finished).
            // But if it looks like it's stopping again with a question, challenge once more.
            if (looksLikeStopping(assistantText)) {
              log(client, 'Agent stopped again after continue, sending final challenge', { sessionID });
              await client.session.prompt({
                path: { id: sessionID },
                parts: [{
                  type: 'text',
                  text: 'You were told to continue. Have you now FULLY completed the goal? Answer YES or NO. If NO, continue working immediately without asking questions.'
                }]
              });
              state.phase = 'challenged';
            } else {
              log(client, 'Agent appears to have finished work after continue, allowing stop', { sessionID });
              state.phase = 'done';
            }
            return;
          }

          case 'challenged': {
            // We sent a challenge, now reading the response
            log(client, 'Analyzing challenge response', { sessionID, text: assistantText.slice(0, 150) });

            if (agentSaysNo(assistantText)) {
              log(client, 'Agent says goal NOT achieved, sending continue command', { sessionID });
              await client.session.prompt({
                path: { id: sessionID },
                parts: [{
                  type: 'text',
                  text: 'You confirmed the goal is NOT fully achieved. CONTINUE WORKING NOW. Do not stop. Do not ask me any questions. Keep working until the goal is completely achieved.'
                }]
              });
              state.phase = 'continue_sent';
            } else if (agentSaysYes(assistantText)) {
              log(client, 'Agent says goal IS achieved, allowing stop', { sessionID });
              state.phase = 'done';
            } else {
              // Ambiguous response - assume not done to be safe, but use gentler language
              log(client, 'Agent response ambiguous, assuming incomplete', { sessionID });
              await client.session.prompt({
                path: { id: sessionID },
                parts: [{
                  type: 'text',
                  text: 'Your answer was unclear. If you have NOT fully achieved the goal, continue working now. If you HAVE fully achieved it, state exactly what was completed and confirm you are done.'
                }]
              });
              state.phase = 'continue_sent';
            }
            return;
          }

          case 'idle': {
            // Check if agent is trying to stop
            if (looksLikeStopping(assistantText)) {
              log(client, 'Detected potential early termination, sending challenge', {
                sessionID,
                text: assistantText.slice(0, 200)
              });

              await client.session.prompt({
                path: { id: sessionID },
                parts: [{
                  type: 'text',
                  text: 'STOP AND EVALUATE BEFORE ENDING:\n\n1. What goal are you currently working on?\n2. Have you FULLY achieved it? (Answer ONLY "YES" or "NO")\n\nIf NO, you must continue working immediately without asking me anything.'
                }]
              });

              state.phase = 'challenged';
            }
            return;
          }
        }
      } catch (error: any) {
        log(client, 'Event handler error', { message: error?.message, stack: error?.stack }, 'error');
      }
    },
  };
}
