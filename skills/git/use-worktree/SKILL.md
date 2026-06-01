---
name: use-worktree
description: Create git worktrees for parallel development. Use when the user mentions worktrees, wants to work on a branch, create a feature branch, or switch branches. Always create worktrees in .worktrees/ and run appropriate install commands.
---

# Git Worktree Management

Create isolated working directories for git branches using worktrees. This enables parallel development without stashing or committing incomplete work.

## Core Workflow

When a user wants to work on a branch (new or existing), create a worktree:

1. **Check if user explicitly doesn't want a worktree** — if they say "no worktree", "just switch branches", "don't use worktree", or similar, skip worktree creation and handle the branch normally.

2. **Create the worktree** in `.worktrees/<branch-name>`:
   ```bash
   git worktree add .worktrees/<branch-name> <branch-name>
   # For new branches:
   git worktree add -b <branch-name> .worktrees/<branch-name>
   ```

3. **Ensure `.worktrees/` is in `.gitignore`**:
   - Check if `.gitignore` already contains `.worktrees/` or `.worktrees`
   - If not present, ask the user: "I noticed `.worktrees/` isn't in `.gitignore`. Should I add it?"
   - Only add after explicit user approval

4. **Check tooling configs** before modifying:
   - Look for `.prettierrc`, `.eslintrc`, `eslint.config`, `tsconfig.json`, `prettier.config`, etc.
   - If they contain paths that would be affected by the worktree, ask user before modifying
   - Common patterns to watch: `include`/`exclude` arrays in tsconfig, `ignorePatterns` in eslint

5. **Run install commands** in the worktree directory (see detection sequence below)

## Install Detection Sequence

Run these checks in order, in the worktree directory. Execute the first match found.

### Step 1: Check Makefile

```bash
cd .worktrees/<branch-name> && grep -q "^install:" Makefile 2>/dev/null && echo "FOUND"
```

If `Makefile` has an `install` recipe:
```bash
make install
```
Then stop — the Makefile recipe handles everything.

### Step 2: Check Node.js / TypeScript

Detect package manager by lock file:

| Lock File | Package Manager | Install Command |
|-----------|-----------------|-----------------|
| `pnpm-lock.yaml` | pnpm | `pnpm install` |
| `yarn.lock` | yarn | `yarn install` |
| `bun.lockb` | bun | `bun install` |
| `package-lock.json` | npm | `npm install` |
| `package.json` (no lock) | npm (default) | `npm install` |

If a `package.json` exists but no lock file, prefer `pnpm install` if `pnpm` is available on the system, otherwise fall back to `npm install`.

### Step 3: Check Python

Detect Python tool by config files:

| Config File | Tool | Install Command |
|-------------|------|-----------------|
| `pyproject.toml` with `[tool.uv]` | uv | `uv sync` |
| `uv.lock` | uv | `uv sync` |
| `pyproject.toml` with `[tool.poetry]` | poetry | `poetry install` |
| `poetry.lock` | poetry | `poetry install` |
| `requirements.txt` | pip | `pip install -r requirements.txt` |
| `setup.py` or `setup.cfg` | pip | `pip install -e .` |
| `pyproject.toml` (generic) | pip | `pip install -e .` |

### Step 4: Check Other Languages

| Config File | Language | Install Command |
|-------------|----------|-----------------|
| `Cargo.toml` | Rust | `cargo fetch` |
| `go.mod` | Go | `go mod download` |
| `Gemfile` | Ruby | `bundle install` |
| `composer.json` | PHP | `composer install` |
| `mix.exs` | Elixir | `mix deps.get` |
| `build.gradle` / `build.gradle.kts` | Java/Kotlin | `./gradlew build` (if wrapper exists) |
| `pom.xml` | Java/Maven | `mvn install` |

### Step 5: No Known Build System

If none of the above are detected, inform the user:
"No standard build system detected. You may need to run install commands manually in the worktree."

## Branch Naming Conventions

Suggest branch names based on context:

- Feature: `feat/<description>` — e.g., `feat/user-auth`
- Bug fix: `fix/<description>` — e.g., `fix/login-error`
- Chore: `chore/<description>` — e.g., `chore/update-deps`
- If the user provides a name, use it as-is

## Listing Worktrees

To show existing worktrees:
```bash
git worktree list
```

## Removing Worktrees

When done with a worktree:
```bash
git worktree remove .worktrees/<branch-name>
```

If the worktree has uncommitted changes, warn the user first.

## Examples

**User: "I need to work on the login feature"**
```
→ git worktree add -b feat/login .worktrees/feat/login
→ Ensure .worktrees/ in .gitignore (ask if not present)
→ Detect package manager, run install
→ "Worktree created at .worktrees/feat/login. Dependencies installed."
```

**User: "Switch to the hotfix branch"**
```
→ git worktree add .worktrees/hotfix-crash hotfix-crash
→ Run install
```

**User: "Don't use a worktree, just switch branches"**
```
→ git checkout hotfix-crash
→ (Skip worktree creation entirely)
```

## Troubleshooting

**"fatal: <path> already exists"**
- The directory already exists. Check `git worktree list` — it may be registered.
- If stale, remove with `git worktree remove --force .worktrees/<branch-name>`

**"fatal: <branch> is already checked out"**
- Another worktree has this branch. Use `git worktree list` to find it.
- User may want to use the existing worktree instead.

**Worktree is "locked" or "prunable"**
- `git worktree prune` cleans up stale references
- `git worktree unlock .worktrees/<branch-name>` unlocks a locked worktree
