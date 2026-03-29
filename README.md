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
- [Configuration Details](#configuration-details)
- [Usage Examples](#usage-examples)
- [Troubleshooting & FAQ](#troubleshooting--faq)

This repository provides an enhanced OpenCode configuration with specialized skills for development workflows, custom agents for different task complexities, and commands for common operations. It integrates the "superpowers" plugin for advanced capabilities.

## Features

- **12+ Specialized Skills**: From React development to Stitch design automation
- **Multi-tier Agent System**: High/medium/low complexity agents with appropriate model assignments
- **Custom Commands**: Streamlined workflows for common tasks
- **Superpowers Integration**: Enhanced capabilities through the superpowers plugin
- **MCP Server Support**: Stitch and Notion integrations (configurable)
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
   git clone https://github.com/katphlab/opencode ~/.config/opencode-new
   mv ~/.config/opencode-new/* ~/.config/opencode/
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

| Skill                 | Description                                                                                             | When to Use                                                                                         | Examples                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **design-md**         | Analyze Stitch projects and synthesize semantic design systems into DESIGN.md files                     | When working with Stitch designs that need design system documentation                              | `@design-md analyze project.stitch`                                       |
| **shadcn**            | Manage shadcn components and projects — adding, searching, fixing, debugging, styling, and composing UI | When working with shadcn/ui, component registries, or projects with components.json                 | `@shadcn add button`, `@shadcn init`                                      |
| **agent-browser**     | Browser automation CLI for AI agents                                                                    | When needing to interact with websites, fill forms, click buttons, take screenshots, or scrape data | `@agent-browser open https://example.com`, `@agent-browser fill form`     |
| **stitch-design**     | Unified entry point for Stitch design work                                                              | When doing UI/UX design work with Stitch, needs prompt enhancement or design system synthesis       | `@stitch-design create dashboard`                                         |
| **skill-creator**     | Create or update reusable OpenCode skills                                                               | When creating new skills or editing existing skills for any project                                 | `@skill-creator create new-skill`                                         |
| **react-components**  | Convert Stitch designs into modular Vite and React components                                           | When converting Stitch designs to React components with AST-based validation                        | `@react-components convert design.stitch`                                 |
| **agent-creator**     | Create or update OpenCode agents                                                                        | When creating new agents or editing existing agents for any project                                 | `@agent-creator create new-agent`                                         |
| **stitch-loop**       | Iteratively build websites using Stitch with autonomous baton-passing                                   | When building websites iteratively with Stitch using loop patterns                                  | `@stitch-loop build portfolio-site`                                       |
| **enhance-prompt**    | Transform vague UI ideas into polished, Stitch-optimized prompts                                        | When needing to enhance UI prompts with specificity and design system context                       | `@enhance-prompt "create login page"`                                     |
| **command-creator**   | Create or update reusable OpenCode commands                                                             | When creating new commands or editing existing commands                                             | `@command-creator create new-command`                                     |
| **react-ts-frontend** | Modern React stack: React 19, TypeScript, Tailwind CSS, Vite, TanStack Query                            | When building React apps, components, state management, or UI                                       | `@react-ts-frontend create component`, `@react-ts-frontend setup project` |

### Skill Activation

Skills activate automatically when their triggers match the task context. You can also explicitly invoke skills using `@skill-name` syntax.

## Agents Reference

This configuration uses an orchestrator-based agent system where a primary orchestrator delegates work to specialized subagents through structured workflows (lanes).

### Primary Orchestrator

| Agent           | Purpose                                                                    | When Invoked                                         |
| --------------- | -------------------------------------------------------------------------- | ---------------------------------------------------- |
| **orchestrator** | Delegation-first orchestrator that follows slash-command workflows and manages subagents without direct repo edits | All tasks initiated via commands |
| **creation-orchestrator** | Coordinates creation/updating of OpenCode agents, commands, and skills | When creating or updating OpenCode artifacts |

### Subagents

| Agent               | Purpose                                                    | Invoked By                                      |
| ------------------- | ---------------------------------------------------------- | ----------------------------------------------- |
| **discovery**       | Read-only mapper for repo patterns, edit targets, and verification paths | Orchestrator for codebase mapping |
| **reviewer**        | Critiques designs and plans for repo fit, edge cases, and avoidable risk | Orchestrator for adversarial review |
| **feature-manager** | Splits an approved feature design into repo-aligned builder tracks | Orchestrator for execution planning |
| **builder**         | Executes one approved implementation track and halts on ambiguity | Orchestrator for implementation |

### Agent Dispatch Pattern

Agents are dispatched through a lane-based workflow system:

1. **Commands define lanes**: `/feature`, `/debug`, `/medium`, `/quick` determine the workflow
2. **Orchestrator manages execution**: The primary orchestrator follows command workflows and delegates to subagents
3. **Subagent roles**:
   - `@discovery` - Repository mapping and pattern identification
   - `@reviewer` - Design critique and risk assessment  
   - `@feature-manager` - Track planning and execution structure
   - `@builder` - Implementation execution
4. **Approval gates**: User confirmation required at key checkpoints before execution

## Commands Guide

Custom commands provide streamlined workflows through lane-based execution patterns:

| Command             | Purpose                           | Syntax                          | Lane Description |
| ------------------- | --------------------------------- | ------------------------------- | ---------------- |
| **feature**         | Major feature development lane    | `feature <description>`         | Full workflow with discovery, design, critique, track planning, and execution |
| **debug**           | Debug and fix issues              | `debug <issue-description>`     | Evidence-first debugging from symptoms to root cause to narrow fix |
| **medium**          | Medium-complexity work            | `medium <description>`        | Lighter than feature, more structured than quick |
| **quick**           | Quick, small isolated changes     | `quick <description>`           | One tiny plan, one build track for low-risk changes |
| **create-agent**    | Create new agent definitions      | `create-agent <agent-name>`     | Interactive agent creation via creation-orchestrator |
| **create-skill**    | Create new skill definitions      | `create-skill <skill-name>`     | Interactive skill creation via creation-orchestrator |
| **create-command**  | Create new command definitions    | `create-command <command-name>` | Interactive command creation via creation-orchestrator |
| **design-opencode** | Design OpenCode configurations    | `design-opencode <requirement>` | Design agents, commands, or skills setup |

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

## Configuration Details

### opencode.json Structure

The main configuration file (`opencode.json`) includes:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "server": {
    "cors": ["{env:OPENCODE_DOMAIN}"]
  },
  "plugin": ["superpowers@git+https://github.com/obra/superpowers.git"],
  "agent": {
    "plan": {
      "options": {},
      "permission": {
        "markdown_*": "allow",
        "webfetch": "allow",
        "websearch": "allow"
      }
    },
    "build": {
      "options": {},
      "permission": {
        "bash": "allow",
        "apply_patch": "allow",
        "edit": "allow",
        "write": "allow"
      }
    },
    "creation-orchestrator": {
      "model": "openai/gpt-5.4",
      "options": {},
      "permission": {}
    },
    "feature-lead": {
      "model": "openai/gpt-5.4",
      "options": {},
      "permission": {}
    },
    "debug-lead": {
      "model": "openai/gpt-5.4",
      "options": {},
      "permission": {}
    },
    "reviewer": {
      "model": "fireworks-ai/accounts/fireworks/routers/kimi-k2p5-turbo",
      "options": {},
      "permission": {}
    },
    "feature-manager": {
      "model": "openai/gpt-5.3-codex",
      "options": {},
      "permission": {}
    },
    "discovery": {
      "model": "fireworks-ai/accounts/fireworks/routers/kimi-k2p5-turbo",
      "options": {},
      "permission": {}
    },
    "quick-lead": {
      "model": "minimax/MiniMax-M2.7",
      "options": {},
      "permission": {}
    },
    "builder": {
      "model": "openai/gpt-5.4-mini",
      "options": {
        "reasoningEffort": "high"
      },
      "permission": {}
    }
  },
  "mcp": {
    "stitch": {
      "type": "remote",
      "url": "https://stitch.googleapis.com/mcp",
      "enabled": false,
      "headers": {
        "X-Goog-Api-Key": "{env:STITCH_API_KEY}"
      },
      "timeout": 1200000
    },
    "notion": {
      "type": "remote",
      "url": "https://mcp.notion.com/mcp",
      "enabled": false
    },
    "sonarqube": {
      "type": "local",
      "command": [
        "docker",
        "run",
        "--rm",
        "-i",
        "-e",
        "SONARQUBE_TOKEN",
        "-e",
        "SONARQUBE_URL",
        "mcp/sonarqube"
      ],
      "environment": {
        "SONARQUBE_TOKEN": "{env:SONARQUBE_TOKEN}",
        "SONARQUBE_URL": "{env:SONARQUBE_URL}"
      },
      "enabled": false,
      "timeout": 60000
    }
  },
  "permission": {
    "*": "deny",
    "read": "allow",
    "grep": "allow",
    "glob": "allow",
    "todowrite": "allow",
    "todoread": "allow",
    "skill": "allow"
  }
}
```

### Permission System

The configuration uses a deny-by-default permission model:

- **Base permissions**: read, grep, glob, todowrite, todoread, skill
- **Agent-specific permissions**: Additional tools granted per agent type
- **Security**: Explicit allow listing prevents unauthorized tool access

### MCP Server Configuration

- **Stitch**: Design automation server (requires API key)
- **Notion**: Notion integration (disabled by default)
- **SonarQube**: Code quality and security analysis server (requires Docker, SONARQUBE_TOKEN, and SONARQUBE_URL environment variables)

All MCP servers are configurable and can be enabled as needed.

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

### Best Practices

1. **Use appropriate lane commands**: Choose `/quick` for small isolated changes, `/medium` for moderate complexity, `/feature` for complex work with design checkpoints, `/debug` for investigating issues
2. **Follow orchestrator-led workflows**: The orchestrator manages the lane workflow; don't skip approval gates
3. **Let skills auto-activate**: Skills trigger based on context; don't force them
4. **Trust the subagent delegation**: Discovery, reviewer, feature-manager, and builder are specialized roles
5. **Use @ syntax for explicit skill invocation**: When you know which skill you need
6. **Review and approve at checkpoints**: Always review plans before giving final approval at execution gates

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
