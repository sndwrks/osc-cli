import osc from 'osc';

import type { Logger } from '@sndwrks/lumberjack';

import { argsToTypedArgs } from './utilities.js';

// eslint-disable-next-line import/prefer-default-export
export function sendUdpMessage (
  logger: Logger,
  ipAddress: string,
  port: number,
  address: string,
  args: string[],
) {
  const udpPort = new osc.UDPPort({
    localAddress: '0.0.0.0',
    localPort: 0,
    metadata: true,
  });

  udpPort.on('ready', () => {
    logger.info(`Sending OSC message via UDP to ${ipAddress}:${port}`);

    const typedArgs = args ? argsToTypedArgs(args) : [];

    udpPort.send(
      {
        address,
        args: typedArgs,
      },
      ipAddress,
      port,
    );

    logger.info('Message sent: %s %o', address, args);

    setTimeout(() => {
      udpPort.close();
      process.exit(0);
    }, 100);
  });

  udpPort.on('error', (e: Error) => {
    logger.error('UDP Send Error: %s', e.message);
  });

  udpPort.open();
}
