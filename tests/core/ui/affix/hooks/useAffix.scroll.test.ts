/**
 * useScrollHandler Tests
 *
 * Tests for the useScrollHandler hook including:
 * - Hook initialization
 * - Scroll handler function return
 * - Enabled state handling
 * - Sticky state calculation
 * - State updates
 * - Callback invocation
 * - Edge cases (disabled state, no state change)
 */

import { useScrollHandler } from '@core/ui/affix/hooks/useAffix.scroll';
import type { ScrollHandlerParams } from '@core/ui/affix/types/useAffix.types';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useScrollHandler - Hook Initialization', () => {
	it('should be a function', () => {
		expect(typeof useScrollHandler).toBe('function');
	});

	it('returns a scroll handler function', () => {
		const calculateStickyState = vi.fn(() => false);
		const setIsSticky = vi.fn();
		const params: ScrollHandlerParams = {
			calculateStickyState,
			isSticky: false,
			onStickyChange: undefined,
			setIsSticky,
			enabledRef: { current: true },
		};

		const { result } = renderHook(() => useScrollHandler(params));

		expect(typeof result.current).toBe('function');
	});

	it('returns a stable function reference when dependencies do not change', () => {
		const calculateStickyState = vi.fn(() => false);
		const setIsSticky = vi.fn();
		const params: ScrollHandlerParams = {
			calculateStickyState,
			isSticky: false,
			onStickyChange: undefined,
			setIsSticky,
			enabledRef: { current: true },
		};

		const { result, rerender } = renderHook(() => useScrollHandler(params));

		const firstCall = result.current;
		rerender();
		const secondCall = result.current;

		expect(firstCall).toBe(secondCall);
	});
});

describe('useScrollHandler - Enabled State', () => {
	it('returns early when enabled is false', () => {
		const calculateStickyState = vi.fn(() => true);
		const setIsSticky = vi.fn();
		const params: ScrollHandlerParams = {
			calculateStickyState,
			isSticky: false,
			onStickyChange: undefined,
			setIsSticky,
			enabledRef: { current: false },
		};

		const { result } = renderHook(() => useScrollHandler(params));

		result.current();

		expect(calculateStickyState).not.toHaveBeenCalled();
		expect(setIsSticky).not.toHaveBeenCalled();
	});

	it('processes scroll when enabled is true', () => {
		const calculateStickyState = vi.fn(() => true);
		const setIsSticky = vi.fn();
		const params: ScrollHandlerParams = {
			calculateStickyState,
			isSticky: false,
			onStickyChange: undefined,
			setIsSticky,
			enabledRef: { current: true },
		};

		const { result } = renderHook(() => useScrollHandler(params));

		result.current();

		expect(calculateStickyState).toHaveBeenCalledTimes(1);
		expect(setIsSticky).toHaveBeenCalledWith(true);
	});
});

describe('useScrollHandler - Sticky State Calculation', () => {
	it('calls calculateStickyState when handler is invoked', () => {
		const calculateStickyState = vi.fn(() => false);
		const setIsSticky = vi.fn();
		const params: ScrollHandlerParams = {
			calculateStickyState,
			isSticky: false,
			onStickyChange: undefined,
			setIsSticky,
			enabledRef: { current: true },
		};

		const { result } = renderHook(() => useScrollHandler(params));

		result.current();

		expect(calculateStickyState).toHaveBeenCalledTimes(1);
	});

	it('uses result from calculateStickyState for state update', () => {
		const calculateStickyState = vi.fn(() => true);
		const setIsSticky = vi.fn();
		const params: ScrollHandlerParams = {
			calculateStickyState,
			isSticky: false,
			onStickyChange: undefined,
			setIsSticky,
			enabledRef: { current: true },
		};

		const { result } = renderHook(() => useScrollHandler(params));

		result.current();

		expect(setIsSticky).toHaveBeenCalledWith(true);
	});
});

