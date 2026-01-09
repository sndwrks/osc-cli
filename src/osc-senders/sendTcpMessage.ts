import osc from 'osc';

import type { Logger } from '@sndwrks/lumberjack';

import { argsToTypedArgs } from './utilities.js';

// eslint-disable-next-line import/prefer-default-export
export function sendTcpMessage (
  logger: Logger,
  ipAddress: string,
  port: number,
  address: string,
  args?: string[],
) {
  const tcpPort = new osc.TCPSocketPort({
    address: '0.0.0.0',
    port: 52010,
  });

  tcpPort.on('ready', () => {
    logger.info(`Sending OSC message via TCP to ${ipAddress}:${port}`);

    const typedArgs = args ? argsToTypedArgs(args) : [];

    tcpPort.send({
      address,
      args: typedArgs,
    });

    logger.info('Message sent: %s %o', address, args);

    setTimeout(() => {
      tcpPort.close();
      process.exit(0);
    }, 100);
  });

  tcpPort.on('error', (e: Error) => {
    logger.error('TCP Send Error: %s', e.message);
  });

  tcpPort.open(ipAddress, port);
}
