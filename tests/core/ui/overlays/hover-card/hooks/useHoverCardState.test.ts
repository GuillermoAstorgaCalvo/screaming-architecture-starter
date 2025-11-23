/**
 * Tests for useHoverCardState
 *
 * Tests the hover card state hook:
 * - State initialization
 * - ID generation
 * - Visibility state management
 * - Handler functions
 */

import { useHoverCardState } from '@core/ui/overlays/hover-card/hooks/useHoverCardState';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useHoverCardState', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('returns hoverCardId, isVisible, and handlers', () => {
		const { result } = renderHook(() =>
			useHoverCardState({
				delay: 100,
				hideDelay: 50,
				disabled: false,
			})
		);

		expect(result.current.hoverCardId).toBeDefined();
		expect(typeof result.current.hoverCardId).toBe('string');
		expect(result.current.isVisible).toBe(false);
		expect(result.current.handleMouseEnter).toBeDefined();
		expect(result.current.handleMouseLeave).toBeDefined();
		expect(result.current.handleFocus).toBeDefined();
		expect(result.current.handleBlur).toBeDefined();
	});

	it('generates unique IDs for different instances', () => {
		const { result: result1 } = renderHook(() =>
			useHoverCardState({
				delay: 100,
				hideDelay: 50,
				disabled: false,
			})
		);

		const { result: result2 } = renderHook(() =>
			useHoverCardState({
				delay: 100,
				hideDelay: 50,
				disabled: false,
			})
		);

		expect(result1.current.hoverCardId).not.toBe(result2.current.hoverCardId);
	});

	it('initializes with isVisible as false', () => {
		const { result } = renderHook(() =>
			useHoverCardState({
				delay: 100,
				hideDelay: 50,
				disabled: false,
			})
		);

		expect(result.current.isVisible).toBe(false);
	});

	it('updates isVisible to true after delay on mouse enter', () => {
		const { result } = renderHook(() =>
			useHoverCardState({
				delay: 100,
				hideDelay: 50,
				disabled: false,
			})
		);

		act(() => {
			result.current.handleMouseEnter();
		});

		expect(result.current.isVisible).toBe(false);

		act(() => {
			vi.advanceTimersByTime(100);
		});

		expect(result.current.isVisible).toBe(true);
	});

	it('updates isVisible to false after hideDelay on mouse leave', () => {
		const { result } = renderHook(() =>
			useHoverCardState({
				delay: 100,
				hideDelay: 50,
				disabled: false,
			})
		);

		// First show the card
		act(() => {
			result.current.handleMouseEnter();
			vi.advanceTimersByTime(100);
		});

		expect(result.current.isVisible).toBe(true);

		// Then hide it
		act(() => {
			result.current.handleMouseLeave();
		});

		act(() => {
			vi.advanceTimersByTime(50);
		});

		expect(result.current.isVisible).toBe(false);
	});

	it('updates isVisible to true on focus', () => {
		const { result } = renderHook(() =>
			useHoverCardState({
				delay: 100,
				hideDelay: 50,
				disabled: false,
			})
		);

		act(() => {
			result.current.handleFocus();
		});

		act(() => {
			vi.advanceTimersByTime(100);
		});

		expect(result.current.isVisible).toBe(true);
	});

	it('updates isVisible to false on blur', () => {
		const { result } = renderHook(() =>
			useHoverCardState({
				delay: 100,
				hideDelay: 50,
				disabled: false,
			})
		);

		// First show the card
		act(() => {
			result.current.handleFocus();
			vi.advanceTimersByTime(100);
		});

		expect(result.current.isVisible).toBe(true);

		// Then hide it
		act(() => {
			result.current.handleBlur();
		});

		act(() => {
			vi.advanceTimersByTime(50);
		});

		expect(result.current.isVisible).toBe(false);
	});

	it('does not update isVisible when disabled', () => {
		const { result } = renderHook(() =>
			useHoverCardState({
				delay: 100,
				hideDelay: 50,
				disabled: true,
			})
		);

		act(() => {
			result.current.handleMouseEnter();
		});

		act(() => {
			vi.advanceTimersByTime(100);
		});

		expect(result.current.isVisible).toBe(false);
	});

	it('handles rapid state changes', () => {
		const { result } = renderHook(() =>
			useHoverCardState({
				delay: 100,
				hideDelay: 50,
				disabled: false,
			})
		);

		act(() => {
			result.current.handleMouseEnter();
			vi.advanceTimersByTime(50);
			result.current.handleMouseLeave();
			vi.advanceTimersByTime(25);
			result.current.handleMouseEnter();
			vi.advanceTimersByTime(100);
		});

		expect(result.current.isVisible).toBe(true);
	});

	it('preserves hoverCardId across re-renders', () => {
		const { result, rerender } = renderHook(() =>
			useHoverCardState({
				delay: 100,
				hideDelay: 50,
				disabled: false,
			})
		);

		const initialId = result.current.hoverCardId;

		rerender();

		expect(result.current.hoverCardId).toBe(initialId);
	});

	it('updates handlers when delay changes', () => {
		const { result, rerender } = renderHook(
			({ delay }) =>
				useHoverCardState({
					delay,
					hideDelay: 50,
					disabled: false,
				}),
			{ initialProps: { delay: 100 } }
		);

		const initialHandleMouseEnter = result.current.handleMouseEnter;

		rerender({ delay: 200 });

		// Handlers should be new instances (due to useCallback dependencies)
		expect(result.current.handleMouseEnter).not.toBe(initialHandleMouseEnter);
	});
});
