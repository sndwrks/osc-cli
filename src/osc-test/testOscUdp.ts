import osc, { OSCMessage } from 'osc';
import type { Logger } from '@sndwrks/lumberjack';

import { argsToTypedArgs } from '../osc-senders/utilities.js';
import { validateMessage } from './messageValidator.js';
import type { TestResult, ReceivedMessage } from './types.js';

interface CreateOscUdpTestArgs {
  logger: Logger;
  mode: 'single' | 'load';
  remoteIpAddress: string;
  remotePort: number;
  localIpAddress?: string;
  localPort?: number;
  address?: string;
  args?: string[];
  expectedAddress?: string;
  expectedArgs?: string[];
  timeout?: number;
  messagesPerBatch?: number;
  totalBatches?: number;
  batchInterval?: number;
  messageRate?: number;
}

// eslint-disable-next-line import/prefer-default-export
export function createOscUdpTest ({
  logger,
  mode,
  remoteIpAddress,
  remotePort,
  localIpAddress = '0.0.0.0',
  localPort = 57120,
  address = '/test',
  args,
  expectedAddress,
  expectedArgs,
  timeout = 5000,
  messagesPerBatch,
  totalBatches,
  batchInterval,
  messageRate,
}: CreateOscUdpTestArgs) {
  let server: osc.UDPPort | null = null;
  let client: osc.UDPPort | null = null;
  const receivedMessages: ReceivedMessage[] = [];
  let startTime = Date.now();

  function startServer (): Promise<void> {
    return new Promise((resolve, reject) => {
      server = new osc.UDPPort({
        localAddress: localIpAddress,
        localPort,
        metadata: true,
      });

      server.on('ready', () => {
        logger.info(`Listening for responses on ${localIpAddress}:${localPort}`);
        resolve();
      });

      server.on('message', (oscMsg: OSCMessage) => {
        receivedMessages.push({
          address: oscMsg.address,
          args: oscMsg.args,
          timestamp: Date.now(),
        });
        logger.info('Received: %s %o', oscMsg.address, oscMsg.args);
      });

      server.on('error', (err: Error) => {
        logger.error('Server error:', err);
        reject(err);
      });

      server.open();
    });
  }

  function startClient (): Promise<void> {
    return new Promise((resolve) => {
      client = new osc.UDPPort({
        localAddress: localIpAddress,
        localPort: 0,
        remoteAddress: remoteIpAddress,
        remotePort,
        metadata: true,
      });

      client.on('ready', () => {
        logger.info(`Client ready, will send to ${remoteIpAddress}:${remotePort}`);
        resolve();
      });

      client.on('error', (err: Error) => {
        logger.error('Client error:', err);
      });

      client.open();
    });
  }

  function cleanup (): void {
    if (client) client.close();
    if (server) server.close();
  }

  async function runSingleTest (): Promise<TestResult> {
    const typedArgs = args ? argsToTypedArgs(args) : [];

    if (client) {
      client.send({
        address,
        args: typedArgs,
      });
      logger.info('Sent: %s %o', address, typedArgs);
    }

    await new Promise<void>((resolve) => {
      const checkInterval = setInterval(() => {
        if (receivedMessages.length > 0) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 10);

      setTimeout(() => {
        clearInterval(checkInterval);
        resolve();
      }, timeout);
    });

    if (receivedMessages.length === 0) {
      return {
        success: false,
        messagesSent: 1,
        messagesReceived: 0,
        droppedMessages: 1,
        errors: ['No response received within timeout'],
      };
    }

    const received = receivedMessages[0];
    const expAddr = expectedAddress || address;
    const expArgs = expectedArgs ? argsToTypedArgs(expectedArgs) : typedArgs;
    const validation = validateMessage(expAddr, expArgs, received.address, received.args);

    return {
      success: validation.valid,
      messagesSent: 1,
      messagesReceived: 1,
      droppedMessages: 0,
      duration: Date.now() - startTime,
      errors: validation.errors,
    };
  }

  async function runLoadTest (): Promise<TestResult> {
    if (!messagesPerBatch || !totalBatches || !batchInterval) {
      return {
        success: false,
        messagesSent: 0,
        messagesReceived: 0,
        droppedMessages: 0,
        errors: ['Load test requires messagesPerBatch, totalBatches, and batchInterval'],
      };
    }

    let messagesSent = 0;

    for (let batch = 0; batch < totalBatches; batch += 1) {
      logger.info(`Sending batch ${batch + 1}/${totalBatches}`);

      for (let msg = 0; msg < messagesPerBatch; msg += 1) {
        if (client) {
          client.send({
            address,
            args: [{
              type: 's',
              value: `Batch: ${batch} Message: ${msg + 1}`,
            }],
          });
          messagesSent += 1;

          if (messageRate && msg < messagesPerBatch - 1) {
            // eslint-disable-next-line no-await-in-loop
            await new Promise((r) => { setTimeout(r, 1000 / messageRate); });
          }
        }
      }

      if (batch < totalBatches - 1) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => { setTimeout(r, batchInterval * 1000); });
      }
    }

    logger.info('Waiting for responses...');
    await new Promise((r) => { setTimeout(r, Math.min(timeout, 2000)); });

    const duration = Date.now() - startTime;
    const droppedMessages = messagesSent - receivedMessages.length;
    const throughput = (receivedMessages.length / duration) * 1000;

    const errors: string[] = [];
    if (droppedMessages > 0) {
      const dropRate = ((droppedMessages / messagesSent) * 100).toFixed(2);
      errors.push(`Dropped ${droppedMessages}/${messagesSent} messages (${dropRate}%)`);
    }

    return {
      success: droppedMessages === 0,
      messagesSent,
      messagesReceived: receivedMessages.length,
      droppedMessages,
      throughput,
      duration,
      errors,
    };
  }

  async function run (): Promise<TestResult> {
    try {
      await startServer();
      await startClient();
      startTime = Date.now();

      const result = mode === 'single'
        ? await runSingleTest()
        : await runLoadTest();

      cleanup();
      return result;
    } catch (err) {
      cleanup();
      return {
        success: false,
        messagesSent: 0,
        messagesReceived: 0,
        droppedMessages: 0,
        errors: [err instanceof Error ? err.message : String(err)],
      };
    }
  }

  return { run };
}

export type OscUdpTest = ReturnType<typeof createOscUdpTest>;
