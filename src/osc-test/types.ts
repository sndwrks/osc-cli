import type { OSCArg } from '../types/types.js';

export interface TestResult {
  success: boolean;
  messagesSent: number;
  messagesReceived: number;
  droppedMessages: number;
  throughput?: number;
  duration?: number;
  errors: string[];
}

export interface ReceivedMessage {
  address: string;
  args: OSCArg[];
  timestamp: number;
}
