/**
 * useRatingState Tests
 *
 * Tests for the useRatingState hook including:
 * - State initialization
 * - Controlled vs uncontrolled mode
 * - Display value calculation
 * - Hover state management
 */

import { useRatingState } from '@core/ui/forms/rating/hooks/useRatingState';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useRatingState - Initialization', () => {
	it('initializes with defaultValue', () => {
		const { result } = renderHook(() => useRatingState({ defaultValue: 3 }));

		expect(result.current.currentValue).toBe(3);
		expect(result.current.displayValue).toBe(3);
		expect(result.current.isControlled).toBe(false);
	});

	it('initializes with 0 when no defaultValue provided', () => {
		const { result } = renderHook(() => useRatingState({}));

		expect(result.current.currentValue).toBe(0);
		expect(result.current.displayValue).toBe(0);
		expect(result.current.isControlled).toBe(false);
	});

	it('detects controlled mode when controlledValue is provided', () => {
		const { result } = renderHook(() => useRatingState({ controlledValue: 4 }));

		expect(result.current.isControlled).toBe(true);
		expect(result.current.currentValue).toBe(4);
	});

	it('prioritizes controlledValue over defaultValue', () => {
		const { result } = renderHook(() => useRatingState({ controlledValue: 5, defaultValue: 2 }));

		expect(result.current.isControlled).toBe(true);
		expect(result.current.currentValue).toBe(5);
	});
});

describe('useRatingState - Display Value', () => {
	it('uses currentValue when no hover', () => {
		const { result } = renderHook(() => useRatingState({ defaultValue: 3 }));

		expect(result.current.displayValue).toBe(3);
	});

	it('uses hoverValue when hover is active', () => {
		const { result } = renderHook(() => useRatingState({ defaultValue: 3 }));

		act(() => {
			result.current.setHoverValue(5);
		});

		expect(result.current.displayValue).toBe(5);
		expect(result.current.currentValue).toBe(3);
	});

	it('reverts to currentValue when hover is cleared', () => {
		const { result } = renderHook(() => useRatingState({ defaultValue: 3 }));

		act(() => {
			result.current.setHoverValue(5);
		});

		expect(result.current.displayValue).toBe(5);

		act(() => {
			result.current.setHoverValue(null);
		});

		expect(result.current.displayValue).toBe(3);
	});
});

describe('useRatingState - Internal Value Updates', () => {
	it('updates internal value in uncontrolled mode', () => {
		const { result } = renderHook(() => useRatingState({ defaultValue: 2 }));

		act(() => {
			result.current.setInternalValue(4);
		});

		expect(result.current.currentValue).toBe(4);
		expect(result.current.displayValue).toBe(4);
	});

	it('updates display value when internal value changes', () => {
		const { result } = renderHook(() => useRatingState({ defaultValue: 1 }));

		act(() => {
			result.current.setInternalValue(3);
		});

		expect(result.current.displayValue).toBe(3);
	});
});

describe('useRatingState - Controlled Value Updates', () => {
	it('updates when controlledValue changes', () => {
		const { result, rerender } = renderHook(
			({ controlledValue }: { controlledValue?: number }) => useRatingState({ controlledValue }),
			{
				initialProps: {},
			}
		);

		expect(result.current.currentValue).toBe(0);

		rerender({ controlledValue: 3 });

		expect(result.current.currentValue).toBe(3);
		expect(result.current.displayValue).toBe(3);
	});

	it('maintains hover value when controlledValue changes', () => {
		const { result, rerender } = renderHook(
			({ controlledValue }: { controlledValue?: number }) => useRatingState({ controlledValue }),
			{
				initialProps: {},
			}
		);

		act(() => {
			result.current.setHoverValue(5);
		});

		rerender({ controlledValue: 2 });

		expect(result.current.currentValue).toBe(2);
		expect(result.current.displayValue).toBe(5); // Still showing hover
	});
});

describe('useRatingState - Hover State', () => {
	it('tracks hover value', () => {
		const { result } = renderHook(() => useRatingState({ defaultValue: 2 }));

		act(() => {
			result.current.setHoverValue(4);
		});

		expect(result.current.hoverValue).toBe(4);
	});

	it('clears hover value', () => {
		const { result } = renderHook(() => useRatingState({ defaultValue: 2 }));

		act(() => {
			result.current.setHoverValue(4);
		});

		act(() => {
			result.current.setHoverValue(null);
		});

		expect(result.current.hoverValue).toBeNull();
		expect(result.current.displayValue).toBe(2);
	});
});

describe('useRatingState - Integration', () => {
	it('handles complete interaction flow', () => {
		const { result } = renderHook(() => useRatingState({ defaultValue: 0 }));

		// Initial state
		expect(result.current.currentValue).toBe(0);
		expect(result.current.displayValue).toBe(0);

		// Hover
		act(() => {
			result.current.setHoverValue(3);
		});
		expect(result.current.displayValue).toBe(3);

		// Click (update internal value)
		act(() => {
			result.current.setInternalValue(3);
		});
		expect(result.current.currentValue).toBe(3);

		// Clear hover
		act(() => {
			result.current.setHoverValue(null);
		});
		expect(result.current.displayValue).toBe(3);
	});
});
