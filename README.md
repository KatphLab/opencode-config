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

This configuration uses a multi-tier agent system with different models assigned based on task complexity:

### High Complexity Agents

| Agent                     | Purpose                                                             | Model          | When Invoked                      |
| ------------------------- | ------------------------------------------------------------------- | -------------- | --------------------------------- |
| **creation-orchestrator** | Orchestrates creation workflows across skills, agents, and commands | openai/gpt-5.4 | Complex multi-step creation tasks |
| **feature-lead**          | Leads feature development from spec to implementation               | openai/gpt-5.4 | Major feature implementation      |
| **debug-lead**            | Leads debugging of complex issues across systems                    | openai/gpt-5.4 | Complex debugging scenarios       |

### Medium Complexity Agents

| Agent               | Purpose                                                    | Model                      | When Invoked                            |
| ------------------- | ---------------------------------------------------------- | -------------------------- | --------------------------------------- |
| **reviewer**        | Reviews code, specs, and plans for quality and correctness | minimax/MiniMax-M2.7       | Code review, spec review, plan review   |
| **feature-manager** | Manages feature implementation tasks and coordination      | openai/gpt-5.3-codex       | Feature task management                 |
| **discovery**       | Explores codebases and gathers context for tasks           | deepseek/deepseek-reasoner | Codebase exploration, context gathering |
| **quick-lead**      | Leads quick execution tasks and simple implementations     | minimax/MiniMax-M2.7       | Quick tasks, simple implementations     |

### Low Complexity Agents

| Agent       | Purpose                                  | Model                | When Invoked                        |
| ----------- | ---------------------------------------- | -------------------- | ----------------------------------- |
| **builder** | Executes implementation tasks from plans | openai/gpt-5.4-mini  | Plan execution, code implementation |

### Agent Dispatch Pattern

Agents are dispatched based on:

1. **Task complexity** (high/medium/low)
2. **Task type** (creation, debugging, review, implementation)
3. **Available context** and requirements

The system automatically selects the appropriate agent based on the task characteristics.

## Commands Guide

Custom commands provide streamlined workflows for common operations:

| Command             | Purpose                           | Syntax                          | Examples                                |
| ------------------- | --------------------------------- | ------------------------------- | --------------------------------------- |
| **create-agent**    | Create new agent definitions      | `create-agent <agent-name>`     | `create-agent data-analyst`             |
| **create-skill**    | Create new skill definitions      | `create-skill <skill-name>`     | `create-skill data-visualization`       |
| **create-command**  | Create new command definitions    | `create-command <command-name>` | `create-command analyze-data`           |
| **debug**           | Debug code and systems            | `debug <issue-description>`     | `debug "API returning 500 error"`       |
| **design-opencode** | Design OpenCode configurations    | `design-opencode <requirement>` | `design-opencode "add logging system"`  |
| **feature**         | Manage feature development        | `feature <feature-name>`        | `feature "add user authentication"`     |
| **medium-lead**     | Medium complexity task management | `medium-lead <task>`            | `medium-lead "refactor database layer"` |
| **quick**           | Quick task execution              | `quick <task>`                  | `quick "add comment to function"`       |

### Command Usage

Commands can be invoked directly in OpenCode sessions. They trigger the appropriate agents and skills based on the command type and complexity.

### Example Workflow

```bash
# Start with a feature
feature "add dark mode toggle"

# Debug issues that arise
debug "theme not applying correctly"

# Create custom components if needed
create-skill theme-manager
```

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
  "permission": {
    "*": "deny",
    "read": "allow",
    "grep": "allow",
    "glob": "allow",
    "todowrite": "allow",
    "todoread": "allow",
    "skill": "allow"
  },
  "agent": {
    // Agent definitions with model assignments
    "build": {
      "model": "deepseek/deepseek-chat"
    },
    "plan": {
      "model": "deepseek/deepseek-chat"
    },
    "builder": {
      "model": "openai/gpt-5.4-mini",
      "options": {
        "reasoningEffort": "high"
      }
    }
  },
  "mcp": {
    "stitch": {
      "type": "remote",
      "url": "https://stitch.googleapis.com/mcp",
      "headers": {
        "X-Goog-Api-Key": "{env:STITCH_API_KEY}"
      },
      "timeout": 1200000,
      "enabled": false
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
   ```

2. **Plugin Location:** `plugins/telegram-notify.ts`

3. **Message Format:**

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
- Requires both environment variables to be set
- Gracefully handles missing data or API failures

## Usage Examples

### Example 1: Creating a New Skill

```bash
# Invoke the skill-creator skill
@skill-creator create data-visualization

# Follow the interactive prompts:
# 1. Skill name: data-visualization
# 2. Description: Create data visualization components and charts
# 3. Triggers: "chart", "graph", "visualization", "plot"
# 4. Dependencies: d3.js, chart.js, recharts

# The skill will be created in skills/data-visualization/
```

### Example 2: Debugging Code

```bash
# Use the debug command
debug "Component rendering slowly with large datasets"

# The system will:
# 1. Dispatch debug-lead agent (high complexity)
# 2. Analyze performance issues
# 3. Suggest optimizations (memoization, virtualization)
# 4. Implement fixes with builder agent
```

### Example 3: Building React Components

```bash
# Use react-ts-frontend skill
@react-ts-frontend create DashboardComponent

# Creates:
# - src/components/DashboardComponent.tsx
# - src/components/DashboardComponent.test.tsx
# - Tailwind styling
# - TypeScript interfaces
```

### Example 4: Complete Feature Workflow

```bash
# Start feature development
feature "add user profile page"

# System orchestrates:
# 1. feature-lead agent creates specification
# 2. designer creates UI mockups (if Stitch enabled)
# 3. builder implements components
# 4. reviewer validates implementation
# 5. Tests are written and run
```

### Best Practices

1. **Start with commands**: Use `feature`, `debug`, or `quick` commands for common tasks
2. **Let skills auto-activate**: Skills trigger based on context; don't force them
3. **Trust the agent hierarchy**: The system selects appropriate agents automatically
4. **Use @ syntax for explicit skill invocation**: When you know which skill you need
5. **Review generated specs/plans**: Always review before implementation

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
