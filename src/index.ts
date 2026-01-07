import osc from 'osc';
import { beginLogging, configureLogger } from '@sndwrks/lumberjack';
import * as net from 'node:net';

// Configure logger globally
configureLogger({
  logToConsole: {
    enabled: true,
    type: 'pretty',
  },
  logLevel: 'info',
  service: 'osc-cli',
});

// Create logger instance
const logger = beginLogging({ name: 'OSC-CLI' });

/**
 * Listen for OSC messages via UDP
 */
export function listenUDP (port: number = 57121) {
  const udpPort = new osc.UDPPort({
    localAddress: '0.0.0.0',
    localPort: port,
    metadata: true,
  });

  udpPort.on('ready', () => {
    logger.info(`Listening for OSC over UDP on port ${port}`);
  });

  udpPort.on('message', (oscMsg: any) => {
    logger.info('UDP OSC message received:', {
      address: oscMsg.address,
      args: oscMsg.args,
    });
  });

  udpPort.on('error', (err: Error) => {
    logger.error('UDP Error:', err);
  });

  udpPort.open();
  return udpPort;
}

/**
 * Listen for OSC messages via TCP
 */
export function listenTCP (port: number = 57122) {
  let tcpPort;
  const tcpServer = net.createServer((socket) => {
    tcpPort = new osc.TCPSocketPort({
      socket,
    });

    tcpPort.on('ready', () => {
      logger.info(`Listening for OSC over TCP on port ${port}`);
    });

    tcpPort.on('data', (oscMsg: any) => {
      logger.info('TCP OSC message received:', {
        address: oscMsg.address,
        args: oscMsg.args,
      });
    });

    tcpPort.on('error', (err: Error) => {
      logger.error('TCP Error:', err);
    });

    tcpPort.listen();
  });

  tcpServer.on('error', (e) => {
    logger.error(e);
  });

  tcpServer.listen(port, '0.0.0.0', () => {
    logger.info('TCP server listening on port');
  });
}

/**
 * Send OSC message via UDP
 */
export function sendUDP (
  address: string,
  args: any[],
  host: string = '127.0.0.1',
  port: number = 57121,
) {
  const udpPort = new osc.UDPPort({
    localAddress: '0.0.0.0',
    localPort: 0,
    metadata: true,
  });

  udpPort.on('ready', () => {
    logger.info(`Sending OSC message via UDP to ${host}:${port}`);

    udpPort.send(
      {
        address,
        args,
      },
      host,
      port,
    );

    logger.info('Message sent:', { address, args });

    // Close after sending
    setTimeout(() => {
      udpPort.close();
    }, 100);
  });

  udpPort.on('error', (err: Error) => {
    logger.error('UDP Send Error:', err);
  });

  udpPort.open();
}

/**
 * Send OSC message via TCP
 */
export function sendTCP (
  address: string,
  args: any[],
  host: string = '127.0.0.1',
  port: number = 57122,
) {
  const tcpPort = new osc.TCPSocketPort({
    address: '0.0.0.0',
    port: 52000,
  });

  logger.info(`Attempting send... address: ${address}, args: ${args}, host: ${host}, port: ${port}`);

  logger.info({ tcpPort });

  tcpPort.on('ready', () => {
    logger.info(`Sending OSC message via TCP to ${host}:${port}`);

    tcpPort.send({
      address,
      args,
    });

    logger.info('Message sent:', { address, args });

    // Close after sending
    setTimeout(() => {
      tcpPort.close();
      logger.info('TCP Port closed.');
      process.exit(0);
    }, 100);
  });

  tcpPort.on('error', (err: Error) => {
    logger.error('TCP Send Error:', err);
  });

  tcpPort.open(host, port);
}

export { logger };
