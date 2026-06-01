---
name: create-mr
description: Create a merge request / pull request from the current git branch. Use this skill whenever the user asks to create an MR, merge request, PR, pull request, review request, or wants to open the current branch for review on GitHub or GitLab. This skill checks the repository host and required CLI first, then checks the default branch, compares commits, generates a title and functional markdown description, creates the MR/PR, and removes the temporary description file.
---

# Create MR / PR

Create a GitLab merge request or GitHub pull request for the current branch using the provider CLI. The user wants it created, not drafted. MR/PR creation and branch pushes are network writes authorized by this request.

## Workflow

### 1. Validate repo, branch, provider, and CLI

Check prerequisites before generating any title or description:

```bash
git rev-parse --is-inside-work-tree
git branch --show-current
git status --short
git remote get-url origin
```

Stop if:

- not inside a git repository
- current branch is empty or detached
- `origin` is missing; ask which remote/provider to use

Mention uncommitted changes briefly; they are not included unless committed.

Infer provider from `origin`:

- GitHub (`github.com` or GitHub SSH URL): use `gh`
- GitLab (`gitlab.com` or GitLab SSH URL): use `glab`
- self-hosted: infer when obvious, otherwise ask GitHub or GitLab

Immediately check the required CLI:

```bash
command -v gh    # GitHub
command -v glab  # GitLab
```

If missing, stop and name the missing command. Do not use raw API calls unless explicitly requested.

Optionally verify auth:

```bash
gh auth status
# or
glab auth status
```

If auth is missing or expired, ask the user to authenticate and rerun.

### 2. Determine base branch

Prefer the remote default branch; fetch once if needed; only fall back to `main` or `develop`:

```bash
DEFAULT_BRANCH=$(git symbolic-ref --quiet --short refs/remotes/origin/HEAD 2>/dev/null | sed 's#^origin/##')

if [ -z "$DEFAULT_BRANCH" ]; then
  git fetch origin --prune
  DEFAULT_BRANCH=$(git symbolic-ref --quiet --short refs/remotes/origin/HEAD 2>/dev/null | sed 's#^origin/##')
fi

if [ -z "$DEFAULT_BRANCH" ]; then
  if git show-ref --verify --quiet refs/remotes/origin/main || git show-ref --verify --quiet refs/heads/main; then
    DEFAULT_BRANCH=main
  elif git show-ref --verify --quiet refs/remotes/origin/develop || git show-ref --verify --quiet refs/heads/develop; then
    DEFAULT_BRANCH=develop
  fi
fi

printf '%s\n' "$DEFAULT_BRANCH"
```

If still unknown, ask for the base branch. If the current branch is the base branch, stop.

### 3. Inspect branch changes

Fetch the base and compare:

```bash
git fetch origin "$DEFAULT_BRANCH" --prune
CURRENT_BRANCH=$(git branch --show-current)
git log --oneline "origin/$DEFAULT_BRANCH..HEAD"
git diff --stat "origin/$DEFAULT_BRANCH...HEAD"
git diff --name-status "origin/$DEFAULT_BRANCH...HEAD"
```

If there are no commits unique to the current branch, stop: there is nothing to merge.

Use commit subjects and changed files to infer the functional intent. For many commits, summarize by feature area rather than listing every commit.

### 4. Create title and description file

Choose a concise review title from the branch name and commits:

- Describe the functional or user-visible change.
- Use imperative or noun-phrase style.
- Remove raw prefixes like `feature/`, `fix/`, `kat/`, and ticket IDs unless useful.
- Keep it under ~80 characters when possible.

Create a unique temp description file in the current directory:

```bash
DESC_FILE="./mr-description-$(date +%Y%m%d-%H%M%S).md"
```

Respect repository templates where practical:

- GitHub: `.github/pull_request_template.md`, `.github/PULL_REQUEST_TEMPLATE/*.md`
- GitLab: `.gitlab/merge_request_template.md`, `.gitlab/merge_request_templates/*.md`

Write a functional markdown description, not just a commit list:

```markdown
## Summary
- Briefly describe what changed and why.

## Changes
- Functional change 1.
- Functional change 2.
- Notable refactor, migration, or config change.

## Testing
- Tests run in this session or evident from command output.
- If none: Not run (not requested).
```

Do not invent test results or include secrets, tokens, or private credentials.

### 5. Push branch

Check upstream:

```bash
git rev-parse --abbrev-ref --symbolic-full-name @{u}
```

If no upstream:

```bash
git push -u origin "$CURRENT_BRANCH"
```

If upstream exists:

```bash
git push
```

If push fails, stop and keep the description file for retry.

### 6. Create the MR/PR

GitHub:

```bash
gh pr create \
  --base "$DEFAULT_BRANCH" \
  --head "$CURRENT_BRANCH" \
  --title "$TITLE" \
  --body-file "$DESC_FILE"
```

GitLab:

```bash
glab mr create \
  --target-branch "$DEFAULT_BRANCH" \
  --source-branch "$CURRENT_BRANCH" \
  --title "$TITLE" \
  --description "$(cat "$DESC_FILE")" \
  --yes
```

If the CLI reports an existing MR/PR, show its URL and do not create a duplicate.

### 7. Clean up and report

After successful creation only, delete the temp file:

```bash
rm -f "$DESC_FILE"
```

If creation fails, keep the file and report its path. Do not delete any other file.

Final response, short:

- MR/PR URL, if printed
- base and source branches
- title used
- whether the temp description file was deleted or preserved
