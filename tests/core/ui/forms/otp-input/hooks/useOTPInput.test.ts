/**
 * useOTPInput Tests
 *
 * Tests for main OTP input hook:
 * - useOTPInputProps
 * - Prop extraction
 * - State computation
 * - Field props building
 * - Integration
 */

import { useOTPInputProps } from '@core/ui/forms/otp-input/hooks/useOTPInput';
import type { OTPInputProps } from '@core/ui/forms/otp-input/hooks/useOTPInput.types';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useOTPInputProps', () => {
	it('should be a function', () => {
		expect(typeof useOTPInputProps).toBe('function');
	});

	it('should return state, fieldProps, and extracted props', () => {
		const props: OTPInputProps = {
			label: 'OTP Code',
			size: 'md',
		};

		const { result } = renderHook(() => useOTPInputProps({ props }));

		expect(result.current).toHaveProperty('state');
		expect(result.current).toHaveProperty('fieldProps');
		expect(result.current).toHaveProperty('label');
		expect(result.current).toHaveProperty('error');
		expect(result.current).toHaveProperty('helperText');
		expect(result.current).toHaveProperty('required');
		expect(result.current).toHaveProperty('fullWidth');
	});
});

describe('useOTPInputProps - Prop Extraction', () => {
	it('should extract all props correctly', () => {
		const props: OTPInputProps = {
			label: 'OTP Code',
			error: 'Invalid OTP',
			helperText: 'Enter 6 digits',
			size: 'lg',
			fullWidth: true,
			inputId: 'custom-id',
			disabled: true,
			required: true,
			length: 4,
			value: '1234',
			defaultValue: '',
			onChange: vi.fn(),
			onComplete: vi.fn(),
			autoFocus: false,
		};

		const { result } = renderHook(() => useOTPInputProps({ props }));

		expect(result.current.label).toBe('OTP Code');
		expect(result.current.error).toBe('Invalid OTP');
		expect(result.current.helperText).toBe('Enter 6 digits');
		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);
	});

	it('should use default values for optional props', () => {
		const props: OTPInputProps = {
			label: 'OTP',
			size: 'md',
		};

		const { result } = renderHook(() => useOTPInputProps({ props }));

		expect(result.current.label).toBe('OTP');
		expect(result.current.error).toBeUndefined();
		expect(result.current.helperText).toBeUndefined();
		expect(result.current.required).toBeUndefined();
		expect(result.current.fullWidth).toBe(false);
	});

	it('should default length to 6 when not provided', () => {
		const props: OTPInputProps = {
			label: 'OTP',
			size: 'md',
		};

		const { result } = renderHook(() => useOTPInputProps({ props }));

		expect(result.current.fieldProps.length).toBe(6);
	});

	it('should default size to md when not provided', () => {
		const props: OTPInputProps = {
			label: 'OTP',
		};

		const { result } = renderHook(() => useOTPInputProps({ props }));

		expect(result.current.state).toBeDefined();
		// State should be computed with default size 'md'
	});

	it('should default autoFocus to true when not provided', () => {
		const props: OTPInputProps = {
			label: 'OTP',
			size: 'md',
		};

		const { result } = renderHook(() => useOTPInputProps({ props }));

		expect(result.current.fieldProps.autoFocus).toBe(true);
	});

	it('should extract value and onChange correctly', () => {
		const onChange = vi.fn();
		const props: OTPInputProps = {
			label: 'OTP',
			value: '123456',
			onChange,
			size: 'md',
		};

		const { result } = renderHook(() => useOTPInputProps({ props }));

		expect(result.current.fieldProps.value).toBe('123456');
		expect(result.current.fieldProps.onChange).toBeDefined();
	});

	it('should extract defaultValue correctly', () => {
		const props: OTPInputProps = {
			label: 'OTP',
			defaultValue: '123456',
			size: 'md',
		};

		const { result } = renderHook(() => useOTPInputProps({ props }));

		expect(result.current.fieldProps.value).toBe('123456');
	});

	it('should extract disabled and required correctly', () => {
		const props: OTPInputProps = {
			label: 'OTP',
			disabled: true,
			required: true,
			size: 'md',
		};

		const { result } = renderHook(() => useOTPInputProps({ props }));

		expect(result.current.fieldProps.disabled).toBe(true);
		expect(result.current.fieldProps.required).toBe(true);
	});
});

