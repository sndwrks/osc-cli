import { describe, it, expect } from 'vitest';
import { argsToTypedArgs } from '../../src/osc-senders/utilities.js';

describe('argsToTypedArgs', () => {
  it('should convert string arguments to string type', () => {
    const result = argsToTypedArgs(['hello', 'world']);
    expect(result).toEqual([
      { type: 's', value: 'hello' },
      { type: 's', value: 'world' },
    ]);
  });

  it('should convert integer arguments to integer type', () => {
    const result = argsToTypedArgs(['42', '100']);
    expect(result).toEqual([
      { type: 'i', value: 42 },
      { type: 'i', value: 100 },
    ]);
  });

  it('should convert float arguments to float type', () => {
    const result = argsToTypedArgs(['3.14', '2.5']);
    expect(result).toEqual([
      { type: 'f', value: 3.14 },
      { type: 'f', value: 2.5 },
    ]);
  });

  it('should handle mixed argument types', () => {
    const result = argsToTypedArgs(['hello', '42', '3.14']);
    expect(result).toEqual([
      { type: 's', value: 'hello' },
      { type: 'i', value: 42 },
      { type: 'f', value: 3.14 },
    ]);
  });

  it('should handle empty array', () => {
    const result = argsToTypedArgs([]);
    expect(result).toEqual([]);
  });

  it('should handle negative numbers', () => {
    const result = argsToTypedArgs(['-5', '-3.14']);
    expect(result).toEqual([
      { type: 'i', value: -5 },
      { type: 'f', value: -3.14 },
    ]);
  });
});
