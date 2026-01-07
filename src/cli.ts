#!/usr/bin/env node

import { listenUDP, listenTCP, sendUDP, sendTCP, logger } from './index.js';

// CLI Interface
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'listen-udp':
    const udpPort = parseInt(args[1]) || 57121;
    listenUDP(udpPort);
    break;

  case 'listen-tcp':
    const tcpPort = parseInt(args[1]) || 57122;
    listenTCP(tcpPort);
    break;

  case 'listen-both':
    const udpBothPort = parseInt(args[1]) || 57121;
    const tcpBothPort = parseInt(args[2]) || 57122;
    listenUDP(udpBothPort);
    listenTCP(tcpBothPort);
    logger.info('Listening on both UDP and TCP');
    break;

  case 'send-udp':
    if (args.length < 2) {
      logger.error('Usage: send-udp <address> [args...] [host] [port]');
      process.exit(1);
    }
    const udpAddress = args[1];
    const udpArgs = args.slice(2, -2).map(arg => {
      const num = parseFloat(arg);
      return isNaN(num) ? arg : num;
    });
    const udpHost = args[args.length - 2] || '127.0.0.1';
    const udpSendPort = parseInt(args[args.length - 1]) || 57121;
    sendUDP(udpAddress, udpArgs, udpHost, udpSendPort);
    break;

  case 'send-tcp':
    if (args.length < 2) {
      logger.error('Usage: send-tcp <address> [args...] [host] [port]');
      process.exit(1);
    }
    const tcpAddress = args[1];
    const tcpArgs = args.slice(2, -2).map(arg => {
      const num = parseFloat(arg);
      return isNaN(num) ? arg : num;
    });
    const tcpHost = args[args.length - 2] || '127.0.0.1';
    const tcpSendPort = parseInt(args[args.length - 1]) || 57122;
    sendTCP(tcpAddress, tcpArgs, tcpHost, tcpSendPort);
    break;

  default:
    console.log(`
OSC CLI Tool

Usage:
  osc-cli listen-udp [port]              - Listen for UDP OSC messages (default port: 57121)
  osc-cli listen-tcp [port]              - Listen for TCP OSC messages (default port: 57122)
  osc-cli listen-both [udpPort] [tcpPort] - Listen on both UDP and TCP
  osc-cli send-udp <address> [args...] [host] [port] - Send OSC via UDP
  osc-cli send-tcp <address> [args...] [host] [port] - Send OSC via TCP

Examples:
  osc-cli listen-udp 8000
  osc-cli listen-both 8000 8001
  osc-cli send-udp /test hello 123 127.0.0.1 8000
  osc-cli send-tcp /synth/freq 440 localhost 8001
    `);
    break;
}
