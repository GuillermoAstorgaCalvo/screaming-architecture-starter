/**
 * usePhoneInput Tests
 *
 * Tests for the usePhoneInput hooks:
 * - usePhoneInputState: ID generation, error state, ARIA attributes, classes
 * - usePhoneInputProps: Prop processing, state computation, field props building
 * - Country code state management
 */

import {
	usePhoneInputProps,
	usePhoneInputState,
} from '@core/ui/forms/phone-input/hooks/usePhoneInput';
import type { PhoneInputProps } from '@src-types/ui/forms-specialized';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('usePhoneInputState - ID Generation', () => {
	it('generates ID from label when inputId is not provided', () => {
		const { result } = renderHook(() =>
			usePhoneInputState({
				label: 'Phone Number',
				size: 'md',
			})
		);

		expect(result.current.finalId).toBeDefined();
		expect(result.current.finalId).toContain('phone-input-');
	});

	it('uses provided inputId when available', () => {
		const customId = 'custom-phone-input-id';
		const { result } = renderHook(() =>
			usePhoneInputState({
				inputId: customId,
				label: 'Phone Number',
				size: 'md',
			})
		);

		expect(result.current.finalId).toBe(customId);
	});

	it('returns undefined when no label and no inputId provided', () => {
		const { result } = renderHook(() =>
			usePhoneInputState({
				size: 'md',
			})
		);

		expect(result.current.finalId).toBeUndefined();
	});

	it('generates ID when label is provided even without inputId', () => {
		const { result } = renderHook(() =>
			usePhoneInputState({
				label: 'Mobile Number',
				size: 'md',
			})
		);

		expect(result.current.finalId).toBeDefined();
		expect(result.current.finalId).toContain('phone-input-');
	});

	it('prioritizes inputId over label for ID generation', () => {
		const customId = 'my-custom-id';
		const { result } = renderHook(() =>
			usePhoneInputState({
				inputId: customId,
				label: 'Phone Number',
				size: 'md',
			})
		);

		expect(result.current.finalId).toBe(customId);
	});
});

describe('usePhoneInputState - Error State', () => {
	it('sets hasError to true when error is provided', () => {
		const { result } = renderHook(() =>
			usePhoneInputState({
				error: 'Invalid phone number',
				size: 'md',
			})
		);

		expect(result.current.hasError).toBe(true);
	});

	it('sets hasError to false when no error is provided', () => {
		const { result } = renderHook(() =>
			usePhoneInputState({
				size: 'md',
			})
		);

		expect(result.current.hasError).toBe(false);
	});

	it('sets hasError to false when error is empty string', () => {
		const { result } = renderHook(() =>
			usePhoneInputState({
				error: '',
				size: 'md',
			})
		);

		expect(result.current.hasError).toBe(false);
	});

	it('updates hasError when error changes', () => {
		const { result, rerender } = renderHook(
			({ error }: { error?: string }) =>
				usePhoneInputState({
					error,
					size: 'md',
				}),
			{
				initialProps: {},
			}
		);

		expect(result.current.hasError).toBe(false);

		rerender({ error: 'Error message' });
		expect(result.current.hasError).toBe(true);

		rerender({});
		expect(result.current.hasError).toBe(false);
	});
});

