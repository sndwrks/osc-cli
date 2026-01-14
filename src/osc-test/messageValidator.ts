import type { OSCArg } from '../types/types.js';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// eslint-disable-next-line import/prefer-default-export
export function validateMessage (
  expectedAddress: string,
  expectedArgs: OSCArg[],
  receivedAddress: string,
  receivedArgs: OSCArg[],
): ValidationResult {
  const errors: string[] = [];

  if (expectedAddress !== receivedAddress) {
    errors.push(`Address mismatch: expected "${expectedAddress}", got "${receivedAddress}"`);
  }

  if (expectedArgs.length !== receivedArgs.length) {
    errors.push(`Args count mismatch: expected ${expectedArgs.length}, got ${receivedArgs.length}`);
  }

  const minLength = Math.min(expectedArgs.length, receivedArgs.length);
  for (let i = 0; i < minLength; i += 1) {
    if (expectedArgs[i].type !== receivedArgs[i].type) {
      errors.push(`Arg[${i}] type mismatch: expected "${expectedArgs[i].type}", got "${receivedArgs[i].type}"`);
    }
    if (expectedArgs[i].value !== receivedArgs[i].value) {
      errors.push(`Arg[${i}] value mismatch: expected "${expectedArgs[i].value}", got "${receivedArgs[i].value}"`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
