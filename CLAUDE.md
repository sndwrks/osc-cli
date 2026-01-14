# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm run build        # Compile TypeScript to dist/
npm start -- <cmd>   # Run CLI commands (e.g., npm start -- listen-udp -p 8000)
npm run dev          # Build and run in one step
npm test             # Run unit tests
npm run lint         # Run ESLint
```

## Linting

Uses ESLint 8 with airbnb-base config for both linting and code style. Key rules:
- Space before function parens: `function name ()` not `function name()`
- Import extensions: `.js` required for local imports, not for `.ts`

```bash
npx eslint src/      # Run linter
```

## Architecture

This is a TypeScript CLI tool for sending/receiving OSC (Open Sound Control) messages over UDP and TCP. Built with Commander.js for CLI parsing and the `osc` npm package for protocol handling.

**Entry Point:** `src/cli.ts` - Defines all commands using Commander, configures logging via `@sndwrks/lumberjack`

**Four functional modules:**
- `src/osc-servers/` - UDP and TCP listeners that log incoming OSC messages
- `src/osc-senders/` - Single message senders for UDP and TCP
- `src/osc-load-test/` - Batch load testing using factory pattern (`createOscUdpLoadTest`, `createOscTcpLoadTest`)
- `src/osc-test/` - Integration testing: send to remote app, validate responses (`createOscUdpTest`, `createOscTcpTest`)

**Type definitions:** `src/types/` contains ambient declarations for the `osc` package and shared types

**Key patterns:**
- All functions receive a `Logger` instance as first parameter
- UDP uses default port 51000, TCP uses 51001
- Load testers use recursive functions with setTimeout for message rate control
