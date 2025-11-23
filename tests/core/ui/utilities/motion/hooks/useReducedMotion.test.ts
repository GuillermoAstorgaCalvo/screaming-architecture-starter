/**
 * Tests for useReducedMotion hook
 *
 * Tests the reduced motion preference detection hook:
 * - Default behavior
 * - Reduced motion detection
 * - SSR/default value handling
 */

import { useReducedMotion } from '@core/ui/utilities/motion/hooks/useReducedMotion';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock framer-motion's useReducedMotion
const mockFramerUseReducedMotion = vi.fn();
vi.mock('framer-motion', () => ({
	useReducedMotion: () => mockFramerUseReducedMotion(),
}));

describe('useReducedMotion - Default behavior', () => {
	it('returns false by default when media query is unavailable', () => {
		mockFramerUseReducedMotion.mockReturnValue(undefined);

		const { result } = renderHook(() => useReducedMotion());

		expect(result.current).toBe(false);
	});

	it('returns provided defaultValue when media query is unavailable', () => {
		mockFramerUseReducedMotion.mockReturnValue(undefined);

		const { result } = renderHook(() => useReducedMotion({ defaultValue: true }));

		expect(result.current).toBe(true);
	});

	it('returns false when defaultValue is explicitly false', () => {
		mockFramerUseReducedMotion.mockReturnValue(undefined);

		const { result } = renderHook(() => useReducedMotion({ defaultValue: false }));

		expect(result.current).toBe(false);
	});
});

describe('useReducedMotion - Media query detection', () => {
	it('returns true when user prefers reduced motion', () => {
		mockFramerUseReducedMotion.mockReturnValue(true);

		const { result } = renderHook(() => useReducedMotion());

		expect(result.current).toBe(true);
	});

	it('returns false when user does not prefer reduced motion', () => {
		mockFramerUseReducedMotion.mockReturnValue(false);

		const { result } = renderHook(() => useReducedMotion());

		expect(result.current).toBe(false);
	});

	it('ignores defaultValue when media query returns a boolean', () => {
		mockFramerUseReducedMotion.mockReturnValue(true);

		const { result } = renderHook(() => useReducedMotion({ defaultValue: false }));

		expect(result.current).toBe(true);
	});
});

describe('useReducedMotion - Edge cases', () => {
	it('handles undefined media query value with custom default', () => {
		mockFramerUseReducedMotion.mockReturnValue(undefined);

		const { result } = renderHook(() => useReducedMotion({ defaultValue: true }));

		expect(result.current).toBe(true);
	});

	it('handles null media query value (treated as undefined)', () => {
		mockFramerUseReducedMotion.mockReturnValue(null as unknown as boolean);

		const { result } = renderHook(() => useReducedMotion({ defaultValue: false }));

		expect(result.current).toBe(false);
	});
});