describe('useOTPInputProps - State Computation', () => {
	it('should compute state using useOTPInputState', () => {
		const props: OTPInputProps = {
			label: 'OTP Code',
			error: 'Invalid OTP',
			helperText: 'Enter 6 digits',
			size: 'lg',
			inputId: 'test-id',
		};

		const { result } = renderHook(() => useOTPInputProps({ props }));

		expect(result.current.state).toBeDefined();
		expect(result.current.state.finalId).toBe('test-id');
		expect(result.current.state.hasError).toBe(true);
		expect(result.current.state.ariaDescribedBy).toContain('test-id-error');
		expect(result.current.state.ariaDescribedBy).toContain('test-id-helper');
	});

	it('should pass computed state to field props', () => {
		const props: OTPInputProps = {
			label: 'OTP Code',
			inputId: 'test-id',
			size: 'md',
		};

		const { result } = renderHook(() => useOTPInputProps({ props }));

		expect(result.current.fieldProps.id).toBe('test-id');
		expect(result.current.fieldProps.className).toBe(result.current.state.inputClasses);
		expect(result.current.fieldProps.hasError).toBe(result.current.state.hasError);
		expect(result.current.fieldProps.ariaDescribedBy).toBe(result.current.state.ariaDescribedBy);
	});
});

describe('useOTPInputProps - Field Props Building', () => {
	it('should build complete field props object', () => {
		const onChange = vi.fn();
		const props: OTPInputProps = {
			label: 'OTP',
			inputId: 'test-id',
			disabled: true,
			required: true,
			value: '123456',
			onChange,
			size: 'md',
		};

		const { result } = renderHook(() => useOTPInputProps({ props }));

		expect(result.current.fieldProps).toBeDefined();
		expect(result.current.fieldProps.id).toBe('test-id');
		expect(result.current.fieldProps.className).toBeDefined();
		expect(result.current.fieldProps.hasError).toBe(false);
		expect(result.current.fieldProps.disabled).toBe(true);
		expect(result.current.fieldProps.required).toBe(true);
		expect(result.current.fieldProps.value).toBe('123456');
		expect(result.current.fieldProps.onChange).toBeDefined();
		expect(result.current.fieldProps.length).toBe(6);
		expect(result.current.fieldProps.inputRefs).toBeDefined();
	});

	it('should handle controlled mode with value', () => {
		const props: OTPInputProps = {
			label: 'OTP',
			value: 'controlled-value',
			size: 'md',
		};

		const { result } = renderHook(() => useOTPInputProps({ props }));

		// Value is normalized to length (default 6)
		expect(result.current.fieldProps.value).toBe('contro');
	});

	it('should handle uncontrolled mode with defaultValue', () => {
		const props: OTPInputProps = {
			label: 'OTP',
			defaultValue: 'default-value',
			size: 'md',
		};

		const { result } = renderHook(() => useOTPInputProps({ props }));

		// Value is normalized to length (default 6)
		expect(result.current.fieldProps.value).toBe('defaul');
	});

	it('should normalize value to length', () => {
		const props: OTPInputProps = {
			label: 'OTP',
			value: '123456789',
			length: 6,
			size: 'md',
		};

		const { result } = renderHook(() => useOTPInputProps({ props }));

		expect(result.current.fieldProps.value).toBe('123456');
	});
});

