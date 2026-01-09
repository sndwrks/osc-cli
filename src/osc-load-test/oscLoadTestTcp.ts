import osc from 'osc';

import type { Logger } from '@sndwrks/lumberjack';

interface CreateOscTcpLoadTestArgs {
  logger: Logger;
  localIpAddress?: string;
  localPort?: number;
  remoteIpAddress: string;
  remotePort: number;
  messagesPerBatch: number;
  messageRate?: number;
  totalBatches: number;
  batchInterval: number;
  customAddress?: string;
}

export function createOscTcpLoadTest ({
  logger,
  localIpAddress = '0.0.0.0',
  localPort = 51000,
  remoteIpAddress,
  remotePort,
  messagesPerBatch,
  messageRate,
  totalBatches,
  batchInterval,
  customAddress = '/sndwrks/osc-cli-load-tester/test',
}: CreateOscTcpLoadTestArgs) {
  let oscClient: osc.TCPSocketPort | null = null;

  // this could call sendTcpMessage
  // my inclination is in a library like this its nice for each bit to be self contained
  async function initializeClient (): Promise<void> {
    oscClient = new osc.TCPSocketPort({
      address: localIpAddress,
      port: localPort,
    });

    return new Promise((resolve) => {
      if (oscClient) {
        // these listeners never get cleaned up but that shouldn't be a problem
        oscClient.on('ready', () => {
          logger.info('Client opened successfully.');
          resolve();
        });

        oscClient.on('error', (e) => {
          logger.error(e);
        });

        oscClient.open(remoteIpAddress, remotePort);
      }
    });
  }

  function sendMessages (batchNumber: number): void {
    if (!oscClient) {
      logger.error(new Error('OSC Server not initialized!'));
      return;
    }

    function recursiveSendMessage (messageNumber: number): void {
      const newMessageNumber = messageNumber + 1;

      if (oscClient) {
        oscClient.send({
          address: customAddress,
          args: [
            {
              type: 's',
              value: `Batch: ${batchNumber} Message: ${newMessageNumber}`,
            },
          ],
        });

        if (!(newMessageNumber < messagesPerBatch)) return;

        if (messageRate) {
          // could possibly clean up this timeout?
          setTimeout(() => {
            recursiveSendMessage(newMessageNumber);
          }, 1000 / messageRate);
        } else {
          recursiveSendMessage(newMessageNumber);
        }
      }
    }

    recursiveSendMessage(0);
  }

  function recursiveRun (batchNumber: number): void {
    const newIndex = batchNumber + 1;
    logger.info(`Starting run #${newIndex}`);
    sendMessages(batchNumber);

    if (newIndex < totalBatches) {
      setTimeout(() => {
        recursiveRun(newIndex);
      }, 1000 * batchInterval);
    } else {
      logger.info(`Batches complete. Total Batches: ${totalBatches} Total Messages Sent: ${messagesPerBatch * totalBatches}`);
      process.exit(0);
    }
  }

  async function start (): Promise<void> {
    try {
      await initializeClient();

      recursiveRun(0);
    } catch (e) {
      logger.error(e);
    }
  }

  return { start };
}

export type OscLoadTestTcp = ReturnType<typeof createOscTcpLoadTest>
