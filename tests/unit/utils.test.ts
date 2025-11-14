import { describe, it, expect } from 'vitest';
import { cn } from '../../client/src/lib/utils';

describe('Utility Functions', () => {
  describe('cn (className merger)', () => {
    it('should merge class names correctly', () => {
      const result = cn('px-4', 'py-2');
      expect(result).toBe('px-4 py-2');
    });

    it('should handle conditional classes', () => {
      const result = cn('base-class', false && 'hidden', 'visible');
      expect(result).toBe('base-class visible');
    });

    it('should merge conflicting Tailwind classes', () => {
      const result = cn('px-4', 'px-8');
      expect(result).toBe('px-8');
    });

    it('should handle empty inputs', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should handle undefined and null values', () => {
      const result = cn('base', undefined, null, 'end');
      expect(result).toBe('base end');
    });
  });
});
