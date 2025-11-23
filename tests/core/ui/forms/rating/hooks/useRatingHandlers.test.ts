/**
 * useRatingHandlers Tests
 *
 * Tests for the useRatingHandlers hook including:
 * - Star click handling
 * - Star hover handling
 * - Mouse leave handling
 * - Read-only and disabled states
 * - Controlled vs uncontrolled modes
 */

import {
	useRatingHandlers,
	useRatingStateAndHandlers,
} from '@core/ui/forms/rating/hooks/useRatingHandlers';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useRatingHandlers - Star Click', () => {
	it('calls onChange with correct value', () => {
		const onChange = vi.fn();
		const setInternalValue = vi.fn();
		const setHoverValue = vi.fn();

		const { result } = renderHook(() =>
			useRatingHandlers({
				readOnly: false,
				disabled: false,
				isControlled: false,
				setInternalValue,
				setHoverValue,
				onChange,
			})
		);

		act(() => {
			result.current.handleStarClick(2);
		});

		expect(onChange).toHaveBeenCalledWith(3);
		expect(setInternalValue).toHaveBeenCalledWith(3);
	});

	it('does not call onChange in controlled mode', () => {
		const onChange = vi.fn();
		const setInternalValue = vi.fn();
		const setHoverValue = vi.fn();

		const { result } = renderHook(() =>
			useRatingHandlers({
				readOnly: false,
				disabled: false,
				isControlled: true,
				setInternalValue,
				setHoverValue,
				onChange,
			})
		);

		act(() => {
			result.current.handleStarClick(2);
		});

		expect(onChange).toHaveBeenCalledWith(3);
		expect(setInternalValue).not.toHaveBeenCalled();
	});

	it('does not handle click when readOnly', () => {
		const onChange = vi.fn();
		const setInternalValue = vi.fn();
		const setHoverValue = vi.fn();

		const { result } = renderHook(() =>
			useRatingHandlers({
				readOnly: true,
				disabled: false,
				isControlled: false,
				setInternalValue,
				setHoverValue,
				onChange,
			})
		);

		act(() => {
			result.current.handleStarClick(2);
		});

		expect(onChange).not.toHaveBeenCalled();
		expect(setInternalValue).not.toHaveBeenCalled();
	});

	it('does not handle click when disabled', () => {
		const onChange = vi.fn();
		const setInternalValue = vi.fn();
		const setHoverValue = vi.fn();

		const { result } = renderHook(() =>
			useRatingHandlers({
				readOnly: false,
				disabled: true,
				isControlled: false,
				setInternalValue,
				setHoverValue,
				onChange,
			})
		);

		act(() => {
			result.current.handleStarClick(2);
		});

		expect(onChange).not.toHaveBeenCalled();
		expect(setInternalValue).not.toHaveBeenCalled();
	});
});

describe('useRatingHandlers - Star Hover', () => {
	it('sets hover value on hover', () => {
		const setHoverValue = vi.fn();

		const { result } = renderHook(() =>
			useRatingHandlers({
				readOnly: false,
				disabled: false,
				isControlled: false,
				setInternalValue: vi.fn(),
				setHoverValue,
				onChange: undefined,
			})
		);

		act(() => {
			result.current.handleStarHover(2);
		});

		expect(setHoverValue).toHaveBeenCalledWith(3);
	});

	it('does not handle hover when readOnly', () => {
		const setHoverValue = vi.fn();

		const { result } = renderHook(() =>
			useRatingHandlers({
				readOnly: true,
				disabled: false,
				isControlled: false,
				setInternalValue: vi.fn(),
				setHoverValue,
				onChange: undefined,
			})
		);

		act(() => {
			result.current.handleStarHover(2);
		});

		expect(setHoverValue).not.toHaveBeenCalled();
	});

	it('does not handle hover when disabled', () => {
		const setHoverValue = vi.fn();

		const { result } = renderHook(() =>
			useRatingHandlers({
				readOnly: false,
				disabled: true,
				isControlled: false,
				setInternalValue: vi.fn(),
				setHoverValue,
				onChange: undefined,
			})
		);

		act(() => {
			result.current.handleStarHover(2);
		});

		expect(setHoverValue).not.toHaveBeenCalled();
	});
});

