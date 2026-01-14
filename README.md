![sndwrks logo](images/sndwrks-square_200px-high.png)

# osc-cli

![NPM Version](https://img.shields.io/npm/v/%40sndwrks%2Fosc-cli?style=flat-square&color=rgb(239%2C%20145%2C%2081))
![GitHub License](https://img.shields.io/github/license/sndwrks/osc-cli?style=flat&color=rgb(14%2C%2022%2C%2025))
![Node LTS](https://img.shields.io/node/v-lts/%40sndwrks%2Fosc-cli)



**DISCLAIMER: this was written by AI, and promptly rewritten, but it will be maintained by humans (probably).**

A simple command-line application for sending and receiving OSC (Open Sound Control) messages via TCP and UDP including load testing.

## What does it do?

- Listen for OSC messages via UDP
- Listen for OSC messages via TCP
- Listen on both protocols simultaneously
- Send OSC messages via UDP
- Send OSC messages via TCP
- Load Testing with UDP
- Load Testing with TCP
- Integration Testing with UDP (send to app, validate response)
- Integration Testing with TCP (send to app, validate response)

## Installation

### Install from npm

```bash
npm install -g @sndwrks/osc-cli
```

### Install from Github

```bash
# clone the repo
git clone git@github.com:sndwrks/osc-cli.git

# install globally
npm i -g .

# otherwise build and run locally
npm i
npm run build
npm start -- <commands>
```

## Uninstall

```bash
npm uninstall -g osc-cli
```

## Usage

Once installed globally, use `osc-cli <command>`. If not installed globally, use `npm start -- <command>` instead.


### Listen for OSC Messages

Starts a server to listen for incoming OSC messages.

#### Args

| Flag | Option | Type | Description | Example | Default |
|------|--------|------|-------------|---------|---------|
| `-i` | `--ip-address <ip-address>` | string | IP address to bind to | 127.0.0.1 | 0.0.0.0 |
| `-p` | `--port <port>` | number | Port the server listens on | 53000 | 51000 |

**UDP (default port 51000):**
```bash
osc-cli listen-udp
osc-cli listen-udp -p 8000
osc-cli listen-udp --port 8000 --ip-address 127.0.0.1
```

**TCP (default port 51001):**
```bash
osc-cli listen-tcp
osc-cli listen-tcp -p 8001
osc-cli listen-tcp --port 8001 --ip-address 127.0.0.1
```

**Both UDP and TCP:**
```bash
osc-cli listen-both
osc-cli listen-both --udp-port 8000 --tcp-port 8001
osc-cli listen-both --udp-port 8000 --tcp-port 8001 --udp-ip-address 127.0.0.1 --tcp-ip-address 127.0.0.1
```

### Send OSC Messages

Send a single OSC message.

#### Args

Sends a single OSC message via UDP

| Flag | Option | Type | Description | Example | Default |
|------|--------|------|-------------|---------|---------|
| | `--udp-ip-address <udp-ip-address>` | string | IP address to bind the UDP server to | 127.0.0.1 | |
| | `--udp-port <udp-port>` | number | Port the UDP server will listen on | 53000 | 51000 |
| | `--tcp-ip-address <tcp-ip-address>` | string | IP address to bind the TCP server to | 127.0.0.1 | 0.0.0.0 |
| | `--tcp-port <tcp-port>` | number | Port the TCP server will listen on | 53001 | 51001 |


**UDP:**
```bash
# no args
osc-cli send-udp -a /test -i 127.0.0.1 -p 57121

# with args
osc-cli send-udp -a /test -i 127.0.0.1 -p 57121 --args hello 123
osc-cli send-udp --address /synth/note --ip-address localhost --port 8000 --args 440 0.5
```

**TCP:**
```bash
osc-cli send-tcp -a /test -i 127.0.0.1 -p 57122 --args hello 123
osc-cli send-tcp --address /synth/note --ip-address localhost --port 8001 --args 440 0.5
```

### Load Testing

The load testing allows for sending multiple messages in batches. The batches may overlap if the message rate is slower than the batch interval.

#### Args

| Flag | Option | Type | Required | Description | Example | Default |
|------|--------|------|----------|-------------|---------|---------|
| | `--local-ip-address <local-ip-address>` | string | No | Local IP Address to bind the client to | | 0.0.0.0 |
| | `--local-port <local-port>` | number | No | Local port to bind the client to | | 51000 |
| | `--remote-ip-address <remote-ip-address>` | string | Yes | IP Address to send the messages to | 10.10.209.5 | |
| | `--remote-port <remote-port>` | number | Yes | Port to send the messages to | | |
| | `--messages-per-batch <messages-per-batch>` | number | Yes | The number of messages per batch to send | | |
| | `--message-rate <message-rate>` | number | No | The number of messages to send per second | | |
| | `--total-batches <total-batches>` | number | Yes | The total number of batches to send | | |
| | `--batch-interval <batch-interval>` | number | Yes | The time in seconds between batches | | |
| | `--custom-address <custom-address>` | string | No | A custom address to send | | /sndwrks/osc-cli-load-tester/test |

**UDP Load Test:**
```bash
# minimal required args
osc-cli osc-load-test-udp \
  --remote-ip-address 127.0.0.1 \
  --remote-port 8000 \
  --messages-per-batch 100 \
  --total-batches 10 \
  --batch-interval 1
```

```bash
# with optional args
osc-cli osc-load-test-udp \
  --remote-ip-address 10.10.209.5 \
  --remote-port 8000 \
  --messages-per-batch 100 \
  --total-batches 10 \
  --batch-interval 1 \
  --message-rate 50
```

```bash
osc-cli osc-load-test-udp \
  --local-ip-address 0.0.0.0 \
  --local-port 51000 \
  --remote-ip-address 10.10.209.5 \
  --remote-port 8000 \
  --messages-per-batch 100 \
  --message-rate 50 \
  --total-batches 10 \
  --batch-interval 1 \
  --custom-address /my/custom/address
```

**TCP Load Test:**
```bash
# minimal required args
osc-cli osc-load-test-tcp \
  --remote-ip-address 127.0.0.1 \
  --remote-port 8001 \
  --messages-per-batch 100 \
  --total-batches 10 \
  --batch-interval 1
```

```bash
# with optional args
osc-cli osc-load-test-tcp \
  --remote-ip-address 10.10.209.5 \
  --remote-port 8001 \
  --messages-per-batch 100 \
  --total-batches 10 \
  --batch-interval 1 \
  --message-rate 50
```

```bash
# with all args
osc-cli osc-load-test-tcp \
  --local-ip-address 0.0.0.0 \
  --local-port 51000 \
  --remote-ip-address 10.10.209.5 \
  --remote-port 8001 \
  --messages-per-batch 100 \
  --message-rate 50 \
  --total-batches 10 \
  --batch-interval 1 \
  --custom-address /my/custom/address
```

### Integration Testing

Integration testing commands send messages to a remote application and validate the responses. The remote application should echo back OSC messages to the local listener port.

#### Args

| Flag | Option | Type | Required | Description | Example | Default |
|------|--------|------|----------|-------------|---------|---------|
| `-i` | `--remote-ip-address <ip>` | string | Yes | Remote IP to send messages to | 10.10.209.5 | |
| `-p` | `--remote-port <port>` | number | Yes | Remote port to send messages to | 8000 | |
| | `--mode <mode>` | string | Yes | Test mode: "single" or "load" | single | |
| | `--local-ip-address <ip>` | string | No | Local IP to listen for responses | | 0.0.0.0 |
| | `--local-port <port>` | number | No | Local port to listen for responses | | 57120 (UDP) / 57121 (TCP) |
| `-a` | `--address <address>` | string | No | OSC address to send | /test | /test |
| | `--args <args...>` | string[] | No | Arguments to send | hello 123 | |
| | `--expected-address <address>` | string | No | Expected response address | /response | sent address |
| | `--expected-args <args...>` | string[] | No | Expected response args | ok 1 | sent args |
| | `--timeout <ms>` | number | No | Response timeout | | 5000 |
| | `--messages-per-batch <n>` | number | No | Messages per batch (load mode) | | |
| | `--total-batches <n>` | number | No | Total batches (load mode) | | |
| | `--batch-interval <seconds>` | number | No | Interval between batches (load mode) | | |
| | `--message-rate <n>` | number | No | Messages per second (load mode) | | |

**UDP Integration Test (single message):**
```bash
# Send a message and validate the response matches
osc-cli test-osc-udp \
  --mode single \
  -i 127.0.0.1 \
  -p 8000 \
  -a /test \
  --args hello 123

# With custom expected response
osc-cli test-osc-udp \
  --mode single \
  -i 127.0.0.1 \
  -p 8000 \
  -a /ping \
  --expected-address /pong \
  --expected-args ok
```

**UDP Integration Test (load test):**
```bash
# Load test with throughput validation
osc-cli test-osc-udp \
  --mode load \
  -i 127.0.0.1 \
  -p 8000 \
  --messages-per-batch 100 \
  --total-batches 10 \
  --batch-interval 1
```

**TCP Integration Test (single message):**
```bash
osc-cli test-osc-tcp \
  --mode single \
  -i 127.0.0.1 \
  -p 8001 \
  -a /test \
  --args hello 123
```

**TCP Integration Test (load test):**
```bash
osc-cli test-osc-tcp \
  --mode load \
  -i 127.0.0.1 \
  -p 8001 \
  --messages-per-batch 50 \
  --total-batches 5 \
  --batch-interval 2 \
  --message-rate 100
```

**Exit codes:**
- `0` - Test passed (single: response matched; load: no dropped messages)
- `1` - Test failed (timeout, mismatch, or dropped messages)

## Development

Please get in there if you want. This repo uses eslint 8 for linting AND code style.

**VSCode Example Settings**
```json
{
  "editor.formatOnSave": true,
  "eslint.codeActionsOnSave.rules": null,
  "eslint.validate": [
    "typescript"
  ],
  "[typescript]": {
    "editor.tabSize": 2,
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
  "eslint.format.enable": true,
  "editor.defaultFormatter": "dbaeumer.vscode-eslint",
  "editor.tabSize": 2,
  "javascript.updateImportsOnFileMove.enabled": "always",
  "editor.rulers": [100]
}
```

```bash
npm run build        
npm start listen-udp -- <args> 
```

## Wants and Desires

- roll in nodemon
- add some way to send messages on an interval