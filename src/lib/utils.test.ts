import { expect, test } from 'vitest';
import { cn } from './utils';

test('cn should merge classes correctly', () => {
  expect(cn('a', 'b')).toBe('a b');
  expect(cn('a', false, 'b', null, undefined, 'c')).toBe('a b c');
  expect(cn('px-2 py-1 bg-red-500', 'p-3 bg-blue-500')).toBe('p-3 bg-blue-500');
});
