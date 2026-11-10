import { describe, expect, it } from 'vitest';
import { isProTier } from '@/lib/profile';

describe('Profile plans', () => {
  it('Free is not Pro', () => expect(isProTier('free')).toBe(false));
  it('Pro enables isPro', () => expect(isProTier('pro')).toBe(true));
  it('missing profile never grants Pro', () => expect(isProTier(undefined)).toBe(false));
});