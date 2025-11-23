/**
 * useOTPInputFieldProps Tests
 *
 * Tests for field props hook:
 * - useOTPInputFieldProps
 * - Accessibility props building
 * - Styling props building
 * - Input state props building
 * - Value props building
 * - Focus props building
 * - Props combination
 */

import { useOTPInputFieldProps } from '@core/ui/forms/otp-input/hooks/useOTPInput.fieldProps';
import type { UseOTPInputStateReturn } from '@core/ui/forms/otp-input/types/OTPInputTypes';
import { renderHook } from '@testing-library/react';
import type React from 'react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

function createMockState(overrides?: Partial<UseOTPInputStateReturn>): UseOTPInputStateReturn {
	return {
		finalId: 'test-otp-input',
		hasError: false,
		ariaDescribedBy: undefined,
		inputClasses: 'test-class',
		...overrides,
	};
}

describe('useOTPInputFieldProps', () => {
	it('should be a function', () => {
		expect(typeof useOTPInputFieldProps).toBe('function');
	});

	it('should return OTPInputFieldProps object', () => {
		const state = createMockState();
		const inputRefs = createRef<(HTMLInputElement | null)[]>() as React.RefObject<
			(HTMLInputElement | null)[]
		>;

		const { result } = renderHook(() =>
			useOTPInputFieldProps({
				state,
				disabled: false,
				required: false,
				length: 6,
				normalizedValue: '',
				handleChange: () => {},
				onComplete: undefined,
				autoFocus: false,
				inputRefs,
			})
		);

		expect(result.current).toHaveProperty('id');
		expect(result.current).toHaveProperty('className');
		expect(result.current).toHaveProperty('hasError');
		expect(result.current).toHaveProperty('ariaDescribedBy');
		expect(result.current).toHaveProperty('disabled');
		expect(result.current).toHaveProperty('required');
		expect(result.current).toHaveProperty('length');
		expect(result.current).toHaveProperty('value');
		expect(result.current).toHaveProperty('onChange');
		expect(result.current).toHaveProperty('onComplete');
		expect(result.current).toHaveProperty('autoFocus');
		expect(result.current).toHaveProperty('inputRefs');
	});
});

describe('useOTPInputFieldProps - Accessibility Props', () => {
	it('should include finalId from state', () => {
		const state = createMockState({ finalId: 'custom-id' });
		const inputRefs = createRef<(HTMLInputElement | null)[]>() as React.RefObject<
			(HTMLInputElement | null)[]
		>;

		const { result } = renderHook(() =>
			useOTPInputFieldProps({
				state,
				disabled: false,
				required: false,
				length: 6,
				normalizedValue: '',
				handleChange: () => {},
				inputRefs,
			})
		);

		expect(result.current.id).toBe('custom-id');
	});

	it('should include hasError from state', () => {
		const state = createMockState({ hasError: true });
		const inputRefs = createRef<(HTMLInputElement | null)[]>() as React.RefObject<
			(HTMLInputElement | null)[]
		>;

		const { result } = renderHook(() =>
			useOTPInputFieldProps({
				state,
				disabled: false,
				required: false,
				length: 6,
				normalizedValue: '',
				handleChange: () => {},
				inputRefs,
			})
		);

		expect(result.current.hasError).toBe(true);
	});

	it('should include ariaDescribedBy from state', () => {
		const state = createMockState({ ariaDescribedBy: 'test-id-error' });
		const inputRefs = createRef<(HTMLInputElement | null)[]>() as React.RefObject<
			(HTMLInputElement | null)[]
		>;

		const { result } = renderHook(() =>
			useOTPInputFieldProps({
				state,
				disabled: false,
				required: false,
				length: 6,
				normalizedValue: '',
				handleChange: () => {},
				inputRefs,
			})
		);

		expect(result.current.ariaDescribedBy).toBe('test-id-error');
	});
});

describe('useOTPInputFieldProps - Styling Props', () => {
	it('should include className from state', () => {
		const state = createMockState({ inputClasses: 'custom-input-class' });
		const inputRefs = createRef<(HTMLInputElement | null)[]>() as React.RefObject<
			(HTMLInputElement | null)[]
		>;

		const { result } = renderHook(() =>
			useOTPInputFieldProps({
				state,
				disabled: false,
				required: false,
				length: 6,
				normalizedValue: '',
				handleChange: () => {},
				inputRefs,
			})
		);

		expect(result.current.className).toBe('custom-input-class');
	});
});

