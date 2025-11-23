/**
 * Tests for useHoverCard
 *
 * Tests the hover card hook:
 * - Mouse enter/leave handling
 * - Focus/blur handling
 * - Delay timing
 * - Timeout management
 * - Disabled state
 */

import { useHoverCard } from '@core/ui/overlays/hover-card/hooks/useHoverCard';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useHoverCard', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('returns handler functions', () => {
		const setIsVisible = vi.fn();
		const { result } = renderHook(() =>
			useHoverCard({
				delay: 100,
				hideDelay: 50,
				setIsVisible,
				disabled: false,
			})
		);

		expect(result.current.handleMouseEnter).toBeDefined();
		expect(result.current.handleMouseLeave).toBeDefined();
		expect(result.current.handleFocus).toBeDefined();
		expect(result.current.handleBlur).toBeDefined();
	});

	it('shows card after delay on mouse enter', () => {
		const setIsVisible = vi.fn();
		const { result } = renderHook(() =>
			useHoverCard({
				delay: 100,
				hideDelay: 50,
				setIsVisible,
				disabled: false,
			})
		);

		act(() => {
			result.current.handleMouseEnter();
		});

		expect(setIsVisible).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(100);
		});

		expect(setIsVisible).toHaveBeenCalledWith(true);
	});

	it('hides card after hideDelay on mouse leave', async () => {
		const setIsVisible = vi.fn();
		const { result } = renderHook(() =>
			useHoverCard({
				delay: 100,
				hideDelay: 50,
				setIsVisible,
				disabled: false,
			})
		);

		// First show the card
		act(() => {
			result.current.handleMouseEnter();
			vi.advanceTimersByTime(100);
		});

		expect(setIsVisible).toHaveBeenCalledWith(true);

		setIsVisible.mockClear();

		// Then hide it
		act(() => {
			result.current.handleMouseLeave();
		});

		expect(setIsVisible).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(50);
		});

		expect(setIsVisible).toHaveBeenCalledWith(false);
	});

	it('shows card on focus', () => {
		const setIsVisible = vi.fn();
		const { result } = renderHook(() =>
			useHoverCard({
				delay: 100,
				hideDelay: 50,
				setIsVisible,
				disabled: false,
			})
		);

		act(() => {
			result.current.handleFocus();
		});

		act(() => {
			vi.advanceTimersByTime(100);
		});

		expect(setIsVisible).toHaveBeenCalledWith(true);
	});

	it('hides card on blur', () => {
		const setIsVisible = vi.fn();
		const { result } = renderHook(() =>
			useHoverCard({
				delay: 100,
				hideDelay: 50,
				setIsVisible,
				disabled: false,
			})
		);

		// First show the card
		act(() => {
			result.current.handleFocus();
			vi.advanceTimersByTime(100);
		});

		expect(setIsVisible).toHaveBeenCalledWith(true);

		setIsVisible.mockClear();

		// Then hide it
		act(() => {
			result.current.handleBlur();
		});

		act(() => {
			vi.advanceTimersByTime(50);
		});

		expect(setIsVisible).toHaveBeenCalledWith(false);
	});

	it('cancels show timeout when mouse leaves before delay', async () => {
		const setIsVisible = vi.fn();
		const { result } = renderHook(() =>
			useHoverCard({
				delay: 100,
				hideDelay: 50,
				setIsVisible,
				disabled: false,
			})
		);

		act(() => {
			result.current.handleMouseEnter();
		});

		act(() => {
			vi.advanceTimersByTime(50);
		});

		act(() => {
			result.current.handleMouseLeave();
		});

		act(() => {
			vi.advanceTimersByTime(100);
		});

		// Should not show because mouse left before delay completed
		// But hideDelay timeout may have been set, so we check that true was never called
		expect(setIsVisible).not.toHaveBeenCalledWith(true);
	});

	it('cancels hide timeout when mouse enters again', () => {
		const setIsVisible = vi.fn();
		const { result } = renderHook(() =>
			useHoverCard({
				delay: 100,
				hideDelay: 50,
				setIsVisible,
				disabled: false,
			})
		);

		// Show card
		act(() => {
			result.current.handleMouseEnter();
			vi.advanceTimersByTime(100);
		});

		expect(setIsVisible).toHaveBeenCalledWith(true);

		setIsVisible.mockClear();

		// Start hiding
		act(() => {
			result.current.handleMouseLeave();
		});

		act(() => {
			vi.advanceTimersByTime(25);
		});

		// Mouse enters again before hide delay completes
		act(() => {
			result.current.handleMouseEnter();
		});

		act(() => {
			vi.advanceTimersByTime(50);
		});

		// Should not hide because mouse entered again
		expect(setIsVisible).not.toHaveBeenCalledWith(false);
	});

	it('does not show card when disabled', () => {
		const setIsVisible = vi.fn();
		const { result } = renderHook(() =>
			useHoverCard({
				delay: 100,
				hideDelay: 50,
				setIsVisible,
				disabled: true,
			})
		);

		act(() => {
			result.current.handleMouseEnter();
		});

		act(() => {
			vi.advanceTimersByTime(100);
		});

		expect(setIsVisible).not.toHaveBeenCalled();
	});

	it('handles rapid mouse enter/leave cycles', () => {
		const setIsVisible = vi.fn();
		const { result } = renderHook(() =>
			useHoverCard({
				delay: 100,
				hideDelay: 50,
				setIsVisible,
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

		expect(setIsVisible).toHaveBeenCalledWith(true);
	});

	it('uses custom delay value', () => {
		const setIsVisible = vi.fn();
		const { result } = renderHook(() =>
			useHoverCard({
				delay: 200,
				hideDelay: 50,
				setIsVisible,
				disabled: false,
			})
		);

		act(() => {
			result.current.handleMouseEnter();
		});

		act(() => {
			vi.advanceTimersByTime(100);
		});

		expect(setIsVisible).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(100);
		});

		expect(setIsVisible).toHaveBeenCalledWith(true);
	});

	it('uses custom hideDelay value', () => {
		const setIsVisible = vi.fn();
		const { result } = renderHook(() =>
			useHoverCard({
				delay: 100,
				hideDelay: 150,
				setIsVisible,
				disabled: false,
			})
		);

		// Show card
		act(() => {
			result.current.handleMouseEnter();
			vi.advanceTimersByTime(100);
		});

		expect(setIsVisible).toHaveBeenCalledWith(true);

		setIsVisible.mockClear();

		// Start hiding
		act(() => {
			result.current.handleMouseLeave();
		});

		act(() => {
			vi.advanceTimersByTime(100);
		});

		expect(setIsVisible).not.toHaveBeenCalledWith(false);

		act(() => {
			vi.advanceTimersByTime(50);
		});

		expect(setIsVisible).toHaveBeenCalledWith(false);
	});

	it('clears all timeouts on unmount', () => {
		const setIsVisible = vi.fn();
		const { unmount } = renderHook(() =>
			useHoverCard({
				delay: 100,
				hideDelay: 50,
				setIsVisible,
				disabled: false,
			})
		);

		act(() => {
			unmount();
		});

		act(() => {
			vi.advanceTimersByTime(200);
		});

		// Should not call setIsVisible after unmount
		expect(setIsVisible).not.toHaveBeenCalled();
	});
});