describe('useScrollHandler - State Updates', () => {
	it('updates state when sticky state changes from false to true', () => {
		const calculateStickyState = vi.fn(() => true);
		const setIsSticky = vi.fn();
		const params: ScrollHandlerParams = {
			calculateStickyState,
			isSticky: false,
			onStickyChange: undefined,
			setIsSticky,
			enabledRef: { current: true },
		};

		const { result } = renderHook(() => useScrollHandler(params));

		result.current();

		expect(setIsSticky).toHaveBeenCalledTimes(1);
		expect(setIsSticky).toHaveBeenCalledWith(true);
	});

	it('updates state when sticky state changes from true to false', () => {
		const calculateStickyState = vi.fn(() => false);
		const setIsSticky = vi.fn();
		const params: ScrollHandlerParams = {
			calculateStickyState,
			isSticky: true,
			onStickyChange: undefined,
			setIsSticky,
			enabledRef: { current: true },
		};

		const { result } = renderHook(() => useScrollHandler(params));

		result.current();

		expect(setIsSticky).toHaveBeenCalledTimes(1);
		expect(setIsSticky).toHaveBeenCalledWith(false);
	});

	it('does not update state when sticky state does not change', () => {
		const calculateStickyState = vi.fn(() => false);
		const setIsSticky = vi.fn();
		const params: ScrollHandlerParams = {
			calculateStickyState,
			isSticky: false,
			onStickyChange: undefined,
			setIsSticky,
			enabledRef: { current: true },
		};

		const { result } = renderHook(() => useScrollHandler(params));

		result.current();

		expect(setIsSticky).not.toHaveBeenCalled();
	});

	it('does not update state when sticky state remains true', () => {
		const calculateStickyState = vi.fn(() => true);
		const setIsSticky = vi.fn();
		const params: ScrollHandlerParams = {
			calculateStickyState,
			isSticky: true,
			onStickyChange: undefined,
			setIsSticky,
			enabledRef: { current: true },
		};

		const { result } = renderHook(() => useScrollHandler(params));

		result.current();

		expect(setIsSticky).not.toHaveBeenCalled();
	});
});

describe('useScrollHandler - Callback Invocation', () => {
	it('calls onStickyChange when provided and state changes', () => {
		const calculateStickyState = vi.fn(() => true);
		const setIsSticky = vi.fn();
		const onStickyChange = vi.fn();
		const params: ScrollHandlerParams = {
			calculateStickyState,
			isSticky: false,
			onStickyChange,
			setIsSticky,
			enabledRef: { current: true },
		};

		const { result } = renderHook(() => useScrollHandler(params));

		result.current();

		expect(onStickyChange).toHaveBeenCalledTimes(1);
		expect(onStickyChange).toHaveBeenCalledWith(true);
	});

	it('does not call onStickyChange when state does not change', () => {
		const calculateStickyState = vi.fn(() => false);
		const setIsSticky = vi.fn();
		const onStickyChange = vi.fn();
		const params: ScrollHandlerParams = {
			calculateStickyState,
			isSticky: false,
			onStickyChange,
			setIsSticky,
			enabledRef: { current: true },
		};

		const { result } = renderHook(() => useScrollHandler(params));

		result.current();

		expect(onStickyChange).not.toHaveBeenCalled();
	});

	it('handles undefined onStickyChange gracefully', () => {
		const calculateStickyState = vi.fn(() => true);
		const setIsSticky = vi.fn();
		const params: ScrollHandlerParams = {
			calculateStickyState,
			isSticky: false,
			onStickyChange: undefined,
			setIsSticky,
			enabledRef: { current: true },
		};

		const { result } = renderHook(() => useScrollHandler(params));

		expect(() => result.current()).not.toThrow();
		expect(setIsSticky).toHaveBeenCalledWith(true);
	});

	it('calls onStickyChange with correct value when state changes', () => {
		const calculateStickyState = vi.fn(() => false);
		const setIsSticky = vi.fn();
		const onStickyChange = vi.fn();
		const params: ScrollHandlerParams = {
			calculateStickyState,
			isSticky: true,
			onStickyChange,
			setIsSticky,
			enabledRef: { current: true },
		};

		const { result } = renderHook(() => useScrollHandler(params));

		result.current();

		expect(onStickyChange).toHaveBeenCalledWith(false);
	});
});

describe('useScrollHandler - Multiple Invocations', () => {
	it('handles multiple scroll handler invocations', () => {
		const calculateStickyState = vi
			.fn()
			.mockReturnValueOnce(false)
			.mockReturnValueOnce(true)
			.mockReturnValueOnce(false);
		const setIsSticky = vi.fn();
		const params: ScrollHandlerParams = {
			calculateStickyState,
			isSticky: true,
			onStickyChange: undefined,
			setIsSticky,
			enabledRef: { current: true },
		};

		const { result, rerender } = renderHook(props => useScrollHandler(props), {
			initialProps: params,
		});

		// First call: true -> false
		result.current();
		expect(setIsSticky).toHaveBeenCalledWith(false);
		expect(setIsSticky).toHaveBeenCalledTimes(1);

		// Update isSticky to match new state
		rerender({ ...params, isSticky: false });

		// Second call: false -> true
		result.current();
		expect(setIsSticky).toHaveBeenCalledWith(true);
		expect(setIsSticky).toHaveBeenCalledTimes(2);

		// Update isSticky to match new state
		rerender({ ...params, isSticky: true });

		// Third call: true -> false
		result.current();
		expect(setIsSticky).toHaveBeenCalledWith(false);
		expect(setIsSticky).toHaveBeenCalledTimes(3);
	});
});