describe('useOTPInputFieldProps - Input State Props', () => {
	it('should include disabled prop', () => {
		const state = createMockState();
		const inputRefs = createRef<(HTMLInputElement | null)[]>() as React.RefObject<
			(HTMLInputElement | null)[]
		>;

		const { result } = renderHook(() =>
			useOTPInputFieldProps({
				state,
				disabled: true,
				required: false,
				length: 6,
				normalizedValue: '',
				handleChange: () => {},
				inputRefs,
			})
		);

		expect(result.current.disabled).toBe(true);
	});

	it('should include required prop', () => {
		const state = createMockState();
		const inputRefs = createRef<(HTMLInputElement | null)[]>() as React.RefObject<
			(HTMLInputElement | null)[]
		>;

		const { result } = renderHook(() =>
			useOTPInputFieldProps({
				state,
				disabled: false,
				required: true,
				length: 6,
				normalizedValue: '',
				handleChange: () => {},
				inputRefs,
			})
		);

		expect(result.current.required).toBe(true);
	});

	it('should include length prop', () => {
		const state = createMockState();
		const inputRefs = createRef<(HTMLInputElement | null)[]>() as React.RefObject<
			(HTMLInputElement | null)[]
		>;

		const { result } = renderHook(() =>
			useOTPInputFieldProps({
				state,
				disabled: false,
				required: false,
				length: 4,
				normalizedValue: '',
				handleChange: () => {},
				inputRefs,
			})
		);

		expect(result.current.length).toBe(4);
	});

	it('should handle undefined disabled and required', () => {
		const state = createMockState();
		const inputRefs = createRef<(HTMLInputElement | null)[]>() as React.RefObject<
			(HTMLInputElement | null)[]
		>;

		const { result } = renderHook(() =>
			useOTPInputFieldProps({
				state,
				disabled: undefined,
				required: undefined,
				length: 6,
				normalizedValue: '',
				handleChange: () => {},
				inputRefs,
			})
		);

		expect(result.current.disabled).toBeUndefined();
		expect(result.current.required).toBeUndefined();
	});
});

describe('useOTPInputFieldProps - Value Props', () => {
	it('should include normalizedValue as value', () => {
		const state = createMockState();
		const inputRefs = createRef<(HTMLInputElement | null)[]>() as React.RefObject<
			(HTMLInputElement | null)[]
		>;

		const { result } = renderHook(() =>
			useOTPInputFieldProps({
				state,
				disabled: false,
				required: false,
				length: 6,
				normalizedValue: '123456',
				handleChange: () => {},
				inputRefs,
			})
		);

		expect(result.current.value).toBe('123456');
	});

	it('should include handleChange as onChange', () => {
		const state = createMockState();
		const inputRefs = createRef<(HTMLInputElement | null)[]>() as React.RefObject<
			(HTMLInputElement | null)[]
		>;
		const handleChange = () => {};

		const { result } = renderHook(() =>
			useOTPInputFieldProps({
				state,
				disabled: false,
				required: false,
				length: 6,
				normalizedValue: '',
				handleChange,
				inputRefs,
			})
		);

		expect(result.current.onChange).toBe(handleChange);
	});

	it('should include onComplete when provided', () => {
		const state = createMockState();
		const inputRefs = createRef<(HTMLInputElement | null)[]>() as React.RefObject<
			(HTMLInputElement | null)[]
		>;
		const onComplete = () => {};

		const { result } = renderHook(() =>
			useOTPInputFieldProps({
				state,
				disabled: false,
				required: false,
				length: 6,
				normalizedValue: '',
				handleChange: () => {},
				onComplete,
				inputRefs,
			})
		);

		expect(result.current.onComplete).toBe(onComplete);
	});

	it('should handle undefined onComplete', () => {
		const state = createMockState();
		const inputRefs = createRef<(HTMLInputElement | null)[]>() as React.RefObject<
			(HTMLInputElement | null)[]
		>;

		const { result } = renderHook(() =>
			useOTPInputFieldProps({
				state,
				disabled: false,
				required: false,
				length: 6,
				normalizedValue: '',
				handleChange: () => {},
				onComplete: undefined,
				inputRefs,
			})
		);

		expect(result.current.onComplete).toBeUndefined();
	});
});

