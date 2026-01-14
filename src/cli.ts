#!/usr/bin/env node

import { program } from 'commander';
import { beginLogging, configureLogger } from '@sndwrks/lumberjack';

import { startUdpServer } from './osc-servers/udpServer.js';
import { startTcpServer } from './osc-servers/tcpServer.js';
import { sendTcpMessage } from './osc-senders/sendTcpMessage.js';
import { sendUdpMessage } from './osc-senders/sendUdpMessage.js';
import { createOscUdpLoadTest } from './osc-load-test/oscLoadTestUdp.js';
import { createOscTcpLoadTest } from './osc-load-test/oscLoadTestTcp.js';
import { createOscUdpTest } from './osc-test/testOscUdp.js';
import { createOscTcpTest } from './osc-test/testOscTcp.js';

configureLogger({
  logToConsole: {
    enabled: true,
    type: 'pretty',
  },
  logLevel: 'info',
  service: 'osc-cli',
});

const logger = beginLogging({ name: 'osc-cli' });

// at a certain point these commands should move to other files if this cli grows

program
  .command('listen-udp')
  .name('listen-udp')
  .description('Start a server that logs incoming UDP OSC messages.')
  .option('-i, --ip-address <ip-address>', 'IP address to bind to. Example: 127.0.0.1. Default: 0.0.0.0')
  .option('-p, --port <port>', 'Port the server listens on. Example: 53000 Default: 51000')
  .action(({ ipAddress, port }) => {
    startUdpServer(logger, ipAddress, port);
  });

program
  .command('listen-tcp')
  .name('listen-tcp')
  .description('Starts a server the logs incoming TCP OSC messages')
  .option('-i, --ip-address <ip-address>', 'IP address to bind to. Example: 127.0.0.1. Default: 0.0.0.0')
  .option('-p, --port <port>', 'Port the server listens on. Example: 53001 Default: 51001')
  .action(({ ipAddress, port }) => {
    startTcpServer(logger, ipAddress, port);
  });

program
  .command('listen-both')
  .name('listen-both')
  .description('Starts two servers, one for TCP and one for UDP')
  .option('--udp-ip-address <udp-ip-address>', 'IP address to bind the UDP server to. Example 127.0.0.1')
  .option('--udp-port <udp-port>', 'Port the UDP server will listen on. Example: 53000 Default: 51000')
  .option('--tcp-ip-address <tcp-ip-address>', 'IP address to bind the TCP server to. Example: 127.0.0.1. Default: 0.0.0.0')
  .option('--tcp-port <tcp-port>', 'Port the TCP server will listen on. Example: 53001 Default: 51001')
  .action(({
    udpIpAddress, udpPort, tcpIpAddress, tcpPort,
  }) => {
    startUdpServer(logger, udpIpAddress, udpPort);
    startTcpServer(logger, tcpIpAddress, tcpPort);
  });

program
  .command('send-udp')
  .name('send-udp')
  .description('Send an OSC message via UDP')
  .requiredOption('-i, --ip-address <ip-address>', 'IP address to send to (required). Example: 10.0.10.223')
  .requiredOption('-p, --port <port>', 'Port to send to (required). Example: 53000')
  .requiredOption('-a, --address <address>', 'OSC Address to send (required). Example: /fader/1/mute/on')
  .option('--args <args...>', 'A space separated list of arguments (optional). Example: 1.0 string 59')
  .action(({
    ipAddress, port, address, args,
  }) => {
    sendUdpMessage(logger, ipAddress, port, address, args);
  });

program
  .command('send-tcp')
  .name('send-tcp')
  .description('Send an OSC message via TCP.')
  .requiredOption('-i, --ip-address <ip-address>', 'IP address to send to (required). Example: 10.0.10.223')
  .requiredOption('-p, --port <port>', 'Port to send to (required). Example: 53000')
  .requiredOption('-a, --address <address>', 'OSC Address to send (required). Example: /fader/1/mute/on')
  .option('--args <args...>', 'A space separated list of arguments. Example: 1.0 string 59')
  .action(({
    ipAddress, port, address, args,
  }) => {
    sendTcpMessage(logger, ipAddress, port, address, args);
  });