describe('useScrollHandler - Dependency Updates', () => {
	it('updates handler when calculateStickyState changes', () => {
		const calculateStickyState1 = vi.fn(() => true);
		const calculateStickyState2 = vi.fn(() => true);
		const setIsSticky = vi.fn();
		const params: ScrollHandlerParams = {
			calculateStickyState: calculateStickyState1,
			isSticky: false,
			onStickyChange: undefined,
			setIsSticky,
			enabledRef: { current: true },
		};

		const { result, rerender } = renderHook(props => useScrollHandler(props), {
			initialProps: params,
		});

		const firstHandler = result.current;
		rerender({ ...params, calculateStickyState: calculateStickyState2 });
		const secondHandler = result.current;

		expect(firstHandler).not.toBe(secondHandler);
	});

	it('updates handler when isSticky changes', () => {
		const calculateStickyState = vi.fn(() => true);
		const setIsSticky = vi.fn();
		const params: ScrollHandlerParams = {
			calculateStickyState,
			isSticky: false,
			onStickyChange: undefined,
			setIsSticky,
			enabledRef: { current: true },
		};

		const { result, rerender } = renderHook(props => useScrollHandler(props), {
			initialProps: params,
		});

		const firstHandler = result.current;
		rerender({ ...params, isSticky: true });
		const secondHandler = result.current;

		expect(firstHandler).not.toBe(secondHandler);
	});

	it('updates handler when onStickyChange changes', () => {
		const calculateStickyState = vi.fn(() => true);
		const setIsSticky = vi.fn();
		const onStickyChange1 = vi.fn();
		const onStickyChange2 = vi.fn();
		const params: ScrollHandlerParams = {
			calculateStickyState,
			isSticky: false,
			onStickyChange: onStickyChange1,
			setIsSticky,
			enabledRef: { current: true },
		};

		const { result, rerender } = renderHook(props => useScrollHandler(props), {
			initialProps: params,
		});

		const firstHandler = result.current;
		rerender({ ...params, onStickyChange: onStickyChange2 });
		const secondHandler = result.current;

		expect(firstHandler).not.toBe(secondHandler);
	});

	it('updates handler when enabledRef changes', () => {
		const calculateStickyState = vi.fn(() => true);
		const setIsSticky = vi.fn();
		const enabledRef1 = { current: true };
		const enabledRef2 = { current: false };
		const params: ScrollHandlerParams = {
			calculateStickyState,
			isSticky: false,
			onStickyChange: undefined,
			setIsSticky,
			enabledRef: enabledRef1,
		};

		const { result, rerender } = renderHook(props => useScrollHandler(props), {
			initialProps: params,
		});

		const firstHandler = result.current;
		rerender({ ...params, enabledRef: enabledRef2 });
		const secondHandler = result.current;

		expect(firstHandler).not.toBe(secondHandler);
	});
});

describe('useScrollHandler - Edge Cases', () => {
	it('handles rapid state changes', () => {
		const calculateStickyState = vi.fn(() => true);
		const setIsSticky = vi.fn();
		const params: ScrollHandlerParams = {
			calculateStickyState,
			isSticky: false,
			onStickyChange: undefined,
			setIsSticky,
			enabledRef: { current: true },
		};

		const { result } = renderHook(() => useScrollHandler(params));

		// Call handler multiple times rapidly
		for (let i = 0; i < 10; i++) {
			result.current();
		}

		expect(calculateStickyState).toHaveBeenCalledTimes(10);
		// Since isSticky remains false (setIsSticky is a mock), each call will trigger setIsSticky
		// because calculateStickyState returns true (different from current isSticky: false)
		expect(setIsSticky).toHaveBeenCalledTimes(10);
	});

	it('handles calculateStickyState throwing an error gracefully', () => {
		const calculateStickyState = vi.fn(() => {
			throw new Error('Calculation error');
		});
		const setIsSticky = vi.fn();
		const params: ScrollHandlerParams = {
			calculateStickyState,
			isSticky: false,
			onStickyChange: undefined,
			setIsSticky,
			enabledRef: { current: true },
		};

		const { result } = renderHook(() => useScrollHandler(params));

		expect(() => result.current()).toThrow('Calculation error');
		expect(setIsSticky).not.toHaveBeenCalled();
	});
});
