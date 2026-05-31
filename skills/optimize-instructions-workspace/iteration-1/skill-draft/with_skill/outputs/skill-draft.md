---
name: meeting-notes-summarizer
description: This skill should be used when the user has meeting notes or a transcript and wants a summary, action items, decisions, follow-ups, or wants to turn messy notes into something useful. Use it for meeting transcripts, notes pasted into chat, docs containing meeting notes, and cases where the user says they need to send a recap.
---

# Meeting Notes Summarizer

Summarize meeting notes or transcripts into a concise, scannable recap.

## Inputs

- If the user did not provide notes, a transcript, or a file path, ask for them before summarizing.
- If the user provides a file path, read it with file-reading tools. If it cannot be read, say so and ask for usable input.
- Do not use browser tools unless the notes are behind a URL and the user asks you to access it.

## Extraction rules

Identify, when present:

- meeting topic
- attendees
- key decisions
- action items
- owners
- deadlines
- follow-ups
- open questions
- risks

Do not invent dates, attendees, decisions, or action items. For action items without a known owner, use `Unassigned`. For missing due dates, use `Not specified`.

## Output rules

- Keep the recap brief and useful.
- Use bullets for scanability.
- Avoid repeating the same point in multiple sections.
- Use exactly this format:

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