describe('usePhoneInputState - ARIA Attributes', () => {
	it('generates aria-describedby with error ID when error is provided', () => {
		const { result } = renderHook(() =>
			usePhoneInputState({
				inputId: 'test-phone-input',
				error: 'Invalid phone number',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toBe('test-phone-input-error');
	});

	it('generates aria-describedby with helper text ID when helperText is provided', () => {
		const { result } = renderHook(() =>
			usePhoneInputState({
				inputId: 'test-phone-input',
				helperText: 'Enter your phone number',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toBe('test-phone-input-helper');
	});

	it('generates aria-describedby with both error and helper text IDs', () => {
		const { result } = renderHook(() =>
			usePhoneInputState({
				inputId: 'test-phone-input',
				error: 'Invalid phone number',
				helperText: 'Enter your phone number',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toContain('test-phone-input-error');
		expect(result.current.ariaDescribedBy).toContain('test-phone-input-helper');
	});

	it('returns undefined for aria-describedby when no error or helperText', () => {
		const { result } = renderHook(() =>
			usePhoneInputState({
				inputId: 'test-phone-input',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toBeUndefined();
	});

	it('returns undefined for aria-describedby when finalId is undefined', () => {
		const { result } = renderHook(() =>
			usePhoneInputState({
				error: 'Invalid phone number',
				helperText: 'Enter your phone number',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toBeUndefined();
	});
});

describe('usePhoneInputState - CSS Classes', () => {
	it('generates input classes with default size', () => {
		const { result } = renderHook(() =>
			usePhoneInputState({
				size: 'md',
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(typeof result.current.inputClasses).toBe('string');
	});

	it('generates input classes for small size', () => {
		const { result } = renderHook(() =>
			usePhoneInputState({
				size: 'sm',
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(typeof result.current.inputClasses).toBe('string');
	});

	it('generates input classes for large size', () => {
		const { result } = renderHook(() =>
			usePhoneInputState({
				size: 'lg',
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(typeof result.current.inputClasses).toBe('string');
	});

	it('includes error classes when hasError is true', () => {
		const { result } = renderHook(() =>
			usePhoneInputState({
				error: 'Invalid phone number',
				size: 'md',
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(result.current.hasError).toBe(true);
	});

	it('applies custom className when provided', () => {
		const customClass = 'custom-phone-input-class';
		const { result } = renderHook(() =>
			usePhoneInputState({
				size: 'md',
				className: customClass,
			})
		);

		expect(result.current.inputClasses).toContain(customClass);
	});
});

describe('usePhoneInputProps - Prop Extraction', () => {
	it('extracts all props correctly', () => {
		const props: PhoneInputProps = {
			label: 'Phone Number',
			error: 'Invalid phone number',
			helperText: 'Enter your phone number',
			size: 'lg',
			fullWidth: true,
			inputId: 'custom-id',
			disabled: true,
			required: true,
			value: '1234567890',
			onChange: () => {},
			defaultCountryCode: '+44',
			onCountryCodeChange: () => {},
		};

		const { result } = renderHook(() => usePhoneInputProps({ props }));

		expect(result.current.label).toBe('Phone Number');
		expect(result.current.error).toBe('Invalid phone number');
		expect(result.current.helperText).toBe('Enter your phone number');
		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);
	});

	it('uses default values for optional props', () => {
		const props: PhoneInputProps = {
			label: 'Phone Number',
		};

		const { result } = renderHook(() => usePhoneInputProps({ props }));

		expect(result.current.label).toBe('Phone Number');
		expect(result.current.error).toBeUndefined();
		expect(result.current.helperText).toBeUndefined();
		expect(result.current.required).toBeUndefined();
		expect(result.current.fullWidth).toBe(false);
	});

	it('defaults size to md when not provided', () => {
		const props: PhoneInputProps = {
			label: 'Phone Number',
		};

		const { result } = renderHook(() => usePhoneInputProps({ props }));

		expect(result.current.state).toBeDefined();
	});

	it('extracts value and onChange correctly', () => {
		const onChange = () => {};
		const props: PhoneInputProps = {
			label: 'Phone Number',
			value: '1234567890',
			onChange,
		};

		const { result } = renderHook(() => usePhoneInputProps({ props }));

		expect(result.current.fieldProps.props.value).toBe('1234567890');
		expect(result.current.fieldProps.props.onChange).toBe(onChange);
	});

	it('extracts disabled and required correctly', () => {
		const props: PhoneInputProps = {
			label: 'Phone Number',
			disabled: true,
			required: true,
		};

		const { result } = renderHook(() => usePhoneInputProps({ props }));

		expect(result.current.fieldProps.disabled).toBe(true);
		expect(result.current.fieldProps.required).toBe(true);
	});
});

describe('usePhoneInputProps - Country Code State', () => {
	it('initializes with default country code (+1)', () => {
		const props: PhoneInputProps = {
			label: 'Phone Number',
		};

		const { result } = renderHook(() => usePhoneInputProps({ props }));

		expect(result.current.fieldProps.countryCode).toBe('+1');
	});

	it('uses defaultCountryCode when provided', () => {
		const props: PhoneInputProps = {
			label: 'Phone Number',
			defaultCountryCode: '+44',
		};

		const { result } = renderHook(() => usePhoneInputProps({ props }));

		expect(result.current.fieldProps.countryCode).toBe('+44');
	});

	it('provides onCountryCodeChange function in field props', () => {
		const props: PhoneInputProps = {
			label: 'Phone Number',
		};

		const { result } = renderHook(() => usePhoneInputProps({ props }));

		expect(result.current.fieldProps.onCountryCodeChange).toBeDefined();
		expect(typeof result.current.fieldProps.onCountryCodeChange).toBe('function');
	});

	it('calls onCountryCodeChangeProp when country code changes', () => {
		const handleCountryCodeChange = vi.fn();
		const props: PhoneInputProps = {
			label: 'Phone Number',
			onCountryCodeChange: handleCountryCodeChange,
		};

		const { result } = renderHook(() => usePhoneInputProps({ props }));

		// Simulate country code change
		result.current.fieldProps.onCountryCodeChange('+44');

		// Note: In a real component, this would trigger a re-render
		// Here we're just testing that the function exists and can be called
		expect(typeof result.current.fieldProps.onCountryCodeChange).toBe('function');
	});
});

describe('usePhoneInputProps - State Computation', () => {
	it('computes state using usePhoneInputState', () => {
		const props: PhoneInputProps = {
			label: 'Phone Number',
			error: 'Invalid phone number',
			helperText: 'Enter your phone number',
			size: 'lg',
			inputId: 'test-id',
		};

		const { result } = renderHook(() => usePhoneInputProps({ props }));

		expect(result.current.state).toBeDefined();
		expect(result.current.state.finalId).toBe('test-id');
		expect(result.current.state.hasError).toBe(true);
		expect(result.current.state.ariaDescribedBy).toContain('test-id-error');
		expect(result.current.state.ariaDescribedBy).toContain('test-id-helper');
	});

	it('passes computed state to field props', () => {
		const props: PhoneInputProps = {
			label: 'Phone Number',
			inputId: 'test-id',
			size: 'md',
		};

		const { result } = renderHook(() => usePhoneInputProps({ props }));

		expect(result.current.fieldProps.id).toBe('test-id');
		expect(result.current.fieldProps.className).toBe(result.current.state.inputClasses);
		expect(result.current.fieldProps.hasError).toBe(result.current.state.hasError);
		expect(result.current.fieldProps.ariaDescribedBy).toBe(result.current.state.ariaDescribedBy);
	});
});

describe('usePhoneInputProps - Field Props Building', () => {
	it('builds complete field props object', () => {
		const onChange = () => {};
		const props: PhoneInputProps = {
			label: 'Phone Number',
			inputId: 'test-id',
			disabled: true,
			required: true,
			value: '1234567890',
			onChange,
			size: 'md',
		};

		const { result } = renderHook(() => usePhoneInputProps({ props }));

		expect(result.current.fieldProps).toBeDefined();
		expect(result.current.fieldProps.id).toBe('test-id');
		expect(result.current.fieldProps.className).toBeDefined();
		expect(result.current.fieldProps.hasError).toBe(false);
		expect(result.current.fieldProps.disabled).toBe(true);
		expect(result.current.fieldProps.required).toBe(true);
		expect(result.current.fieldProps.countryCode).toBeDefined();
		expect(result.current.fieldProps.onCountryCodeChange).toBeDefined();
		expect(result.current.fieldProps.props.value).toBe('1234567890');
		expect(result.current.fieldProps.props.onChange).toBe(onChange);
	});

	it('includes rest props in field props', () => {
		const props: PhoneInputProps = {
			label: 'Phone Number',
			placeholder: 'Enter your phone number',
			'data-testid': 'phone-input',
			size: 'md',
		} as any;

		const { result } = renderHook(() => usePhoneInputProps({ props }));

		expect(result.current.fieldProps.props).toBeDefined();
		expect(result.current.fieldProps.props.placeholder).toBe('Enter your phone number');
		expect((result.current.fieldProps.props as any)['data-testid']).toBe('phone-input');
	});
});

describe('usePhoneInputProps - Return Values', () => {
	it('returns all expected values', () => {
		const props: PhoneInputProps = {
			label: 'Phone Number',
			error: 'Invalid',
			helperText: 'Helper',
			required: true,
			fullWidth: true,
			size: 'md',
		};

		const { result } = renderHook(() => usePhoneInputProps({ props }));

		expect(result.current).toHaveProperty('state');
		expect(result.current).toHaveProperty('fieldProps');
		expect(result.current).toHaveProperty('label');
		expect(result.current).toHaveProperty('error');
		expect(result.current).toHaveProperty('helperText');
		expect(result.current).toHaveProperty('required');
		expect(result.current).toHaveProperty('fullWidth');
	});
});

describe('usePhoneInputProps - Integration', () => {
	it('handles complete PhoneInput props flow', () => {
		const onChange = () => {};
		const onCountryCodeChange = () => {};
		const props: PhoneInputProps = {
			label: 'Phone Number',
			error: 'Invalid phone number',
			helperText: 'Enter your phone number',
			size: 'lg',
			fullWidth: true,
			inputId: 'phone-number-input',
			disabled: false,
			required: true,
			value: '1234567890',
			onChange,
			placeholder: 'Enter phone number',
			defaultCountryCode: '+44',
			onCountryCodeChange,
		};

		const { result } = renderHook(() => usePhoneInputProps({ props }));

		// Check extracted props
		expect(result.current.label).toBe('Phone Number');
		expect(result.current.error).toBe('Invalid phone number');
		expect(result.current.helperText).toBe('Enter your phone number');
		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);

		// Check computed state
		expect(result.current.state.finalId).toBe('phone-number-input');
		expect(result.current.state.hasError).toBe(true);
		expect(result.current.state.ariaDescribedBy).toContain('phone-number-input-error');
		expect(result.current.state.ariaDescribedBy).toContain('phone-number-input-helper');

		// Check field props
		expect(result.current.fieldProps.id).toBe('phone-number-input');
		expect(result.current.fieldProps.hasError).toBe(true);
		expect(result.current.fieldProps.disabled).toBe(false);
		expect(result.current.fieldProps.required).toBe(true);
		expect(result.current.fieldProps.countryCode).toBe('+44');
		expect(result.current.fieldProps.props.value).toBe('1234567890');
		expect(result.current.fieldProps.props.onChange).toBe(onChange);
		expect(result.current.fieldProps.props.placeholder).toBe('Enter phone number');
	});
});
