---
name: commit-changes
description: Create safe, well-structured git commits. Use when the user asks to commit, stage changes, write commit messages, split commits, or save work in git. Checks protected branches, inspects diffs, stages deliberately, splits by functional intent, and writes concise commit messages.
---

# Commit Changes

Create clear, reviewable git commits from the current working tree. Preserve user work, avoid protected-branch accidents, stage deliberately, and leave history easier to review.

## Non-negotiables

- Inspect branch, status, and diffs before staging or committing.
- Do not commit on protected branches without explicit confirmation after warning the user.
- Stage only files or hunks that belong in the current commit.
- Split unrelated changes into separate commits when practical.
- Do not push, amend, rebase, hard reset, or discard work unless explicitly asked.
- Stop before committing if checks fail, unless the user explicitly requests a WIP commit.

## Workflow

### 1. Validate repo and branch

Run first:

```bash
git rev-parse --is-inside-work-tree
git branch --show-current
git status --branch --short
git status --short
```

Stop if outside a repo, detached/blank branch, or no changes exist.

Protected branches: `main`, `master`, `develop`, `dev`, `staging`, `production`, `prod`, `release/*`, and shared-looking `hotfix/*` branches.

If on a protected branch, stop before staging:

> You're on `<branch>`, which is usually protected. I won't commit here by default. Should I create/switch to a feature branch, or do you explicitly want this commit on the current branch?

Create a new branch only after confirming the name:

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

### 3. Plan commit grouping

Make a short plan before staging. Share it when the split is ambiguous, large, or likely to surprise the user.

Use one commit for one coherent change, such as implementation plus directly related tests/docs.

Split commits when changes are independently understandable, especially:

- feature vs bug fix
- behavior change vs refactor
- code vs formatting-only cleanup
- app behavior vs dependencies/config
- source changes vs generated files
- multiple unrelated features/fixes

If files contain mixed purposes, use patch staging or ask the user how to split them. Do not include unrelated hunks just for convenience.

### 4. Respect staged changes

If anything is already staged, inspect it:

```bash
git diff --cached --stat
git diff --cached
```

If staged changes are coherent, commit them first. If they are mixed or conflict with the requested split, ask before reorganizing. When approved, use reversible unstaging:

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

Run `git diff --cached --check` every time. Also run available, relevant project checks when reasonable:

- `.pre-commit-config.yaml` + installed `pre-commit`: `pre-commit run --files <staged-files>`
- package scripts: existing `test`, `lint`, or `check` scripts via npm/pnpm/yarn/bun
- Python: configured `pytest`, `ruff check`, `mypy`, or project command
- Go: `go test ./...`
- Rust: `cargo test` or `cargo check`
- Makefile: documented `make test`, `make lint`, or `make check`

If checks are unavailable, expensive, or skipped, say why in the final response.

### 6. Write the message

Follow the repository's recent style when clear. Otherwise use Conventional Commits:

```text
<type>(<scope>): <imperative summary>

<body if useful>
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `style`, `chore`, `build`, `ci`.

Rules:

- Use imperative mood: `add`, `fix`, `update`, `remove`.
- Keep the subject under ~72 characters when practical.
- Describe the outcome, not the editing action.
- Add scope when useful: `fix(auth): handle expired tokens`.
- Add a body for why/risk/migration/testing context.
- Avoid vague subjects: `updates`, `misc`, `changes`, `fix stuff`, `wip` unless requested.

### 7. Commit and verify

Commit the staged unit:

```bash
git commit -m "<subject>"
```

For a body:

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
- **“Make proper commits”**: treat as permission to split by functional intent and polish messages.
- **“Just commit quickly”**: be fast, but still check branch, inspect diffs, and avoid accidental files.
- **“Commit only X”**: stage only X-related files/hunks; leave and report unrelated changes.
- **Merge/rebase/cherry-pick in progress**: stop if conflicts exist unless the user is intentionally completing that operation.

## Final response

Report:

- branch
- commit hash(es) and subject(s)
- checks run and results
- remaining uncommitted files
- skipped checks or follow-up needed

Do not push unless explicitly asked; offer to push only as a next step.
