/**
 * useOTPInputValue Tests
 *
 * Tests for value management hook:
 * - useOTPInputValue
 * - Controlled mode
 * - Uncontrolled mode
 * - Value normalization
 * - Internal state management
 */

import { useOTPInputValue } from '@core/ui/forms/otp-input/hooks/useOTPInput.value';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useOTPInputValue', () => {
	it('should be a function', () => {
		expect(typeof useOTPInputValue).toBe('function');
	});

	it('should return normalizedValue, isControlled, and setInternalValue', () => {
		const { result } = renderHook(() => useOTPInputValue(undefined, '', 6));

		expect(result.current).toHaveProperty('normalizedValue');
		expect(result.current).toHaveProperty('isControlled');
		expect(result.current).toHaveProperty('setInternalValue');
		expect(typeof result.current.setInternalValue).toBe('function');
	});
});

describe('useOTPInputValue - Uncontrolled Mode', () => {
	it('should use defaultValue in uncontrolled mode', () => {
		const { result } = renderHook(() => useOTPInputValue(undefined, '123', 6));

		expect(result.current.isControlled).toBe(false);
		expect(result.current.normalizedValue).toBe('123');
	});

	it('should use empty string as default when defaultValue is not provided', () => {
		const { result } = renderHook(() => useOTPInputValue(undefined, '', 6));

		expect(result.current.isControlled).toBe(false);
		expect(result.current.normalizedValue).toBe('');
	});

	it('should update internal value when setInternalValue is called', () => {
		const { result } = renderHook(() => useOTPInputValue(undefined, '', 6));

		act(() => {
			result.current.setInternalValue('123');
		});

		expect(result.current.normalizedValue).toBe('123');
	});

	it('should normalize value to max length', () => {
		const { result } = renderHook(() => useOTPInputValue(undefined, '', 6));

		act(() => {
			result.current.setInternalValue('123456789');
		});

		expect(result.current.normalizedValue).toBe('123456');
	});

	it('should handle empty string updates', () => {
		const { result } = renderHook(() => useOTPInputValue(undefined, '123', 6));

		act(() => {
			result.current.setInternalValue('');
		});

		expect(result.current.normalizedValue).toBe('');
	});
});

describe('useOTPInputValue - Controlled Mode', () => {
	it('should detect controlled mode when value is provided', () => {
		const { result } = renderHook(() => useOTPInputValue('123', '', 6));

		expect(result.current.isControlled).toBe(true);
		expect(result.current.normalizedValue).toBe('123');
	});

	it('should use controlled value over defaultValue', () => {
		const { result } = renderHook(() => useOTPInputValue('456', '123', 6));

		expect(result.current.isControlled).toBe(true);
		expect(result.current.normalizedValue).toBe('456');
	});

	it('should normalize controlled value to max length', () => {
		const { result } = renderHook(() => useOTPInputValue('123456789', '', 6));

		expect(result.current.normalizedValue).toBe('123456');
	});

	it('should update when controlled value changes', () => {
		const { result, rerender } = renderHook(({ value }) => useOTPInputValue(value, '', 6), {
			initialProps: { value: '123' },
		});

		expect(result.current.normalizedValue).toBe('123');

		rerender({ value: '456' });
		expect(result.current.normalizedValue).toBe('456');
	});

	it('should not update internal value in controlled mode', () => {
		const { result } = renderHook(() => useOTPInputValue('123', '', 6));

		act(() => {
			result.current.setInternalValue('999');
		});

		// Should still use controlled value
		expect(result.current.normalizedValue).toBe('123');
	});

	it('should handle empty controlled value', () => {
		const { result } = renderHook(() => useOTPInputValue('', '', 6));

		expect(result.current.isControlled).toBe(true);
		expect(result.current.normalizedValue).toBe('');
	});

	it('should handle undefined controlled value as uncontrolled', () => {
		const { result } = renderHook(() => useOTPInputValue(undefined, '123', 6));

		expect(result.current.isControlled).toBe(false);
		expect(result.current.normalizedValue).toBe('123');
	});
});

describe('useOTPInputValue - Value Normalization', () => {
	it('should normalize value to specified length', () => {
		const { result } = renderHook(() => useOTPInputValue('123456789', '', 4));

		expect(result.current.normalizedValue).toBe('1234');
	});

	it('should handle value shorter than length', () => {
		const { result } = renderHook(() => useOTPInputValue('12', '', 6));

		expect(result.current.normalizedValue).toBe('12');
	});

	it('should handle value equal to length', () => {
		const { result } = renderHook(() => useOTPInputValue('123456', '', 6));

		expect(result.current.normalizedValue).toBe('123456');
	});

	it('should handle different OTP lengths', () => {
		const { result: result4 } = renderHook(() => useOTPInputValue('1234', '', 4));
		const { result: result6 } = renderHook(() => useOTPInputValue('123456', '', 6));
		const { result: result8 } = renderHook(() => useOTPInputValue('12345678', '', 8));

		expect(result4.current.normalizedValue).toBe('1234');
		expect(result6.current.normalizedValue).toBe('123456');
		expect(result8.current.normalizedValue).toBe('12345678');
	});

	it('should normalize long values to different lengths', () => {
		const longValue = '123456789012345';
		const { result: result4 } = renderHook(() => useOTPInputValue(longValue, '', 4));
		const { result: result6 } = renderHook(() => useOTPInputValue(longValue, '', 6));

		expect(result4.current.normalizedValue).toBe('1234');
		expect(result6.current.normalizedValue).toBe('123456');
	});
});

describe('useOTPInputValue - Edge Cases', () => {
	it('should handle empty string in both modes', () => {
		const { result: uncontrolled } = renderHook(() => useOTPInputValue(undefined, '', 6));
		const { result: controlled } = renderHook(() => useOTPInputValue('', '', 6));

		expect(uncontrolled.current.normalizedValue).toBe('');
		expect(controlled.current.normalizedValue).toBe('');
	});

	it('should handle zero length', () => {
		const { result } = renderHook(() => useOTPInputValue('123', '', 0));

		expect(result.current.normalizedValue).toBe('');
	});

	it('should maintain state consistency across rerenders in uncontrolled mode', () => {
		const { result } = renderHook(() => useOTPInputValue(undefined, '', 6));

		act(() => {
			result.current.setInternalValue('123');
		});

		expect(result.current.normalizedValue).toBe('123');

		// Rerender should maintain state
		const { result: result2 } = renderHook(() => useOTPInputValue(undefined, '', 6));
		expect(result2.current.normalizedValue).toBe('');
		// Note: This is a new hook instance, so it starts fresh
	});
});