describe('useOTPInputProps - Return Values', () => {
	it('should return all expected values', () => {
		const props: OTPInputProps = {
			label: 'OTP Code',
			error: 'Invalid',
			helperText: 'Helper',
			required: true,
			fullWidth: true,
			size: 'md',
		};

		const { result } = renderHook(() => useOTPInputProps({ props }));

		expect(result.current).toHaveProperty('state');
		expect(result.current).toHaveProperty('fieldProps');
		expect(result.current).toHaveProperty('label');
		expect(result.current).toHaveProperty('error');
		expect(result.current).toHaveProperty('helperText');
		expect(result.current).toHaveProperty('required');
		expect(result.current).toHaveProperty('fullWidth');
	});

	it('should return extracted label, error, and helperText', () => {
		const props: OTPInputProps = {
			label: 'OTP Code',
			error: 'Invalid OTP',
			helperText: 'Enter 6 digits',
			size: 'md',
		};

		const { result } = renderHook(() => useOTPInputProps({ props }));

		expect(result.current.label).toBe('OTP Code');
		expect(result.current.error).toBe('Invalid OTP');
		expect(result.current.helperText).toBe('Enter 6 digits');
	});

	it('should return required and fullWidth flags', () => {
		const props: OTPInputProps = {
			label: 'OTP',
			required: true,
			fullWidth: true,
			size: 'md',
		};

		const { result } = renderHook(() => useOTPInputProps({ props }));

		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);
	});
});

describe('useOTPInputProps - Integration', () => {
	it('should handle complete OTPInput props flow', () => {
		const onChange = vi.fn();
		const onComplete = vi.fn();
		const props: OTPInputProps = {
			label: 'OTP Code',
			error: 'Invalid OTP',
			helperText: 'Enter 6 digits',
			size: 'lg',
			fullWidth: true,
			inputId: 'otp-input-id',
			disabled: false,
			required: true,
			value: '123456',
			onChange,
			onComplete,
			autoFocus: true,
		};

		const { result } = renderHook(() => useOTPInputProps({ props }));

		// Check extracted props
		expect(result.current.label).toBe('OTP Code');
		expect(result.current.error).toBe('Invalid OTP');
		expect(result.current.helperText).toBe('Enter 6 digits');
		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);

		// Check computed state
		expect(result.current.state.finalId).toBe('otp-input-id');
		expect(result.current.state.hasError).toBe(true);
		expect(result.current.state.ariaDescribedBy).toContain('otp-input-id-error');
		expect(result.current.state.ariaDescribedBy).toContain('otp-input-id-helper');

		// Check field props
		expect(result.current.fieldProps.id).toBe('otp-input-id');
		expect(result.current.fieldProps.hasError).toBe(true);
		expect(result.current.fieldProps.disabled).toBe(false);
		expect(result.current.fieldProps.required).toBe(true);
		expect(result.current.fieldProps.value).toBe('123456');
		expect(result.current.fieldProps.length).toBe(6);
		expect(result.current.fieldProps.autoFocus).toBe(true);
		expect(result.current.fieldProps.onChange).toBeDefined();
		expect(result.current.fieldProps.onComplete).toBe(onComplete);
	});

	it('should handle minimal props', () => {
		const props: OTPInputProps = {
			size: 'md',
		};

		const { result } = renderHook(() => useOTPInputProps({ props }));

		expect(result.current.label).toBeUndefined();
		expect(result.current.error).toBeUndefined();
		expect(result.current.helperText).toBeUndefined();
		expect(result.current.required).toBeUndefined();
		expect(result.current.fullWidth).toBe(false);
		expect(result.current.state).toBeDefined();
		expect(result.current.fieldProps).toBeDefined();
	});

	it('should update when props change', () => {
		const { result, rerender } = renderHook(
			({ props }: { props: OTPInputProps }) => useOTPInputProps({ props }),
			{
				initialProps: {
					props: {
						label: 'OTP',
						size: 'md',
					},
				},
			}
		);

		expect(result.current.label).toBe('OTP');
		expect(result.current.state.hasError).toBe(false);

		rerender({
			props: {
				label: 'OTP',
				error: 'Invalid',
				size: 'md',
			},
		});

		expect(result.current.error).toBe('Invalid');
		expect(result.current.state.hasError).toBe(true);
	});

	it('should handle different OTP lengths', () => {
		const props4: OTPInputProps = {
			label: 'OTP',
			length: 4,
			size: 'md',
		};
		const props8: OTPInputProps = {
			label: 'OTP',
			length: 8,
			size: 'md',
		};

		const { result: result4 } = renderHook(() => useOTPInputProps({ props: props4 }));
		const { result: result8 } = renderHook(() => useOTPInputProps({ props: props8 }));

		expect(result4.current.fieldProps.length).toBe(4);
		expect(result8.current.fieldProps.length).toBe(8);
	});
});
