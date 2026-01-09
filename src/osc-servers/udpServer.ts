import osc, { OSCMessage } from 'osc';
import type { Logger } from '@sndwrks/lumberjack';

// eslint-disable-next-line import/prefer-default-export
export function startUdpServer (logger: Logger, ipAddress: string = '0.0.0.0', port: number = 51000) {
  const udpPort = new osc.UDPPort({
    localAddress: ipAddress,
    localPort: port,
    metadata: true,
  });

  udpPort.on('ready', () => {
    logger.info(`Listening for OSC over UDP on IP Address: ${ipAddress} Port: ${port}`);
  });

  udpPort.on('message', (oscMsg: OSCMessage) => {
    logger.info('--udp osc-- Address: %o Arguments: %o', oscMsg.address, oscMsg.args);
  });

  udpPort.on('error', (err: Error) => {
    logger.error('UDP Error:', err);
  });

  udpPort.open();
  return udpPort;
}
