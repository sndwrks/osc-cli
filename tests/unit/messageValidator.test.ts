import { describe, it, expect } from 'vitest';
import { validateMessage } from '../../src/osc-test/messageValidator.js';

describe('validateMessage', () => {
  it('should return valid for matching messages', () => {
    const result = validateMessage(
      '/test',
      [{ type: 'i', value: 42 }],
      '/test',
      [{ type: 'i', value: 42 }],
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should detect address mismatch', () => {
    const result = validateMessage(
      '/expected',
      [],
      '/received',
      [],
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Address mismatch: expected "/expected", got "/received"');
  });

  it('should detect args count mismatch', () => {
    const result = validateMessage(
      '/test',
      [{ type: 'i', value: 1 }, { type: 'i', value: 2 }],
      '/test',
      [{ type: 'i', value: 1 }],
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Args count mismatch: expected 2, got 1');
  });

  it('should detect arg type mismatch', () => {
    const result = validateMessage(
      '/test',
      [{ type: 'i', value: 42 }],
      '/test',
      [{ type: 'f', value: 42 }],
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Arg[0] type mismatch: expected "i", got "f"');
  });

  it('should detect arg value mismatch', () => {
    const result = validateMessage(
      '/test',
      [{ type: 'i', value: 42 }],
      '/test',
      [{ type: 'i', value: 99 }],
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Arg[0] value mismatch: expected "42", got "99"');
  });

  it('should handle empty args arrays', () => {
    const result = validateMessage('/test', [], '/test', []);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });
});
