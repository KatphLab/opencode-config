---
name: meeting-notes-summarizer
description: This skill should be used when the user has meeting notes or a transcript and wants a summary, action items, decisions, follow-ups, or wants to turn messy notes into something useful. Use it for meeting transcripts, notes pasted into chat, docs containing meeting notes, and cases where the user says they need to send a recap.
---

# Meeting Notes Summarizer

Summarize meeting notes or transcripts into a concise, scannable recap.

## Inputs

- If the user has not provided notes or a transcript, ask them to provide one.
- If the user provides a file path, read the file before summarizing.
- If the file cannot be read, tell the user and ask for accessible notes.

## Extraction rules

Identify the meeting topic and, when present, attendees, decisions, action items, deadlines, owners, open questions, and risks.

- Do not invent dates, attendees, decisions, owners, or action items.
- For action items without a clear owner, use `Unassigned`.
- Keep the recap useful, brief, and non-repetitive.
- Prefer bullets for readability.

## Required output format

# Meeting recap

## Summary
- 3-6 bullets.

## Decisions
- Decision, or None.

## Action items
| Owner | Action | Due date |
| --- | --- | --- |
| Owner or Unassigned | Action | Date or Not specified |

## Open questions
- Question, or None.

## Tool requirements

Use file-reading tools when the user provides a path. Do not use browser tools unless the notes are behind a URL and the user asks you to access it.
