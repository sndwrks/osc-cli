# OSC CLI Tool

**DISCLAIMER: this was written by AI, but it will be maintained by humans (probably)**

A simple command-line application for sending and receiving OSC (Open Sound Control) messages via TCP and UDP.

## Features

- Listen for OSC messages via UDP
- Listen for OSC messages via TCP
- Listen on both protocols simultaneously
- Send OSC messages via UDP
- Send OSC messages via TCP
- Logging with @sndwrks/lumberjack
- **Installable as a global CLI tool**

## Installation

### Install Globally

```bash
npm install -g .
```

After installation, you can use the `osc-cli` command from anywhere:

```bash
osc-cli listen-udp 8000
```

### Install as Dependency

```bash
npm install
```

### Install from npm

```bash
npm install -g @sndwrks/osc-cli
```

## Build

```bash
npm run build
```

## Usage

Once installed globally, use the `osc-cli` command. If not installed globally, use `npm start` instead.

```bash
npm start -- listen-udp <port>
npm start -- listen-tcp <port>
npm start -- listen-both <udp-port> <tcp-port>
```

### Listen for OSC Messages

**UDP (default port 57121):**
```bash
osc-cli listen-udp
osc-cli listen-udp 8000
```

**TCP (default port 57122):**
```bash
osc-cli listen-tcp
osc-cli listen-tcp 8001
```

**Both UDP and TCP:**
```bash
osc-cli listen-both
osc-cli listen-both 8000 8001
```

### Send OSC Messages

**UDP:**
```bash
osc-cli send-udp /test hello 123 127.0.0.1 57121
osc-cli send-udp /synth/note 440 0.5 localhost 8000
```

**TCP:**
NOTE: This is currently broken due to issue in osc.js
```bash
osc-cli send-tcp /test hello 123 127.0.0.1 57122
osc-cli send-tcp /synth/note 440 0.5 localhost 8001
```

## Message Format

- **Address**: OSC address pattern (e.g., `/test`, `/synth/freq`)
- **Args**: Space-separated values (automatically parsed as numbers if possible)
- **Host**: Target hostname or IP address (default: 127.0.0.1)
- **Port**: Target port number

## Examples

```bash
# Install globally
npm install -g .

# Start listening on UDP port 8000
osc-cli listen-udp 8000

# In another terminal, send a message
osc-cli send-udp /hello world 127.0.0.1 8000

# Listen on both protocols
osc-cli listen-both 9000 9001

# Send via TCP
osc-cli send-tcp /synth/freq 440 127.0.0.1 9001
```

## Development

If you haven't installed globally, you can use npm scripts:

```bash
npm run build          # Build TypeScript
npm start listen-udp   # Run with npm start
```

## Uninstall

```bash
npm uninstall -g osc-cli
```

## Publishing to NPM

See [PUBLISHING.md](PUBLISHING.md) for detailed instructions on how to publish this package to npm with the TypeScript build step.

## Dependencies

- `osc`: OSC protocol implementation
- `@sndwrks/lumberjack`: Winston-based logging library

**Note:** This package includes custom TypeScript type definitions for the `osc` library in `src/types/osc.d.ts` since the osc package doesn't provide its own types.