describe('useRatingHandlers - Mouse Leave', () => {
	it('clears hover value on mouse leave', () => {
		const setHoverValue = vi.fn();

		const { result } = renderHook(() =>
			useRatingHandlers({
				readOnly: false,
				disabled: false,
				isControlled: false,
				setInternalValue: vi.fn(),
				setHoverValue,
				onChange: undefined,
			})
		);

		act(() => {
			result.current.handleMouseLeave();
		});

		expect(setHoverValue).toHaveBeenCalledWith(null);
	});

	it('does not handle mouse leave when readOnly', () => {
		const setHoverValue = vi.fn();

		const { result } = renderHook(() =>
			useRatingHandlers({
				readOnly: true,
				disabled: false,
				isControlled: false,
				setInternalValue: vi.fn(),
				setHoverValue,
				onChange: undefined,
			})
		);

		act(() => {
			result.current.handleMouseLeave();
		});

		expect(setHoverValue).not.toHaveBeenCalled();
	});

	it('does not handle mouse leave when disabled', () => {
		const setHoverValue = vi.fn();

		const { result } = renderHook(() =>
			useRatingHandlers({
				readOnly: false,
				disabled: true,
				isControlled: false,
				setInternalValue: vi.fn(),
				setHoverValue,
				onChange: undefined,
			})
		);

		act(() => {
			result.current.handleMouseLeave();
		});

		expect(setHoverValue).not.toHaveBeenCalled();
	});
});

describe('useRatingStateAndHandlers - Integration', () => {
	it('integrates state and handlers correctly', () => {
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useRatingStateAndHandlers({
				controlledValue: undefined,
				defaultValue: 0,
				readOnly: false,
				disabled: false,
				onChange,
			})
		);

		expect(result.current.currentValue).toBe(0);
		expect(result.current.displayValue).toBe(0);

		act(() => {
			result.current.handleStarClick(2);
		});

		expect(onChange).toHaveBeenCalledWith(3);
		expect(result.current.currentValue).toBe(3);
	});

	it('handles hover correctly', () => {
		const { result } = renderHook(() =>
			useRatingStateAndHandlers({
				controlledValue: undefined,
				defaultValue: 2,
				readOnly: false,
				disabled: false,
				onChange: undefined,
			})
		);

		act(() => {
			result.current.handleStarHover(3);
		});

		expect(result.current.displayValue).toBe(4);
		expect(result.current.currentValue).toBe(2);

		act(() => {
			result.current.handleMouseLeave();
		});

		expect(result.current.displayValue).toBe(2);
	});

	it('handles controlled mode', () => {
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useRatingStateAndHandlers({
				controlledValue: 3,
				defaultValue: undefined,
				readOnly: false,
				disabled: false,
				onChange,
			})
		);

		expect(result.current.currentValue).toBe(3);

		act(() => {
			result.current.handleStarClick(4);
		});

		expect(onChange).toHaveBeenCalledWith(5);
		// Value should not change internally in controlled mode
		expect(result.current.currentValue).toBe(3);
	});

	it('respects readOnly mode', () => {
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useRatingStateAndHandlers({
				controlledValue: undefined,
				defaultValue: 2,
				readOnly: true,
				disabled: false,
				onChange,
			})
		);

		act(() => {
			result.current.handleStarClick(3);
		});

		expect(onChange).not.toHaveBeenCalled();
		expect(result.current.currentValue).toBe(2);
	});

	it('respects disabled mode', () => {
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useRatingStateAndHandlers({
				controlledValue: undefined,
				defaultValue: 2,
				readOnly: false,
				disabled: true,
				onChange,
			})
		);

		act(() => {
			result.current.handleStarClick(3);
		});

		expect(onChange).not.toHaveBeenCalled();
		expect(result.current.currentValue).toBe(2);
	});
});