describe('useOTPInputFieldProps - Focus Props', () => {
	it('should include autoFocus prop', () => {
		const state = createMockState();
		const inputRefs = createRef<(HTMLInputElement | null)[]>() as React.RefObject<
			(HTMLInputElement | null)[]
		>;

		const { result } = renderHook(() =>
			useOTPInputFieldProps({
				state,
				disabled: false,
				required: false,
				length: 6,
				normalizedValue: '',
				handleChange: () => {},
				autoFocus: true,
				inputRefs,
			})
		);

		expect(result.current.autoFocus).toBe(true);
	});

	it('should include inputRefs prop', () => {
		const state = createMockState();
		const inputRefs = createRef<(HTMLInputElement | null)[]>() as React.RefObject<
			(HTMLInputElement | null)[]
		>;

		const { result } = renderHook(() =>
			useOTPInputFieldProps({
				state,
				disabled: false,
				required: false,
				length: 6,
				normalizedValue: '',
				handleChange: () => {},
				inputRefs,
			})
		);

		expect(result.current.inputRefs).toBe(inputRefs);
	});

	it('should handle undefined autoFocus', () => {
		const state = createMockState();
		const inputRefs = createRef<(HTMLInputElement | null)[]>() as React.RefObject<
			(HTMLInputElement | null)[]
		>;

		const { result } = renderHook(() =>
			useOTPInputFieldProps({
				state,
				disabled: false,
				required: false,
				length: 6,
				normalizedValue: '',
				handleChange: () => {},
				autoFocus: undefined,
				inputRefs,
			})
		);

		expect(result.current.autoFocus).toBeUndefined();
	});
});

describe('useOTPInputFieldProps - Memoization', () => {
	it('should memoize result when dependencies do not change', () => {
		const state = createMockState();
		const inputRefs = createRef<(HTMLInputElement | null)[]>() as React.RefObject<
			(HTMLInputElement | null)[]
		>;
		const handleChange = () => {};

		const { result, rerender } = renderHook(() =>
			useOTPInputFieldProps({
				state,
				disabled: false,
				required: false,
				length: 6,
				normalizedValue: '',
				handleChange,
				inputRefs,
			})
		);

		const firstResult = result.current;

		rerender();

		// Should return same reference if dependencies haven't changed
		expect(result.current).toBe(firstResult);
	});

	it('should update when state changes', () => {
		const state1 = createMockState({ hasError: false });
		const state2 = createMockState({ hasError: true });
		const inputRefs = createRef<(HTMLInputElement | null)[]>() as React.RefObject<
			(HTMLInputElement | null)[]
		>;

		const { result, rerender } = renderHook(
			({ state }) =>
				useOTPInputFieldProps({
					state,
					disabled: false,
					required: false,
					length: 6,
					normalizedValue: '',
					handleChange: () => {},
					inputRefs,
				}),
			{
				initialProps: { state: state1 },
			}
		);

		expect(result.current.hasError).toBe(false);

		rerender({ state: state2 });

		expect(result.current.hasError).toBe(true);
	});

	it('should update when normalizedValue changes', () => {
		const state = createMockState();
		const inputRefs = createRef<(HTMLInputElement | null)[]>() as React.RefObject<
			(HTMLInputElement | null)[]
		>;

		const { result, rerender } = renderHook(
			({ value }) =>
				useOTPInputFieldProps({
					state,
					disabled: false,
					required: false,
					length: 6,
					normalizedValue: value,
					handleChange: () => {},
					inputRefs,
				}),
			{
				initialProps: { value: '123' },
			}
		);

		expect(result.current.value).toBe('123');

		rerender({ value: '456' });

		expect(result.current.value).toBe('456');
	});
});

describe('useOTPInputFieldProps - Integration', () => {
	it('should combine all props correctly', () => {
		const state = createMockState({
			finalId: 'test-id',
			hasError: true,
			ariaDescribedBy: 'test-id-error',
			inputClasses: 'custom-class',
		});
		const inputRefs = createRef<(HTMLInputElement | null)[]>() as React.RefObject<
			(HTMLInputElement | null)[]
		>;
		const handleChange = () => {};
		const onComplete = () => {};

		const { result } = renderHook(() =>
			useOTPInputFieldProps({
				state,
				disabled: true,
				required: true,
				length: 4,
				normalizedValue: '1234',
				handleChange,
				onComplete,
				autoFocus: true,
				inputRefs,
			})
		);

		expect(result.current.id).toBe('test-id');
		expect(result.current.className).toBe('custom-class');
		expect(result.current.hasError).toBe(true);
		expect(result.current.ariaDescribedBy).toBe('test-id-error');
		expect(result.current.disabled).toBe(true);
		expect(result.current.required).toBe(true);
		expect(result.current.length).toBe(4);
		expect(result.current.value).toBe('1234');
		expect(result.current.onChange).toBe(handleChange);
		expect(result.current.onComplete).toBe(onComplete);
		expect(result.current.autoFocus).toBe(true);
		expect(result.current.inputRefs).toBe(inputRefs);
	});
});