program
  .command('osc-load-test-udp')
  .name('osc-load-test-udp')
  .description('Starts an OSC load test via UDP. Sends batches of messages on intervals of at least 1 second. If there\'s more messages per batch than can be sent in the interval batches will overlap. The load tester adds one arg in the format \'Batch: <batch-number> Message: <message-number>\'')
  .option('--local-ip-address <local-ip-address>', 'Local IP Address to bind the client to. Default: 0.0.0.0')
  .option('--local-port <local-port>', 'Local port to bind the client to. Default: 51000')
  .requiredOption('--remote-ip-address <remote-ip-address>', 'IP Address to send the messages to (required). Example: 10.10.209.5')
  .requiredOption('--remote-port <remote-port>', 'Port to send the messages to (required).')
  .requiredOption('--messages-per-batch <messages-per-batch>', 'The number of messages per batch to send (required).')
  .option('--message-rate <message-rate>', 'The number of messages to send per second.')
  .requiredOption('--total-batches <total-batches>', 'The total number of batches to send')
  .requiredOption('--batch-interval <batch-interval', 'The time in seconds between batches.')
  .option('--custom-address <custom-address>', 'A custom address to send. Default: /sndwrks/osc-cli-load-tester/test')
  .action(async ({
    localIpAddress,
    localPort,
    remoteIpAddress,
    remotePort,
    messagesPerBatch,
    messageRate,
    totalBatches,
    batchInterval,
    customAddress,
  }) => {
    const oscLoadTestTest = createOscUdpLoadTest({
      logger,
      localIpAddress,
      localPort,
      remoteIpAddress,
      remotePort,
      messagesPerBatch,
      messageRate,
      totalBatches,
      batchInterval,
      customAddress,
    });

    await oscLoadTestTest.start();
  });

program
  .command('osc-load-test-tcp')
  .name('osc-load-test-tcp')
  .description('Starts an OSC load test via TCP. Sends batches of messages on intervals of at least 1 second. If there\'s more messages per batch than can be sent in the interval batches will overlap. The load tester adds one arg in the format \'Batch: <batch-number> Message: <message-number>\'')
  .option('--local-ip-address <local-ip-address>', 'Local IP Address to bind the client to. Default: 0.0.0.0')
  .option('--local-port <local-port>', 'Local port to bind the client to. Default: 51000')
  .requiredOption('--remote-ip-address <remote-ip-address>', 'IP Address to send the messages to (required). Example: 10.10.209.5')
  .requiredOption('--remote-port <remote-port>', 'Port to send the messages to (required).')
  .requiredOption('--messages-per-batch <messages-per-batch>', 'The number of messages per batch to send (required).')
  .option('--message-rate <message-rate>', 'The number of messages to send per second.')
  .requiredOption('--total-batches <total-batches>', 'The total number of batches to send')
  .requiredOption('--batch-interval <batch-interval', 'The time in seconds between batches.')
  .option('--custom-address <custom-address>', 'A custom address to send. Default: /sndwrks/osc-cli-load-tester/test')
  .action(async ({
    localIpAddress,
    localPort,
    remoteIpAddress,
    remotePort,
    messagesPerBatch,
    messageRate,
    totalBatches,
    batchInterval,
    customAddress,
  }) => {
    const oscLoadTestTest = createOscTcpLoadTest({
      logger,
      localIpAddress,
      localPort,
      remoteIpAddress,
      remotePort,
      messagesPerBatch,
      messageRate,
      totalBatches,
      batchInterval,
      customAddress,
    });

    await oscLoadTestTest.start();
  });

program
  .command('test-osc-udp')
  .name('test-osc-udp')
  .description('Integration test via UDP. Sends messages to a remote application and validates responses.')
  .requiredOption('--mode <mode>', 'Test mode: "single" (single message) or "load" (throughput test)')
  .requiredOption('-i, --remote-ip-address <ip>', 'Remote IP address to send messages to')
  .requiredOption('-p, --remote-port <port>', 'Remote port to send messages to')
  .option('--local-ip-address <ip>', 'Local IP to listen for responses. Default: 0.0.0.0')
  .option('--local-port <port>', 'Local port to listen for responses. Default: 57120')
  .option('-a, --address <address>', 'OSC address to send. Default: /test')
  .option('--args <args...>', 'Arguments to send')
  .option('--expected-address <address>', 'Expected response address (defaults to sent address)')
  .option('--expected-args <args...>', 'Expected response args (defaults to sent args)')
  .option('--timeout <ms>', 'Timeout in milliseconds. Default: 5000')
  .option('--messages-per-batch <n>', 'Messages per batch (load mode)')
  .option('--total-batches <n>', 'Total number of batches (load mode)')
  .option('--batch-interval <seconds>', 'Interval between batches in seconds (load mode)')
  .option('--message-rate <n>', 'Messages per second rate limit (load mode)')
  .action(async ({
    mode,
    remoteIpAddress,
    remotePort,
    localIpAddress,
    localPort,
    address,
    args,
    expectedAddress,
    expectedArgs,
    timeout,
    messagesPerBatch,
    totalBatches,
    batchInterval,
    messageRate,
  }) => {
    const test = createOscUdpTest({
      logger,
      mode,
      remoteIpAddress,
      remotePort: parseInt(remotePort, 10),
      localIpAddress,
      localPort: localPort ? parseInt(localPort, 10) : undefined,
      address,
      args,
      expectedAddress,
      expectedArgs,
      timeout: timeout ? parseInt(timeout, 10) : undefined,
      messagesPerBatch: messagesPerBatch ? parseInt(messagesPerBatch, 10) : undefined,
      totalBatches: totalBatches ? parseInt(totalBatches, 10) : undefined,
      batchInterval: batchInterval ? parseFloat(batchInterval) : undefined,
      messageRate: messageRate ? parseInt(messageRate, 10) : undefined,
    });

    const result = await test.run();

    logger.info('=== Test Results ===');
    logger.info('Status: %s', result.success ? 'PASSED' : 'FAILED');
    logger.info('Messages sent: %d', result.messagesSent);
    logger.info('Messages received: %d', result.messagesReceived);
    logger.info('Dropped messages: %d', result.droppedMessages);

    if (result.throughput !== undefined) {
      logger.info('Throughput: %s msg/sec', result.throughput.toFixed(2));
    }
    if (result.duration !== undefined) {
      logger.info('Duration: %d ms', result.duration);
    }
    if (result.errors.length > 0) {
      logger.error('Errors:');
      result.errors.forEach((e) => logger.error('  - %s', e));
    }

    process.exit(result.success ? 0 : 1);
  });

