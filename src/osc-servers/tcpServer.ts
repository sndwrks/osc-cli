import osc, { OSCMessage } from 'osc';
import * as net from 'node:net';

import type { Logger } from '@sndwrks/lumberjack';

// eslint-disable-next-line import/prefer-default-export
export function startTcpServer (logger: Logger, ipAddress: string = '0.0.0.0', port: number = 51001) {
  const tcpServer = net.createServer((socket) => {
    const tcpPort = new osc.TCPSocketPort({
      socket,
      metadata: true,
    });

    tcpPort.on('message', (oscMsg: OSCMessage) => {
      logger.info('--tcp osc-- Address: %o Arguments: %o', oscMsg.address, oscMsg.args);
    });

    tcpPort.on('error', (err: Error) => {
      logger.error('TCP Error:', err);
    });
  });

  tcpServer.on('error', (e) => {
    logger.error(e);
  });

  tcpServer.listen(port, ipAddress, () => {
    logger.info(`Listening for OSC over TCP on IP Address: ${ipAddress} Port: ${port}`);
  });
}
