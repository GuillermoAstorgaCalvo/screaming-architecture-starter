/**
 * useStickyCalculation Tests
 *
 * Tests for the useStickyCalculation hook including:
 * - Hook initialization
 * - Calculation function return
 * - Element ref handling
 * - Position calculations (top, bottom, left, right)
 * - Threshold handling
 * - Container handling
 * - Enabled state handling
 * - Initial position caching
 * - Edge cases (null refs, disabled state)
 */

import {
	calculatePositionState,
	getInitialPosition,
	getScrollX,
	getScrollY,
} from '@core/ui/affix/helpers/useAffix.helpers';
import { useStickyCalculation } from '@core/ui/affix/hooks/useAffix.calculation';
import type { StickyCalculationParams } from '@core/ui/affix/types/useAffix.types';
import { renderHook } from '@testing-library/react';
import { createRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the helper functions
vi.mock('@core/ui/affix/helpers/useAffix.helpers', () => ({
	calculatePositionState: vi.fn(params => {
		const { position, scrollPosition, initialPosition, threshold } = params;
		if (position === 'top' || position === 'left') {
			return scrollPosition >= initialPosition - threshold;
		}
		return scrollPosition >= initialPosition + threshold;
	}),
	getInitialPosition: vi.fn((element, position, container) => {
		const rect = element.getBoundingClientRect();
		if (position === 'top' || position === 'bottom') {
			const scrollTop = container ? container.scrollTop : window.scrollY;
			return rect.top + scrollTop;
		}
		const scrollLeft = container ? container.scrollLeft : window.scrollX;
		return rect.left + scrollLeft;
	}),
	getScrollY: vi.fn(container => {
		return container ? container.scrollTop : window.scrollY || 0;
	}),
	getScrollX: vi.fn(container => {
		return container ? container.scrollLeft : window.scrollX || 0;
	}),
}));

describe('useStickyCalculation', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('useStickyCalculation - Hook Initialization', () => {
		it('should be a function', () => {
			expect(typeof useStickyCalculation).toBe('function');
		});

		it('returns a calculation function', () => {
			const elementRef = createRef<HTMLDivElement>();
			const element = document.createElement('div');
			elementRef.current = element;

			const params: StickyCalculationParams = {
				elementRef,
				position: 'top',
				threshold: 0,
				container: null,
				enabledRef: { current: true },
				initialPositionRef: { current: null },
			};

			const { result } = renderHook(() => useStickyCalculation(params));

			expect(typeof result.current).toBe('function');
		});

		it('returns a stable function reference', () => {
			const elementRef = createRef<HTMLDivElement>();
			const element = document.createElement('div');
			elementRef.current = element;

			const params: StickyCalculationParams = {
				elementRef,
				position: 'top',
				threshold: 0,
				container: null,
				enabledRef: { current: true },
				initialPositionRef: { current: null },
			};

			const { result, rerender } = renderHook(() => useStickyCalculation(params));

			const firstCall = result.current;
			rerender();
			const secondCall = result.current;

			// Function should be memoized when dependencies don't change
			expect(firstCall).toBe(secondCall);
		});
	});

	describe('useStickyCalculation - Element Ref Handling', () => {
		it('returns false when element ref is null', () => {
			const elementRef = createRef<HTMLDivElement>();
			elementRef.current = null;

			const params: StickyCalculationParams = {
				elementRef,
				position: 'top',
				threshold: 0,
				container: null,
				enabledRef: { current: true },
				initialPositionRef: { current: null },
			};

			const { result } = renderHook(() => useStickyCalculation(params));

			expect(result.current()).toBe(false);
		});

		it('returns false when element ref is undefined', () => {
			const elementRef = createRef<HTMLDivElement>();

			const params: StickyCalculationParams = {
				elementRef,
				position: 'top',
				threshold: 0,
				container: null,
				enabledRef: { current: true },
				initialPositionRef: { current: null },
			};

			const { result } = renderHook(() => useStickyCalculation(params));

			expect(result.current()).toBe(false);
		});

		it('calculates sticky state when element ref is available', () => {
			const elementRef = createRef<HTMLDivElement>();
			const element = document.createElement('div');
			element.getBoundingClientRect = vi.fn(() => ({
				top: 100,
				left: 50,
				right: 150,
				bottom: 200,
				width: 100,
				height: 100,
				x: 50,
				y: 100,
				toJSON: vi.fn(),
			}));
			elementRef.current = element;

			vi.mocked(getInitialPosition).mockReturnValue(100);
			vi.mocked(getScrollY).mockReturnValue(150);
			vi.mocked(calculatePositionState).mockReturnValue(true);

			const params: StickyCalculationParams = {
				elementRef,
				position: 'top',
				threshold: 10,
				container: null,
				enabledRef: { current: true },
				initialPositionRef: { current: null },
			};

			const { result } = renderHook(() => useStickyCalculation(params));

			expect(result.current()).toBe(true);
			expect(getInitialPosition).toHaveBeenCalledWith(element, 'top', null);
			expect(getScrollY).toHaveBeenCalledWith(null);
			expect(calculatePositionState).toHaveBeenCalled();
		});
	});

	describe('useStickyCalculation - Enabled State', () => {
		it('returns false when enabled is false', () => {
			const elementRef = createRef<HTMLDivElement>();
			const element = document.createElement('div');
			elementRef.current = element;

			const params: StickyCalculationParams = {
				elementRef,
				position: 'top',
				threshold: 0,
				container: null,
				enabledRef: { current: false },
				initialPositionRef: { current: null },
			};

			const { result } = renderHook(() => useStickyCalculation(params));

			expect(result.current()).toBe(false);
			expect(getInitialPosition).not.toHaveBeenCalled();
		});

		it('calculates sticky state when enabled is true', () => {
			const elementRef = createRef<HTMLDivElement>();
			const element = document.createElement('div');
			element.getBoundingClientRect = vi.fn(() => ({
				top: 100,
				left: 50,
				right: 150,
				bottom: 200,
				width: 100,
				height: 100,
				x: 50,
				y: 100,
				toJSON: vi.fn(),
			}));
			elementRef.current = element;

			vi.mocked(getInitialPosition).mockReturnValue(100);
			vi.mocked(getScrollY).mockReturnValue(150);
			vi.mocked(calculatePositionState).mockReturnValue(true);

			const params: StickyCalculationParams = {
				elementRef,
				position: 'top',
				threshold: 10,
				container: null,
				enabledRef: { current: true },
				initialPositionRef: { current: null },
			};

			const { result } = renderHook(() => useStickyCalculation(params));

			expect(result.current()).toBe(true);
		});
	});

	describe('useStickyCalculation - Initial Position Caching', () => {
		it('caches initial position on first call', () => {
			const elementRef = createRef<HTMLDivElement>();
			const element = document.createElement('div');
			element.getBoundingClientRect = vi.fn(() => ({
				top: 100,
				left: 50,
				right: 150,
				bottom: 200,
				width: 100,
				height: 100,
				x: 50,
				y: 100,
				toJSON: vi.fn(),
			}));
			elementRef.current = element;

			const initialPositionRef = { current: null };
			vi.mocked(getInitialPosition).mockReturnValue(200);

			const params: StickyCalculationParams = {
				elementRef,
				position: 'top',
				threshold: 10,
				container: null,
				enabledRef: { current: true },
				initialPositionRef,
			};

			const { result } = renderHook(() => useStickyCalculation(params));

			// First call should calculate and cache initial position
			result.current();
			expect(initialPositionRef.current).toBe(200);
			expect(getInitialPosition).toHaveBeenCalledTimes(1);

			// Second call should use cached position
			vi.mocked(getInitialPosition).mockClear();
			result.current();
			expect(getInitialPosition).not.toHaveBeenCalled();
			expect(initialPositionRef.current).toBe(200);
		});

		it('uses existing cached initial position', () => {
			const elementRef = createRef<HTMLDivElement>();
			const element = document.createElement('div');
			element.getBoundingClientRect = vi.fn(() => ({
				top: 100,
				left: 50,
				right: 150,
				bottom: 200,
				width: 100,
				height: 100,
				x: 50,
				y: 100,
				toJSON: vi.fn(),
			}));
			elementRef.current = element;

			const initialPositionRef = { current: 150 };
			vi.mocked(getScrollY).mockReturnValue(200);
			vi.mocked(calculatePositionState).mockReturnValue(true);

			const params: StickyCalculationParams = {
				elementRef,
				position: 'top',
				threshold: 10,
				container: null,
				enabledRef: { current: true },
				initialPositionRef,
			};

			const { result } = renderHook(() => useStickyCalculation(params));

			result.current();
			expect(getInitialPosition).not.toHaveBeenCalled();
			expect(calculatePositionState).toHaveBeenCalledWith(
				expect.objectContaining({
					initialPosition: 150,
				})
			);
		});
	});

	describe('useStickyCalculation - Position Types', () => {
		it('handles top position correctly', () => {
			const elementRef = createRef<HTMLDivElement>();
			const element = document.createElement('div');
			element.getBoundingClientRect = vi.fn(() => ({
				top: 100,
				left: 50,
				right: 150,
				bottom: 200,
				width: 100,
				height: 100,
				x: 50,
				y: 100,
				toJSON: vi.fn(),
			}));
			elementRef.current = element;

			vi.mocked(getInitialPosition).mockReturnValue(100);
			vi.mocked(getScrollY).mockReturnValue(150);
			vi.mocked(calculatePositionState).mockReturnValue(true);

			const params: StickyCalculationParams = {
				elementRef,
				position: 'top',
				threshold: 10,
				container: null,
				enabledRef: { current: true },
				initialPositionRef: { current: null },
			};

			const { result } = renderHook(() => useStickyCalculation(params));

			result.current();
			expect(getScrollY).toHaveBeenCalledWith(null);
			expect(calculatePositionState).toHaveBeenCalledWith(
				expect.objectContaining({
					position: 'top',
				})
			);
		});

		it('handles bottom position correctly', () => {
			const elementRef = createRef<HTMLDivElement>();
			const element = document.createElement('div');
			element.getBoundingClientRect = vi.fn(() => ({
				top: 100,
				left: 50,
				right: 150,
				bottom: 200,
				width: 100,
				height: 100,
				x: 50,
				y: 100,
				toJSON: vi.fn(),
			}));
			elementRef.current = element;

			vi.mocked(getInitialPosition).mockReturnValue(100);
			vi.mocked(getScrollY).mockReturnValue(150);
			vi.mocked(calculatePositionState).mockReturnValue(true);

			const params: StickyCalculationParams = {
				elementRef,
				position: 'bottom',
				threshold: 10,
				container: null,
				enabledRef: { current: true },
				initialPositionRef: { current: null },
			};

			const { result } = renderHook(() => useStickyCalculation(params));

			result.current();
			expect(getScrollY).toHaveBeenCalledWith(null);
			expect(calculatePositionState).toHaveBeenCalledWith(
				expect.objectContaining({
					position: 'bottom',
				})
			);
		});

		it('handles left position correctly', () => {
			const elementRef = createRef<HTMLDivElement>();
			const element = document.createElement('div');
			element.getBoundingClientRect = vi.fn(() => ({
				top: 100,
				left: 50,
				right: 150,
				bottom: 200,
				width: 100,
				height: 100,
				x: 50,
				y: 100,
				toJSON: vi.fn(),
			}));
			elementRef.current = element;

			vi.mocked(getInitialPosition).mockReturnValue(50);
			vi.mocked(getScrollX).mockReturnValue(100);
			vi.mocked(calculatePositionState).mockReturnValue(true);

			const params: StickyCalculationParams = {
				elementRef,
				position: 'left',
				threshold: 10,
				container: null,
				enabledRef: { current: true },
				initialPositionRef: { current: null },
			};

			const { result } = renderHook(() => useStickyCalculation(params));

			result.current();
			expect(getScrollX).toHaveBeenCalledWith(null);
			expect(calculatePositionState).toHaveBeenCalledWith(
				expect.objectContaining({
					position: 'left',
				})
			);
		});

		it('handles right position correctly', () => {
			const elementRef = createRef<HTMLDivElement>();
			const element = document.createElement('div');
			element.getBoundingClientRect = vi.fn(() => ({
				top: 100,
				left: 50,
				right: 150,
				bottom: 200,
				width: 100,
				height: 100,
				x: 50,
				y: 100,
				toJSON: vi.fn(),
			}));
			elementRef.current = element;

			vi.mocked(getInitialPosition).mockReturnValue(50);
			vi.mocked(getScrollX).mockReturnValue(100);
			vi.mocked(calculatePositionState).mockReturnValue(true);

			const params: StickyCalculationParams = {
				elementRef,
				position: 'right',
				threshold: 10,
				container: null,
				enabledRef: { current: true },
				initialPositionRef: { current: null },
			};

			const { result } = renderHook(() => useStickyCalculation(params));

			result.current();
			expect(getScrollX).toHaveBeenCalledWith(null);
			expect(calculatePositionState).toHaveBeenCalledWith(
				expect.objectContaining({
					position: 'right',
				})
			);
		});
	});

	describe('useStickyCalculation - Container Handling', () => {
		it('handles null container', () => {
			const elementRef = createRef<HTMLDivElement>();
			const element = document.createElement('div');
			element.getBoundingClientRect = vi.fn(() => ({
				top: 100,
				left: 50,
				right: 150,
				bottom: 200,
				width: 100,
				height: 100,
				x: 50,
				y: 100,
				toJSON: vi.fn(),
			}));
			elementRef.current = element;

			vi.mocked(getInitialPosition).mockReturnValue(100);
			vi.mocked(getScrollY).mockReturnValue(150);
			vi.mocked(calculatePositionState).mockReturnValue(true);

			const params: StickyCalculationParams = {
				elementRef,
				position: 'top',
				threshold: 10,
				container: null,
				enabledRef: { current: true },
				initialPositionRef: { current: null },
			};

			const { result } = renderHook(() => useStickyCalculation(params));

			result.current();
			expect(getInitialPosition).toHaveBeenCalledWith(element, 'top', null);
			expect(getScrollY).toHaveBeenCalledWith(null);
		});

		it('handles container element', () => {
			const elementRef = createRef<HTMLDivElement>();
			const element = document.createElement('div');
			const container = document.createElement('div');
			container.scrollTop = 50;
			element.getBoundingClientRect = vi.fn(() => ({
				top: 100,
				left: 50,
				right: 150,
				bottom: 200,
				width: 100,
				height: 100,
				x: 50,
				y: 100,
				toJSON: vi.fn(),
			}));
			elementRef.current = element;

			vi.mocked(getInitialPosition).mockReturnValue(150);
			vi.mocked(getScrollY).mockReturnValue(50);
			vi.mocked(calculatePositionState).mockReturnValue(true);

			const params: StickyCalculationParams = {
				elementRef,
				position: 'top',
				threshold: 10,
				container,
				enabledRef: { current: true },
				initialPositionRef: { current: null },
			};

			const { result } = renderHook(() => useStickyCalculation(params));

			result.current();
			expect(getInitialPosition).toHaveBeenCalledWith(element, 'top', container);
			expect(getScrollY).toHaveBeenCalledWith(container);
		});
	});

	describe('useStickyCalculation - Threshold Handling', () => {
		it('passes threshold to calculation function', () => {
			const elementRef = createRef<HTMLDivElement>();
			const element = document.createElement('div');
			element.getBoundingClientRect = vi.fn(() => ({
				top: 100,
				left: 50,
				right: 150,
				bottom: 200,
				width: 100,
				height: 100,
				x: 50,
				y: 100,
				toJSON: vi.fn(),
			}));
			elementRef.current = element;

			vi.mocked(getInitialPosition).mockReturnValue(100);
			vi.mocked(getScrollY).mockReturnValue(150);
			vi.mocked(calculatePositionState).mockReturnValue(true);

			const params: StickyCalculationParams = {
				elementRef,
				position: 'top',
				threshold: 25,
				container: null,
				enabledRef: { current: true },
				initialPositionRef: { current: null },
			};

			const { result } = renderHook(() => useStickyCalculation(params));

			result.current();
			expect(calculatePositionState).toHaveBeenCalledWith(
				expect.objectContaining({
					threshold: 25,
				})
			);
		});
	});

	describe('useStickyCalculation - Dependency Updates', () => {
		it('updates calculation function when dependencies change', () => {
			const elementRef = createRef<HTMLDivElement>();
			const element = document.createElement('div');
			element.getBoundingClientRect = vi.fn(() => ({
				top: 100,
				left: 50,
				right: 150,
				bottom: 200,
				width: 100,
				height: 100,
				x: 50,
				y: 100,
				toJSON: vi.fn(),
			}));
			elementRef.current = element;

			const enabledRef = { current: true };
			const initialPositionRef = { current: null };

			const params: StickyCalculationParams = {
				elementRef,
				position: 'top',
				threshold: 10,
				container: null,
				enabledRef,
				initialPositionRef,
			};

			const { result, rerender } = renderHook(props => useStickyCalculation(props), {
				initialProps: params,
			});

			const firstCall = result.current;

			// Update threshold
			rerender({ ...params, threshold: 20 });
			const secondCall = result.current;

			// Function should be recreated when dependencies change
			expect(firstCall).not.toBe(secondCall);
		});
	});
});
