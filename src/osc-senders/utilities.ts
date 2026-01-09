import type { OSCArg } from '../types/types.d.ts';

// eslint-disable-next-line import/prefer-default-export
export function argsToTypedArgs (args: string[]): OSCArg[] {
  return args.map((arg) => {
    let type = 's';
    let value: string | number = arg;
    const num = parseFloat(arg);
    if (!Number.isNaN(num)) {
      value = num;
      if (arg.includes('.')) {
        type = 'f';
      } else {
        type = 'i';
      }
    }
    return { type, value };
  });
}
