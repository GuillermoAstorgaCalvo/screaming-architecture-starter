/**
 * useOTPInputChangeHandler Tests
 *
 * Tests for change handler hook:
 * - useOTPInputChangeHandler
 * - Controlled vs uncontrolled mode
 * - onChange callback
 * - onComplete callback
 */

import { useOTPInputChangeHandler } from '@core/ui/forms/otp-input/hooks/useOTPInput.changeHandler';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useOTPInputChangeHandler', () => {
	it('should be a function', () => {
		expect(typeof useOTPInputChangeHandler).toBe('function');
	});

	it('should return a function', () => {
		const { result } = renderHook(() =>
			useOTPInputChangeHandler({
				isControlled: false,
				setInternalValue: vi.fn(),
				length: 6,
			})
		);

		expect(typeof result.current).toBe('function');
	});
});

describe('useOTPInputChangeHandler - Uncontrolled Mode', () => {
	it('should call setInternalValue in uncontrolled mode', () => {
		const setInternalValue = vi.fn();
		const { result } = renderHook(() =>
			useOTPInputChangeHandler({
				isControlled: false,
				setInternalValue,
				length: 6,
			})
		);

		act(() => {
			result.current('123');
		});

		expect(setInternalValue).toHaveBeenCalledWith('123');
		expect(setInternalValue).toHaveBeenCalledTimes(1);
	});

	it('should not call setInternalValue in controlled mode', () => {
		const setInternalValue = vi.fn();
		const { result } = renderHook(() =>
			useOTPInputChangeHandler({
				isControlled: true,
				setInternalValue,
				length: 6,
			})
		);

		act(() => {
			result.current('123');
		});

		expect(setInternalValue).not.toHaveBeenCalled();
	});
});

describe('useOTPInputChangeHandler - onChange Callback', () => {
	it('should call onChange when provided', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useOTPInputChangeHandler({
				isControlled: false,
				setInternalValue: vi.fn(),
				length: 6,
				onChange,
			})
		);

		act(() => {
			result.current('123456');
		});

		expect(onChange).toHaveBeenCalledWith('123456');
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('should work without onChange callback', () => {
		const { result } = renderHook(() =>
			useOTPInputChangeHandler({
				isControlled: false,
				setInternalValue: vi.fn(),
				length: 6,
			})
		);

		expect(() => {
			act(() => {
				result.current('123');
			});
		}).not.toThrow();
	});

	it('should call onChange for any value length', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useOTPInputChangeHandler({
				isControlled: false,
				setInternalValue: vi.fn(),
				length: 6,
				onChange,
			})
		);

		act(() => {
			result.current('1');
		});
		expect(onChange).toHaveBeenCalledWith('1');

		act(() => {
			result.current('12');
		});
		expect(onChange).toHaveBeenCalledWith('12');

		act(() => {
			result.current('123456');
		});
		expect(onChange).toHaveBeenCalledWith('123456');
	});
});

describe('useOTPInputChangeHandler - onComplete Callback', () => {
	it('should call onComplete when value length equals OTP length', () => {
		const onComplete = vi.fn();
		const { result } = renderHook(() =>
			useOTPInputChangeHandler({
				isControlled: false,
				setInternalValue: vi.fn(),
				length: 6,
				onComplete,
			})
		);

		act(() => {
			result.current('123456');
		});

		expect(onComplete).toHaveBeenCalledWith('123456');
		expect(onComplete).toHaveBeenCalledTimes(1);
	});

	it('should not call onComplete when value length is less than OTP length', () => {
		const onComplete = vi.fn();
		const { result } = renderHook(() =>
			useOTPInputChangeHandler({
				isControlled: false,
				setInternalValue: vi.fn(),
				length: 6,
				onComplete,
			})
		);

		act(() => {
			result.current('123');
		});

		expect(onComplete).not.toHaveBeenCalled();
	});

	it('should not call onComplete when value length exceeds OTP length', () => {
		const onComplete = vi.fn();
		const { result } = renderHook(() =>
			useOTPInputChangeHandler({
				isControlled: false,
				setInternalValue: vi.fn(),
				length: 6,
				onComplete,
			})
		);

		act(() => {
			result.current('1234567');
		});

		expect(onComplete).not.toHaveBeenCalled();
	});

	it('should work without onComplete callback', () => {
		const { result } = renderHook(() =>
			useOTPInputChangeHandler({
				isControlled: false,
				setInternalValue: vi.fn(),
				length: 6,
			})
		);

		expect(() => {
			act(() => {
				result.current('123456');
			});
		}).not.toThrow();
	});

	it('should handle different OTP lengths', () => {
		const onComplete = vi.fn();
		const { result } = renderHook(() =>
			useOTPInputChangeHandler({
				isControlled: false,
				setInternalValue: vi.fn(),
				length: 4,
				onComplete,
			})
		);

		act(() => {
			result.current('1234');
		});

		expect(onComplete).toHaveBeenCalledWith('1234');
	});
});

describe('useOTPInputChangeHandler - Integration', () => {
	it('should call both onChange and onComplete when value is complete', () => {
		const onChange = vi.fn();
		const onComplete = vi.fn();
		const { result } = renderHook(() =>
			useOTPInputChangeHandler({
				isControlled: false,
				setInternalValue: vi.fn(),
				length: 6,
				onChange,
				onComplete,
			})
		);

		act(() => {
			result.current('123456');
		});

		expect(onChange).toHaveBeenCalledWith('123456');
		expect(onComplete).toHaveBeenCalledWith('123456');
	});

	it('should handle multiple value changes', () => {
		const onChange = vi.fn();
		const onComplete = vi.fn();
		const { result } = renderHook(() =>
			useOTPInputChangeHandler({
				isControlled: false,
				setInternalValue: vi.fn(),
				length: 6,
				onChange,
				onComplete,
			})
		);

		act(() => {
			result.current('1');
		});
		expect(onChange).toHaveBeenCalledWith('1');
		expect(onComplete).not.toHaveBeenCalled();

		act(() => {
			result.current('12');
		});
		expect(onChange).toHaveBeenCalledWith('12');
		expect(onComplete).not.toHaveBeenCalled();

		act(() => {
			result.current('123456');
		});
		expect(onChange).toHaveBeenCalledWith('123456');
		expect(onComplete).toHaveBeenCalledWith('123456');
	});

	it('should update when dependencies change', () => {
		const onChange1 = vi.fn();
		const onChange2 = vi.fn();
		const { result, rerender } = renderHook(
			({ onChange }) =>
				useOTPInputChangeHandler({
					isControlled: false,
					setInternalValue: vi.fn(),
					length: 6,
					onChange,
				}),
			{
				initialProps: { onChange: onChange1 },
			}
		);

		act(() => {
			result.current('123');
		});
		expect(onChange1).toHaveBeenCalledWith('123');

		rerender({ onChange: onChange2 });
		act(() => {
			result.current('456');
		});
		expect(onChange2).toHaveBeenCalledWith('456');
		expect(onChange1).toHaveBeenCalledTimes(1);
	});
});
