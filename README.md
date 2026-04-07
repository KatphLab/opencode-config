# OpenCode Enhanced Configuration

[![OpenCode](https://img.shields.io/badge/OpenCode-Configuration-blue)](https://opencode.ai)
[![Superpowers](https://img.shields.io/badge/Plugin-Superpowers-green)](https://github.com/obra/superpowers)

> A comprehensive configuration for OpenCode with custom skills, agents, commands, and superpowers plugin integration.

## Table of Contents

- [Overview](#overview)
- [Installation & Setup](#installation--setup)
- [Skills Catalog](#skills-catalog)
- [Agents Reference](#agents-reference)
- [Commands Guide](#commands-guide)
- [MCP Servers](#mcp-servers)
- [Usage Examples](#usage-examples)
- [Troubleshooting & FAQ](#troubleshooting--faq)

This repository provides an enhanced OpenCode configuration with specialized skills for development workflows, custom agents for different task complexities, and commands for common operations. It integrates the "superpowers" plugin for advanced capabilities.

## Features

- **17+ Specialized Skills**: From React development to Stitch design automation
- **Multi-tier Agent System**: High/medium/low complexity agents with appropriate model assignments
- **Custom Commands**: Streamlined workflows for common tasks
- **Superpowers Integration**: Enhanced capabilities through the superpowers plugin
- **MCP Server Support**: Stitch, Notion, SonarQube, and Linear integrations
- **Telegram Notifications**: Real-time session completion alerts via Telegram bot

## Prerequisites

- [OpenCode](https://opencode.ai/) installed and configured
- Environment variables (optional):
  - `STITCH_API_KEY`: For Stitch MCP server integration
  - `OPENCODE_DOMAIN`: For CORS configuration
  - `OPENCODE_TELEGRAM_BOT_TOKEN`: For Telegram notifications (get from BotFather)
  - `OPENCODE_TELEGRAM_CHAT_ID`: For Telegram notifications (your chat ID)
  - `OPENCODE_TELEGRAM_NOTIFY_ENABLED`: Set to `false` to disable Telegram notifications without removing config
  - `SONARQUBE_TOKEN`: For SonarQube MCP server integration
  - `SONARQUBE_URL`: For SonarQube MCP server integration

## Installation & Setup

### Using This Configuration

This configuration is designed for the OpenCode configuration directory (`~/.config/opencode`). To use it:

1. **Backup your existing configuration** (if any):

   ```bash
   cp -r ~/.config/opencode ~/.config/opencode.backup
   ```

2. **Clone or copy this configuration**:

   ```bash
   # If cloning as a new configuration
   git clone https://github.com/katphlab/opencode-config ~/.config/opencode
   ```

3. **Configure environment variables** (optional):

   ```bash
    # Add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
    export STITCH_API_KEY="your-stitch-api-key"
    export OPENCODE_DOMAIN="your-opencode-domain"
    export OPENCODE_TELEGRAM_BOT_TOKEN="your-bot-token-from-botfather"
    export OPENCODE_TELEGRAM_CHAT_ID="your-chat-id"
    export OPENCODE_TELEGRAM_NOTIFY_ENABLED="true"  # Set to "false" to disable
    export SONARQUBE_TOKEN="your-sonarqube-token"
    export SONARQUBE_URL="https://your-sonarqube-instance.com"
   ```

4. **Verify configuration**:
   ```bash
   opencode --version
   ```

### Configuration Structure

The main configuration file is `opencode.json` which defines:

- Server settings (CORS, domains)
- Plugin integrations (superpowers)
- Permission system
- Agent definitions with model assignments
- MCP server configurations

## Skills Catalog

OpenCode skills are specialized workflows that activate automatically based on task context. This configuration includes:

| Skill | Description | When to Use | Examples |
|-------|-------------|-------------|----------|
| **sonar-quality-gate-check** | Analyze SonarQube quality gates, issues, coverage, and security hotspots | When reviewing SonarQube quality reports or preparing for merge | `@sonar-quality-gate-check analyze` |
| **find-skills** | Discover and install agent skills from the open skills ecosystem | When looking for specialized functionality or asking "how do I do X" | `@find-skills search "testing"` |
| **prd** | Generate high-quality Product Requirements Documents | When starting new products, planning features, or defining requirements | `@prd create "user authentication system"` |
| **frontend-design** | Create distinctive, production-grade frontend interfaces | When building web components, pages, or applications with high design quality | `@frontend-design create landing page` |
| **grill-me** | Interview the user relentlessly about plans or designs | When stress-testing a plan, getting grilled on design, or mentions "grill me" | `@grill-me about this architecture` |
| **langgraph-docs** | Fetch and reference LangGraph Python documentation | When building stateful agents, multi-agent workflows, or LangGraph implementations | `@langgraph-docs about human-in-the-loop` |
| **design-md** | Analyze Stitch projects and synthesize semantic design systems into DESIGN.md files | When working with Stitch designs that need design system documentation | `@design-md analyze project.stitch` |
| **shadcn** | Manage shadcn components and projects — adding, searching, fixing, debugging, styling, and composing UI | When working with shadcn/ui, component registries, or projects with components.json | `@shadcn add button`, `@shadcn init` |
| **agent-browser** | Browser automation CLI for AI agents | When needing to interact with websites, fill forms, click buttons, take screenshots, or scrape data | `@agent-browser open https://example.com`, `@agent-browser fill form` |
| **stitch-design** | Unified entry point for Stitch design work | When doing UI/UX design work with Stitch, needs prompt enhancement or design system synthesis | `@stitch-design create dashboard` |
| **skill-creator** | Create or update reusable OpenCode skills | When creating new skills or editing existing skills for any project | `@skill-creator create new-skill` |
| **react-components** | Convert Stitch designs into modular Vite and React components | When converting Stitch designs to React components with AST-based validation | `@react-components convert design.stitch` |
| **agent-creator** | Create or update OpenCode agents | When creating new agents or editing existing agents for any project | `@agent-creator create new-agent` |
| **stitch-loop** | Iteratively build websites using Stitch with autonomous baton-passing | When building websites iteratively with Stitch using loop patterns | `@stitch-loop build portfolio-site` |
| **enhance-prompt** | Transform vague UI ideas into polished, Stitch-optimized prompts | When needing to enhance UI prompts with specificity and design system context | `@enhance-prompt "create login page"` |
| **command-creator** | Create or update reusable OpenCode commands | When creating new commands or editing existing commands | `@command-creator create new-command` |
| **react-ts-frontend** | Modern React stack: React 19, TypeScript, Tailwind CSS, Vite, TanStack Query | When building React apps, components, state management, or UI | `@react-ts-frontend create component`, `@react-ts-frontend setup project` |

### Skill Activation

Skills activate automatically when their triggers match the task context. You can also explicitly invoke skills using `@skill-name` syntax.

## Agents Reference

This configuration uses an orchestrator-based agent system where a primary orchestrator delegates work to specialized subagents through structured workflows (lanes).

### Primary Orchestrator

| Agent | Purpose | When Invoked |
|-------|---------|--------------|
| **orchestrator** | Delegation-first orchestrator that follows slash-command workflows and manages subagents without direct repo edits | All tasks initiated via commands |
| **creation-orchestrator** | Coordinates creation/updating of OpenCode agents, commands, and skills | When creating or updating OpenCode artifacts |

### Subagents

| Agent | Purpose | Invoked By |
|-------|---------|------------|
| **discovery** | Read-only mapper for repo patterns, edit targets, and verification paths | Orchestrator for codebase mapping |
| **reviewer** | Critiques designs and plans for repo fit, edge cases, and avoidable risk | Orchestrator for adversarial review |
| **feature-manager** | Splits an approved feature design into repo-aligned builder tracks | Orchestrator for execution planning |
| **builder** | Executes one approved implementation track and halts on ambiguity | Orchestrator for implementation |
| **project-manager** | Expert Project Manager for small personal coding projects using Linear.app via MCP | When planning, organizing, or tracking projects with Linear |

### Agent Dispatch Pattern

Agents are dispatched through a lane-based workflow system:

1. **Commands define lanes**: `/feature`, `/debug`, `/medium`, `/quick` determine the workflow
2. **Orchestrator manages execution**: The primary orchestrator follows command workflows and delegates to subagents
3. **Subagent roles**:
   - `@discovery` - Repository mapping and pattern identification
   - `@reviewer` - Design critique and risk assessment  
   - `@feature-manager` - Track planning and execution structure
   - `@builder` - Implementation execution
   - `@project-manager` - Linear project management and task organization
4. **Approval gates**: User confirmation required at key checkpoints before execution

## Commands Guide

Custom commands provide streamlined workflows through lane-based execution patterns:

| Command | Purpose | Syntax | Lane Description |
|---------|---------|--------|------------------|
| **feature** | Major feature development lane | `feature <description>` | Full workflow with discovery, design, critique, track planning, and execution |
| **debug** | Debug and fix issues | `debug <issue-description>` | Evidence-first debugging from symptoms to root cause to narrow fix |
| **medium** | Medium-complexity work | `medium <description>` | Lighter than feature, more structured than quick |
| **quick** | Quick, small isolated changes | `quick <description>` | One tiny plan, one build track for low-risk changes |
| **create-agent** | Create new agent definitions | `create-agent <agent-name>` | Interactive agent creation via creation-orchestrator |
| **create-skill** | Create new skill definitions | `create-skill <skill-name>` | Interactive skill creation via creation-orchestrator |
| **create-command** | Create new command definitions | `create-command <command-name>` | Interactive command creation via creation-orchestrator |
| **design-opencode** | Design OpenCode configurations | `design-opencode <requirement>` | Design agents, commands, or skills setup |

### Lane Workflows

**Feature Lane** (`/feature`):
1. Intake - Clarify scope and acceptance criteria
2. Discovery - Delegate codebase mapping to `@discovery`
3. Initial plan - Draft implementation direction
4. Detailed design - Propose concrete approach
5. Adversarial review - Send to `@reviewer` for critique
6. Build plan - Delegate track planning to `@feature-manager`
7. Approval gate - User confirmation before execution
8. Execution - Delegate tracks to `@builder`
9. Diagnostics and docs - Final cleanup
10. Wrap up - Report changes and residual risks

**Debug Lane** (`/debug`):
1. Triage - Invoke systematic debugging
2. Map the failure - Delegate to `@discovery`
3. Hypothesis - State likely root cause with evidence
4. Fix plan - Write smallest targeted change set
5. Critique - Use `@reviewer` when risk is non-trivial
6. Approval gate - User confirmation
7. Execution - Delegate to `@builder`
8. Verify and wrap - Confirm fix and report findings

**Medium Lane** (`/medium`):
1. Intake - Clarify scope
2. Lightweight discovery - Narrow repo mapping
3. Goal setting - Define concrete behavior change
4. Scoped implementation approach - Compact plan
5. Feature-manager handoff - Delegate to `@feature-manager`
6. Approval gate - User confirmation
7. Execute and monitor - Delegate to `@builder`
8. Wrap up - Report status and risks

**Quick Lane** (`/quick`):
1. Quick scope check - Confirm task is narrow
2. Minimal context gathering - Delegate to `@discovery` if needed
3. Tiny plan - One compact execution track
4. Approval gate - User confirmation
5. Execute - Delegate to `@builder`
6. Wrap up - Report changes and risks

## MCP Servers

MCP (Model Context Protocol) servers extend OpenCode capabilities with external integrations:

| Server | Type | Purpose | Status |
|--------|------|---------|--------|
| **stitch** | Remote | Design automation server for Stitch integration | Disabled (requires `STITCH_API_KEY`) |
| **notion** | Remote | Notion workspace integration | Disabled |
| **sonarqube** | Local | Code quality and security analysis via Docker | Disabled (requires `SONARQUBE_TOKEN` and `SONARQUBE_URL`) |
| **linear** | Remote | Project management via Linear.app | **Enabled** |

### Linear Integration

The Linear MCP server enables the `project-manager` agent to:

- List and filter issues, projects, teams, and cycles
- Create and update issues with subtasks, comments, and status changes
- Manage projects, roadmaps, and cycles
- Set priorities, labels, assignees, and dependencies

Usage:
```bash
# The project-manager agent activates automatically for project management tasks
"plan the next milestone"
"break this feature into tasks"
"what should I work on today?"
```

### SonarQube Integration

The SonarQube MCP server (via Docker) provides:

- Quality gate status checking
- Code coverage analysis
- Security hotspot detection
- Code smell and bug reporting

Enable by setting environment variables and enabling in `opencode.json`.

### Plugin System

The **superpowers** plugin provides:

- Enhanced skill system with automatic activation
- Structured workflows (brainstorming, TDD, debugging)
- Subagent dispatch patterns
- Plan and spec review systems

#### Telegram Notify Plugin

The `telegram-notify.ts` plugin sends Telegram notifications when OpenCode sessions complete, providing real-time updates on agent activity.

**Features:**

- Sends formatted Telegram messages when sessions go idle (complete)
- Includes project name, session title, and worktree information
- Shows last user and assistant messages (truncated for readability)
- Filters out subagent messages (builder, reviewer) to reduce noise
- HTML formatting with proper escaping for Telegram

**Configuration:**

1. **Environment Variables:**

   ```bash
   export OPENCODE_TELEGRAM_BOT_TOKEN="your-bot-token-from-botfather"
   export OPENCODE_TELEGRAM_CHAT_ID="your-chat-id"
   export OPENCODE_TELEGRAM_NOTIFY_ENABLED="true"  # Optional, defaults to "true"
   ```

   | Variable | Description | Required |
   |----------|-------------|----------|
   | `OPENCODE_TELEGRAM_BOT_TOKEN` | Bot token from @BotFather | Yes |
   | `OPENCODE_TELEGRAM_CHAT_ID` | Your Telegram chat ID (get from @userinfobot) | Yes |
   | `OPENCODE_TELEGRAM_NOTIFY_ENABLED` | Set to `"false"` to disable without removing config | No (defaults to `true`) |

2. **Plugin Location:** `plugins/telegram-notify.ts`

3. **Setup Steps:**

   - **Get Bot Token**: Message @BotFather on Telegram and create a new bot
   - **Get Chat ID**: Message @userinfobot on Telegram to get your chat ID
   - **Add Bot to Chat**: Add the bot to your chat/channel (for groups, make it an admin)
   - **Set Environment Variables**: Add the variables to your shell profile
   - **Test**: Run an OpenCode session and wait for it to complete (session goes idle)

4. **Message Format:**

   ```
   ✅ OpenCode Finished

   📦 Project: project-name
   🧠 Session: session-title
   📂 Worktree: worktree-path

   🙋 Last User Message
   [truncated user message]

   🤖 Last Assistant Message
   [truncated assistant message]
   ```

**How It Works:**

- Listens for `session.idle` events from OpenCode
- Retrieves session details and messages via OpenCode client API
- Formats messages with HTML for Telegram
- Sends notifications via Telegram Bot API

**Error Handling:**

- Logs errors to `/tmp/opencode-telegram-notify-error.log`
- Requires both `OPENCODE_TELEGRAM_BOT_TOKEN` and `OPENCODE_TELEGRAM_CHAT_ID` to be set
- Can be disabled by setting `OPENCODE_TELEGRAM_NOTIFY_ENABLED=false` without removing configuration
- Gracefully handles missing data or API failures
- Filters out notifications from subagents (builder, reviewer) to reduce noise

## Usage Examples

### Example 1: Quick Change

```bash
# Small, isolated, low-risk change
quick "fix typo in README"

# The orchestrator will:
# 1. Confirm scope is appropriate for quick lane
# 2. Delegate narrow discovery if needed
# 3. Create tiny execution plan
# 4. Request user confirmation
# 5. Execute with @builder
# 6. Report results
```

### Example 2: Medium Complexity Feature

```bash
# Multi-file feature that's not too complex
medium "add pagination to user list"

# The orchestrator will:
# 1. Clarify scope if needed
# 2. Delegate lightweight discovery to @discovery
# 3. Propose scoped implementation approach
# 4. Handoff to @feature-manager for track planning
# 5. Present execution plan for approval
# 6. Execute with @builder
# 7. Report changes and residual risks
```

### Example 3: Major Feature Development

```bash
# Complex feature requiring full workflow
feature "implement user authentication system"

# The orchestrator will:
# 1. Clarify scope, acceptance criteria, and risks
# 2. Delegate codebase mapping to @discovery
# 3. Draft initial implementation plan
# 4. Create detailed design with tradeoffs
# 5. Send to @reviewer for adversarial critique
# 6. Incorporate review feedback
# 7. Delegate track planning to @feature-manager
# 8. Present final execution plan for approval
# 9. Execute tracks with @builder
# 10. Report changes, validations, and next steps
```

### Example 4: Debugging

```bash
# Investigate and fix an issue
debug "login API returning 500 error"

# The orchestrator will:
# 1. Invoke systematic debugging
# 2. Clarify expected vs actual behavior
# 3. Delegate failure mapping to @discovery
# 4. Form hypothesis with root cause and evidence
# 5. Create targeted fix plan
# 6. Send to @reviewer for critique (if non-trivial)
# 7. Present plan for approval
# 8. Execute fix with @builder
# 9. Verify and report findings
```

### Example 5: Creating a New Skill

```bash
# Create a new skill
@skill-creator create data-visualization

# Follow the interactive prompts:
# 1. Skill name: data-visualization
# 2. Description: Create data visualization components and charts
# 3. Triggers: "chart", "graph", "visualization", "plot"
# 4. Dependencies: d3.js, chart.js, recharts

# The skill will be created in skills/data-visualization/
```

### Example 6: Building React Components

```bash
# Use react-ts-frontend skill
@react-ts-frontend create DashboardComponent

# Creates:
# - src/components/DashboardComponent.tsx
# - src/components/DashboardComponent.test.tsx
# - Tailwind styling
# - TypeScript interfaces
```

### Example 7: Project Management with Linear

```bash
# Plan a new milestone
"plan the next milestone for my side project"

# The project-manager agent will:
# 1. Fetch current Linear state
# 2. Suggest prioritized tasks
# 3. Create structured issues with acceptance criteria
# 4. Set up cycles or roadmaps
# 5. Provide next actions
```

### Example 8: Generate a PRD

```bash
# Create a product requirements document
@prd create "mobile app for task management"

# The skill will:
# 1. Interview you about requirements
# 2. Generate comprehensive PRD
# 3. Include user stories and technical specs
# 4. Provide risk analysis
```

### Example 9: SonarQube Quality Check

```bash
# Analyze SonarQube quality gate
@sonar-quality-gate-check analyze

# The skill will:
# 1. Check quality gate status
# 2. Report bugs, vulnerabilities, code smells
# 3. Show coverage and duplication metrics
# 4. Generate remediation report
```

### Best Practices

1. **Use appropriate lane commands**: Choose `/quick` for small isolated changes, `/medium` for moderate complexity, `/feature` for complex work with design checkpoints, `/debug` for investigating issues
2. **Follow orchestrator-led workflows**: The orchestrator manages the lane workflow; don't skip approval gates
3. **Let skills auto-activate**: Skills trigger based on context; don't force them
4. **Trust the subagent delegation**: Discovery, reviewer, feature-manager, and builder are specialized roles
5. **Use @ syntax for explicit skill invocation**: When you know which skill you need
6. **Review and approve at checkpoints**: Always review plans before giving final approval at execution gates
7. **Use Linear for project management**: The project-manager agent helps organize and track tasks via Linear

## Troubleshooting & FAQ

### Common Issues

#### Issue: Skills not activating

**Solution**: Check skill triggers match your task description. Use `@skill-name` for explicit invocation.

#### Issue: Permission denied for tools

**Solution**: Verify agent has required permissions in `opencode.json`. Check agent model assignments.

#### Issue: Stitch MCP server not connecting

**Solution**:

1. Set `STITCH_API_KEY` environment variable
2. Enable Stitch in `opencode.json`: `"enabled": true`
3. Check network connectivity

#### Issue: SonarQube MCP server not connecting

**Solution**:

1. Set `SONARQUBE_TOKEN` and `SONARQUBE_URL` environment variables
2. Enable SonarQube in `opencode.json`: `"enabled": true`
3. Ensure Docker is installed and running
4. Check Docker can pull the `mcp/sonarqube` image

#### Issue: Linear integration not working

**Solution**:

1. Check Linear MCP is enabled in `opencode.json`
2. Verify your OpenCode instance has Linear MCP configured
3. Ensure you have access to Linear workspace

#### Issue: Superpowers plugin not loading

**Solution**:

1. Verify plugin URL in `opencode.json`
2. Check internet connectivity for git clone
3. Restart OpenCode

#### Issue: Telegram notifications not working

**Solution**:

1. Verify both `OPENCODE_TELEGRAM_BOT_TOKEN` and `OPENCODE_TELEGRAM_CHAT_ID` are set
2. Check bot token permissions (should be from BotFather)
3. Verify chat ID is correct (use @userinfobot on Telegram)
4. Check error logs: `/tmp/opencode-telegram-notify-error.log`
5. Ensure bot is added to the chat/channel
6. Check `OPENCODE_TELEGRAM_NOTIFY_ENABLED` is not set to `false` (plugin is enabled by default)

### Frequently Asked Questions

#### Q: How do I add a new skill?

**A**: Use `create-skill` command or `@skill-creator` skill. Follow interactive prompts.

#### Q: Can I use different AI models?

**A**: Yes, edit `opencode.json` agent model assignments. Supported models depend on your OpenCode provider.

#### Q: How do I enable Notion integration?

**A**: Set `"enabled": true` in the Notion MCP configuration in `opencode.json`.

#### Q: How do I enable SonarQube integration?

**A**: Set `"enabled": true` in the SonarQube MCP configuration in `opencode.json` and ensure `SONARQUBE_TOKEN` and `SONARQUBE_URL` environment variables are set.

#### Q: Can I customize the permission system?

**A**: Yes, edit the `permission` section in `opencode.json`. Use deny-by-default for security.

#### Q: How do I contribute improvements?

**A**: Fork the repository, make changes, and submit a pull request.

### Debugging Tips

1. **Check logs**: OpenCode provides session logs for debugging
2. **Verify environment variables**: `echo $STITCH_API_KEY`, `echo $SONARQUBE_TOKEN`, `echo $SONARQUBE_URL`
3. **Test permissions**: Try simple commands first
4. **Isolate issues**: Disable plugins/MCP servers to identify problems
5. **Review agent assignments**: Check which agent is handling your task

### Getting Help

- **OpenCode Documentation**: https://opencode.ai/docs
- **GitHub Issues**: Report bugs or request features
- **Community Support**: OpenCode community forums
