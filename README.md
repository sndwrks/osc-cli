![sndwrks logo](images/sndwrks-square_200px-high.png)

# osc-cli

**DISCLAIMER: this was written by AI, and promptly rewritten, but it will be maintained by humans (probably).**

A simple command-line application for sending and receiving OSC (Open Sound Control) messages via TCP and UDP including load testing.

## What does it do?

- Listen for OSC messages via UDP
- Listen for OSC messages via TCP
- Listen on both protocols simultaneously
- Send OSC messages via UDP
- Send OSC messages via TCP
- Logging with @sndwrks/lumberjack
- **Installable as a global CLI tool**

## Installation

### Install from npm

```bash
npm install -g @sndwrks/osc-cli
```

### Install from Github

```bash
# clone down the repo
git clone git@github.com:sndwrks/osc-cli.git

# install globally
npm i -g .

# otherwise build and run locally
npm i
npm run build
npm start -- <commands>
```

## Usage

Once installed globally, use`osc-cli <command>`. If not installed globally, use `npm start -- <command>` instead.


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
npm run build        
npm start listen-udp -- <args> 
```

## Uninstall

```bash
npm uninstall -g osc-cli
```


## Wants and Desires

- roll in nodemon
- add some way to send messages on an interval