program
  .command('test-osc-tcp')
  .name('test-osc-tcp')
  .description('Integration test via TCP. Sends messages to a remote application and validates responses.')
  .requiredOption('--mode <mode>', 'Test mode: "single" (single message) or "load" (throughput test)')
  .requiredOption('-i, --remote-ip-address <ip>', 'Remote IP address to send messages to')
  .requiredOption('-p, --remote-port <port>', 'Remote port to send messages to')
  .option('--local-ip-address <ip>', 'Local IP to listen for responses. Default: 0.0.0.0')
  .option('--local-port <port>', 'Local port to listen for responses. Default: 57121')
  .option('-a, --address <address>', 'OSC address to send. Default: /test')
  .option('--args <args...>', 'Arguments to send')
  .option('--expected-address <address>', 'Expected response address (defaults to sent address)')
  .option('--expected-args <args...>', 'Expected response args (defaults to sent args)')
  .option('--timeout <ms>', 'Timeout in milliseconds. Default: 5000')
  .option('--messages-per-batch <n>', 'Messages per batch (load mode)')
  .option('--total-batches <n>', 'Total number of batches (load mode)')
  .option('--batch-interval <seconds>', 'Interval between batches in seconds (load mode)')
  .option('--message-rate <n>', 'Messages per second rate limit (load mode)')
  .action(async ({
    mode,
    remoteIpAddress,
    remotePort,
    localIpAddress,
    localPort,
    address,
    args,
    expectedAddress,
    expectedArgs,
    timeout,
    messagesPerBatch,
    totalBatches,
    batchInterval,
    messageRate,
  }) => {
    const test = createOscTcpTest({
      logger,
      mode,
      remoteIpAddress,
      remotePort: parseInt(remotePort, 10),
      localIpAddress,
      localPort: localPort ? parseInt(localPort, 10) : undefined,
      address,
      args,
      expectedAddress,
      expectedArgs,
      timeout: timeout ? parseInt(timeout, 10) : undefined,
      messagesPerBatch: messagesPerBatch ? parseInt(messagesPerBatch, 10) : undefined,
      totalBatches: totalBatches ? parseInt(totalBatches, 10) : undefined,
      batchInterval: batchInterval ? parseFloat(batchInterval) : undefined,
      messageRate: messageRate ? parseInt(messageRate, 10) : undefined,
    });

    const result = await test.run();

    logger.info('=== Test Results ===');
    logger.info('Status: %s', result.success ? 'PASSED' : 'FAILED');
    logger.info('Messages sent: %d', result.messagesSent);
    logger.info('Messages received: %d', result.messagesReceived);
    logger.info('Dropped messages: %d', result.droppedMessages);

    if (result.throughput !== undefined) {
      logger.info('Throughput: %s msg/sec', result.throughput.toFixed(2));
    }
    if (result.duration !== undefined) {
      logger.info('Duration: %d ms', result.duration);
    }
    if (result.errors.length > 0) {
      logger.error('Errors:');
      result.errors.forEach((e) => logger.error('  - %s', e));
    }

    process.exit(result.success ? 0 : 1);
  });

program.parse();
