import osc from 'osc';

import type { Logger } from '@sndwrks/lumberjack';

interface CreateOscUdpLoadTestArgs {
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

export function createOscUdpLoadTest ({
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
}: CreateOscUdpLoadTestArgs) {
  let oscClient: osc.UDPPort | null = null;

  // could this perhaps call sendUdpMessage... perhaps
  // DRY or whatever 🤷🏻
  async function initializeClient (): Promise<void> {
    oscClient = new osc.UDPPort({
      localAddress: localIpAddress,
      localPort,
      remoteAddress: remoteIpAddress,
      remotePort,
    });

    return new Promise((resolve) => {
      logger.info('Attempting OSC Client initialization.');

      if (oscClient) {
        // these listeners never get cleaned up but that shouldn't be a problem
        oscClient.on('ready', () => {
          logger.info('Client opened successfully.');
          resolve();
        });

        oscClient.on('error', (e) => {
          logger.error(e);
        });

        oscClient.open();
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

export type OscLoadTestUdp = ReturnType<typeof createOscUdpLoadTest>
