/* eslint-disable max-classes-per-file */
declare module 'osc' {
  import { EventEmitter } from 'node:events';
  import * as net from 'node:net';
  import type { OSCArg } from './types.d.ts';

  export interface OSCMessage {
    address: string;
    args: OSCArg[]
  }

  export interface UDPPortOptions {
    localAddress?: string;
    localPort?: number;
    remoteAddress?: string;
    remotePort?: number;
    broadcast?: boolean;
    multicastTTL?: number;
    multicastMembership?: string[];
    metadata?: boolean;
  }

  export interface TCPSocketPortOptions {
    address?: string;
    port?: number;
    socket?: net.Socket;
    metadata?: boolean;
  }

  export class UDPPort extends EventEmitter {
    constructor(options: UDPPortOptions);

    open(): void;

    close(): void;

    send(message: OSCMessage, address?: string, port?: number): void;

    on(event: 'ready', listener: () => void): this;

    on(event: 'message', listener: (message: OSCMessage, timeTag?: any, info?: any) => void): this;

    on(event: 'error', listener: (error: Error) => void): this;

    on(event: 'close', listener: () => void): this;
  }

  export class TCPSocketPort extends EventEmitter {
    constructor(options: TCPSocketPortOptions);

    open(address?: string, port?: number): void;

    listen(): void;

    close(): void;

    sendRaw(message: Buffer): void;

    send(message: OSCMessage): void;

    on(event: 'ready', listener: () => void): this;

    on(event: 'message', listener: (message: OSCMessage, timeTag?: any, info?: any) => void): this;

    on(event: 'error', listener: (error: Error) => void): this;

    on(event: 'close', listener: () => void): this;

    on(event: 'open', listener: () => void): this;
  }

  export interface WebSocketPortOptions {
    url?: string;
    metadata?: boolean;
  }

  export class WebSocketPort extends EventEmitter {
    constructor(options: WebSocketPortOptions);

    open(): void;

    close(): void;

    send(message: OSCMessage): void;

    on(event: 'ready', listener: () => void): this;

    on(event: 'message', listener: (message: OSCMessage, timeTag?: any, info?: any) => void): this;

    on(event: 'error', listener: (error: Error) => void): this;

    on(event: 'close', listener: () => void): this;
  }
}
