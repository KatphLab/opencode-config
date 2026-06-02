---
name: commit-changes
description: Create safe, well-structured git commits. Use when the user asks to commit, stage changes, write commit messages, split commits, or save work in git. Checks protected branches, inspects diffs, stages deliberately, splits by functional intent, and writes concise commit messages.
---

# Commit Changes

Create clear, reviewable git commits without losing user work or polluting history.

## Rules

- Inspect branch, status, and diffs before staging or committing.
- Never commit on protected branches without explicit confirmation.
- Stage only files/hunks that belong in the current commit.
- Split unrelated changes into separate commits when practical.
- Do not push, amend, rebase, hard reset, discard, or overwrite work unless explicitly asked.
- Stop before committing if checks fail unless the user explicitly wants a WIP commit.
- Keep commit messages short; put details, test notes, and caveats in the final response.

Protected branches: `main`, `master`, `develop`, `dev`, `staging`, `production`, `prod`, `release/*`, and shared-looking `hotfix/*` branches.

## Workflow

### 1. Validate context

Run:

```bash
git rev-parse --is-inside-work-tree
git branch --show-current
git status --branch --short
git status --short
```

Stop if outside a repo, detached/blank branch, or no changes exist.

If on a protected branch, stop before staging and ask:

> You're on `<branch>`, which is usually protected. I won't commit here by default. Should I create/switch to a feature branch, or do you explicitly want this commit on the current branch?

Create a branch only after confirming its name:

```bash
git switch -c <branch-name>
```

### 2. Inspect changes

Gather context:

```bash
git diff --stat
git diff --name-status
git diff --cached --stat
git diff --cached --name-status
git log -8 --oneline
git ls-files --others --exclude-standard
```

Inspect relevant diffs before staging:

```bash
git diff -- <path>
git diff --cached -- <path>
```

Do not stage secrets, local config, editor files, logs, dependency directories, build outputs, or large generated files unless clearly intentional. Watch for `.env`, credentials, private keys, `node_modules/`, `dist/`, and `.DS_Store`.

### 3. Plan commits

Use one commit per coherent change. Implementation plus directly related tests/docs can go together.

Split when changes are independently understandable, especially feature vs fix, behavior vs refactor, code vs formatting, app logic vs dependencies/config, source vs generated files, or multiple unrelated tasks.

Share a short plan when the split is ambiguous, large, or likely to surprise the user. If files contain mixed purposes, use patch staging or ask how to split them.

### 4. Respect staged changes

If anything is already staged, inspect it:

```bash
git diff --cached --stat
git diff --cached
```

If staged changes are coherent, commit them first. If mixed or conflicting with the requested split, ask before reorganizing. When approved, unstage reversibly:

```bash
git restore --staged <path>
```

### 5. Stage and check each commit

For each planned commit:

```bash
git add <path1> <path2>
# or, for mixed files:
git add -p <path>

git diff --cached --stat
git diff --cached --check
git diff --cached
```

Always run `git diff --cached --check`. Also run relevant project checks when reasonable:

- `.pre-commit-config.yaml` + installed `pre-commit`: `pre-commit run --files <staged-files>`
- package scripts: existing `test`, `lint`, or `check` via npm/pnpm/yarn/bun
- Python: configured `pytest`, `ruff check`, `mypy`, or project command
- Go: `go test ./...`
- Rust: `cargo test` or `cargo check`
- Makefile: documented `make test`, `make lint`, or `make check`

If checks are unavailable, expensive, or skipped, say why in the final response.

### 6. Write a concise message

Follow the repository's recent style when clear; otherwise use Conventional Commits:

```text
<type>(<scope>): <imperative summary>

<optional one-sentence body>
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `style`, `chore`, `build`, `ci`.

Message rules:

- Default to subject-only.
- Use imperative mood: `add`, `fix`, `update`, `remove`.
- Keep the subject under ~72 characters when practical.
- Keep the full message under ~200 characters unless the user asks for detail.
- Describe the outcome, not the edit action.
- Add scope when useful: `fix(auth): handle expired tokens`.
- Do not include bullets, file-by-file summaries, check output, or changelog-style detail.
- Avoid vague subjects like `updates`, `misc`, `changes`, `fix stuff`, or `wip` unless requested.

### 7. Commit and verify

Commit subject-only by default:

```bash
git commit -m "<subject>"
```

Use a file only for the rare one-sentence body:

```bash
cat > /tmp/commit-message.txt <<'EOF'
<subject>

<body>
EOF
git commit -F /tmp/commit-message.txt
rm /tmp/commit-message.txt
```

After each commit:

```bash
git status --short
git log -1 --oneline
```

Repeat for remaining planned commits.

## Request handling

- **“Commit everything”**: inspect first; commit together only if coherent, otherwise propose/split.
- **“Make proper commits”**: split by functional intent and polish messages.
- **“Just commit quickly”**: move fast, but still check branch, inspect diffs, and avoid accidental files.
- **“Commit only X”**: stage only X-related files/hunks; leave and report unrelated changes.
- **Merge/rebase/cherry-pick in progress**: stop if conflicts exist unless the user is intentionally completing that operation.

## Final response

Report only:

- branch
- commit hash(es) and subject(s)
- checks run and results
- remaining uncommitted files
- skipped checks or follow-up needed

Do not push unless explicitly asked; offer it only as a next step.
