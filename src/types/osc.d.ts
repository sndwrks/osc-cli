declare module 'osc' {
  import { EventEmitter } from 'events';

  export interface OSCMessage {
    address: string;
    args: Array<{
      type: string;
      value: any;
    }> | any[];
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
    localAddress?: string;
    localPort?: number;
    remoteAddress?: string;
    remotePort?: number;
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
    open(): void;
    close(): void;
    send(message: OSCMessage): void;
    on(event: 'ready', listener: () => void): this;
    on(event: 'message', listener: (message: OSCMessage, timeTag?: any, info?: any) => void): this;
    on(event: 'error', listener: (error: Error) => void): this;
    on(event: 'close', listener: () => void): this;
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