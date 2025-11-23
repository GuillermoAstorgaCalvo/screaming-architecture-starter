/**
 * useEmailInput Tests
 *
 * Tests for the useEmailInput hooks:
 * - useEmailInputState: ID generation, error state, ARIA attributes, classes
 * - useEmailInputProps: Prop processing, state computation, field props building
 */

import {
	useEmailInputProps,
	useEmailInputState,
} from '@core/ui/forms/email-input/hooks/useEmailInput';
import type { EmailInputProps } from '@src-types/ui/forms-specialized';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useEmailInputState - ID Generation', () => {
	it('generates ID from label when inputId is not provided', () => {
		const { result } = renderHook(() =>
			useEmailInputState({
				label: 'Email Address',
				size: 'md',
			})
		);

		expect(result.current.finalId).toBeDefined();
		expect(result.current.finalId).toContain('email-input-');
	});

	it('uses provided inputId when available', () => {
		const customId = 'custom-email-input-id';
		const { result } = renderHook(() =>
			useEmailInputState({
				inputId: customId,
				label: 'Email Address',
				size: 'md',
			})
		);

		expect(result.current.finalId).toBe(customId);
	});

	it('returns undefined when no label and no inputId provided', () => {
		const { result } = renderHook(() =>
			useEmailInputState({
				size: 'md',
			})
		);

		expect(result.current.finalId).toBeUndefined();
	});

	it('generates ID when label is provided even without inputId', () => {
		const { result } = renderHook(() =>
			useEmailInputState({
				label: 'Work Email',
				size: 'md',
			})
		);

		expect(result.current.finalId).toBeDefined();
		expect(result.current.finalId).toContain('email-input-');
	});

	it('prioritizes inputId over label for ID generation', () => {
		const customId = 'my-custom-id';
		const { result } = renderHook(() =>
			useEmailInputState({
				inputId: customId,
				label: 'Email Address',
				size: 'md',
			})
		);

		expect(result.current.finalId).toBe(customId);
	});
});

describe('useEmailInputState - Error State', () => {
	it('sets hasError to true when error is provided', () => {
		const { result } = renderHook(() =>
			useEmailInputState({
				error: 'Invalid email',
				size: 'md',
			})
		);

		expect(result.current.hasError).toBe(true);
	});

	it('sets hasError to false when no error is provided', () => {
		const { result } = renderHook(() =>
			useEmailInputState({
				size: 'md',
			})
		);

		expect(result.current.hasError).toBe(false);
	});

	it('sets hasError to false when error is empty string', () => {
		const { result } = renderHook(() =>
			useEmailInputState({
				error: '',
				size: 'md',
			})
		);

		expect(result.current.hasError).toBe(false);
	});

	it('updates hasError when error changes', () => {
		const { result, rerender } = renderHook(
			({ error }: { error?: string }) =>
				useEmailInputState({
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

describe('useEmailInputState - ARIA Attributes', () => {
	it('generates aria-describedby with error ID when error is provided', () => {
		const { result } = renderHook(() =>
			useEmailInputState({
				inputId: 'test-email-input',
				error: 'Invalid email',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toBe('test-email-input-error');
	});

	it('generates aria-describedby with helper text ID when helperText is provided', () => {
		const { result } = renderHook(() =>
			useEmailInputState({
				inputId: 'test-email-input',
				helperText: 'Enter your email',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toBe('test-email-input-helper');
	});

	it('generates aria-describedby with both error and helper text IDs', () => {
		const { result } = renderHook(() =>
			useEmailInputState({
				inputId: 'test-email-input',
				error: 'Invalid email',
				helperText: 'Enter your email',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toContain('test-email-input-error');
		expect(result.current.ariaDescribedBy).toContain('test-email-input-helper');
	});

	it('returns undefined for aria-describedby when no error or helperText', () => {
		const { result } = renderHook(() =>
			useEmailInputState({
				inputId: 'test-email-input',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toBeUndefined();
	});

	it('returns undefined for aria-describedby when finalId is undefined', () => {
		const { result } = renderHook(() =>
			useEmailInputState({
				error: 'Invalid email',
				helperText: 'Enter your email',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toBeUndefined();
	});

	it('updates aria-describedby when error changes', () => {
		const { result, rerender } = renderHook(
			({ error }: { error?: string }) =>
				useEmailInputState({
					inputId: 'test-email-input',
					error,
					size: 'md',
				}),
			{
				initialProps: {},
			}
		);

		expect(result.current.ariaDescribedBy).toBeUndefined();

		rerender({ error: 'Error message' });
		expect(result.current.ariaDescribedBy).toBe('test-email-input-error');

		rerender({});
		expect(result.current.ariaDescribedBy).toBeUndefined();
	});
});

describe('useEmailInputState - CSS Classes', () => {
	it('generates input classes with default size', () => {
		const { result } = renderHook(() =>
			useEmailInputState({
				size: 'md',
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(typeof result.current.inputClasses).toBe('string');
	});

	it('generates input classes for small size', () => {
		const { result } = renderHook(() =>
			useEmailInputState({
				size: 'sm',
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(typeof result.current.inputClasses).toBe('string');
	});

	it('generates input classes for large size', () => {
		const { result } = renderHook(() =>
			useEmailInputState({
				size: 'lg',
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(typeof result.current.inputClasses).toBe('string');
	});

	it('includes error classes when hasError is true', () => {
		const { result } = renderHook(() =>
			useEmailInputState({
				error: 'Invalid email',
				size: 'md',
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(result.current.hasError).toBe(true);
	});

	it('applies custom className when provided', () => {
		const customClass = 'custom-email-input-class';
		const { result } = renderHook(() =>
			useEmailInputState({
				size: 'md',
				className: customClass,
			})
		);

		expect(result.current.inputClasses).toContain(customClass);
	});

	it('combines custom className with default classes', () => {
		const customClass = 'my-custom-class';
		const { result } = renderHook(() =>
			useEmailInputState({
				size: 'md',
				className: customClass,
			})
		);

		expect(result.current.inputClasses).toContain(customClass);
		expect(result.current.inputClasses.length).toBeGreaterThan(customClass.length);
	});
});

describe('useEmailInputState - Integration', () => {
	it('handles all options together', () => {
		const { result } = renderHook(() =>
			useEmailInputState({
				inputId: 'test-id',
				label: 'Email Address',
				error: 'Invalid email',
				helperText: 'Enter your email',
				size: 'lg',
				className: 'custom-class',
			})
		);

		expect(result.current.finalId).toBe('test-id');
		expect(result.current.hasError).toBe(true);
		expect(result.current.ariaDescribedBy).toContain('test-id-error');
		expect(result.current.ariaDescribedBy).toContain('test-id-helper');
		expect(result.current.inputClasses).toContain('custom-class');
	});

	it('maintains state consistency across rerenders', () => {
		const { result, rerender } = renderHook(
			({ size }: { size: 'sm' | 'md' | 'lg' }) =>
				useEmailInputState({
					inputId: 'test-id',
					label: 'Email Address',
					size,
				}),
			{
				initialProps: { size: 'md' },
			}
		);

		const initialId = result.current.finalId;
		const initialClasses = result.current.inputClasses;

		rerender({ size: 'lg' });

		expect(result.current.finalId).toBe(initialId);
		expect(result.current.inputClasses).not.toBe(initialClasses);
	});
});

describe('useEmailInputProps - Prop Extraction', () => {
	it('extracts all props correctly', () => {
		const props: EmailInputProps = {
			label: 'Email Address',
			error: 'Invalid email',
			helperText: 'Enter your email',
			size: 'lg',
			fullWidth: true,
			inputId: 'custom-id',
			disabled: true,
			required: true,
			value: 'test@example.com',
			onChange: () => {},
		};

		const { result } = renderHook(() => useEmailInputProps({ props }));

		expect(result.current.label).toBe('Email Address');
		expect(result.current.error).toBe('Invalid email');
		expect(result.current.helperText).toBe('Enter your email');
		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);
	});

	it('uses default values for optional props', () => {
		const props: EmailInputProps = {
			label: 'Email',
		};

		const { result } = renderHook(() => useEmailInputProps({ props }));

		expect(result.current.label).toBe('Email');
		expect(result.current.error).toBeUndefined();
		expect(result.current.helperText).toBeUndefined();
		expect(result.current.required).toBeUndefined();
		expect(result.current.fullWidth).toBe(false);
	});

	it('defaults size to md when not provided', () => {
		const props: EmailInputProps = {
			label: 'Email',
		};

		const { result } = renderHook(() => useEmailInputProps({ props }));

		expect(result.current.state).toBeDefined();
		// State should be computed with default size 'md'
	});

	it('extracts value and onChange correctly', () => {
		const onChange = () => {};
		const props: EmailInputProps = {
			label: 'Email',
			value: 'test@example.com',
			onChange,
		};

		const { result } = renderHook(() => useEmailInputProps({ props }));

		expect(result.current.fieldProps.props.value).toBe('test@example.com');
		expect(result.current.fieldProps.props.onChange).toBe(onChange);
	});

	it('extracts defaultValue correctly', () => {
		const props: EmailInputProps = {
			label: 'Email',
			defaultValue: 'default@example.com',
		};

		const { result } = renderHook(() => useEmailInputProps({ props }));

		expect(result.current.fieldProps.props.defaultValue).toBe('default@example.com');
	});

	it('extracts disabled and required correctly', () => {
		const props: EmailInputProps = {
			label: 'Email',
			disabled: true,
			required: true,
		};

		const { result } = renderHook(() => useEmailInputProps({ props }));

		expect(result.current.fieldProps.disabled).toBe(true);
		expect(result.current.fieldProps.required).toBe(true);
	});
});

describe('useEmailInputProps - State Computation', () => {
	it('computes state using useEmailInputState', () => {
		const props: EmailInputProps = {
			label: 'Email Address',
			error: 'Invalid email',
			helperText: 'Enter your email',
			size: 'lg',
			inputId: 'test-id',
		};

		const { result } = renderHook(() => useEmailInputProps({ props }));

		expect(result.current.state).toBeDefined();
		expect(result.current.state.finalId).toBe('test-id');
		expect(result.current.state.hasError).toBe(true);
		expect(result.current.state.ariaDescribedBy).toContain('test-id-error');
		expect(result.current.state.ariaDescribedBy).toContain('test-id-helper');
	});

	it('passes computed state to field props', () => {
		const props: EmailInputProps = {
			label: 'Email Address',
			inputId: 'test-id',
			size: 'md',
		};

		const { result } = renderHook(() => useEmailInputProps({ props }));

		expect(result.current.fieldProps.id).toBe('test-id');
		expect(result.current.fieldProps.className).toBe(result.current.state.inputClasses);
		expect(result.current.fieldProps.hasError).toBe(result.current.state.hasError);
		expect(result.current.fieldProps.ariaDescribedBy).toBe(result.current.state.ariaDescribedBy);
	});
});

describe('useEmailInputProps - Field Props Building', () => {
	it('builds complete field props object', () => {
		const onChange = () => {};
		const props: EmailInputProps = {
			label: 'Email',
			inputId: 'test-id',
			disabled: true,
			required: true,
			value: 'test@example.com',
			onChange,
			size: 'md',
		};

		const { result } = renderHook(() => useEmailInputProps({ props }));

		expect(result.current.fieldProps).toBeDefined();
		expect(result.current.fieldProps.id).toBe('test-id');
		expect(result.current.fieldProps.className).toBeDefined();
		expect(result.current.fieldProps.hasError).toBe(false);
		expect(result.current.fieldProps.disabled).toBe(true);
		expect(result.current.fieldProps.required).toBe(true);
		expect(result.current.fieldProps.props.value).toBe('test@example.com');
		expect(result.current.fieldProps.props.onChange).toBe(onChange);
		expect(result.current.fieldProps.props).toBeDefined();
	});

	it('includes rest props in field props', () => {
		const props: EmailInputProps = {
			label: 'Email',
			placeholder: 'Enter your email',
			'data-testid': 'email-input',
			size: 'md',
		} as any;

		const { result } = renderHook(() => useEmailInputProps({ props }));

		expect(result.current.fieldProps.props).toBeDefined();
		expect(result.current.fieldProps.props.placeholder).toBe('Enter your email');
		expect((result.current.fieldProps.props as any)['data-testid']).toBe('email-input');
	});

	it('excludes controlled props from rest props', () => {
		const props: EmailInputProps = {
			label: 'Email',
			size: 'md',
			disabled: true,
			required: true,
			value: 'test@example.com',
		};

		const { result } = renderHook(() => useEmailInputProps({ props }));

		// These should not be in props.rest
		expect(result.current.fieldProps.props).not.toHaveProperty('size');
		expect(result.current.fieldProps.props).not.toHaveProperty('type');
		expect(result.current.fieldProps.props).not.toHaveProperty('id');
		expect(result.current.fieldProps.props).not.toHaveProperty('className');
		expect(result.current.fieldProps.props).not.toHaveProperty('disabled');
		expect(result.current.fieldProps.props).not.toHaveProperty('required');
		// value should be included in props for controlled inputs
		expect(result.current.fieldProps.props).toHaveProperty('value');
		expect(result.current.fieldProps.props.value).toBe('test@example.com');
	});

	it('handles uncontrolled mode with defaultValue', () => {
		const props: EmailInputProps = {
			label: 'Email',
			defaultValue: 'default@example.com',
			size: 'md',
		};

		const { result } = renderHook(() => useEmailInputProps({ props }));

		expect(result.current.fieldProps.props.defaultValue).toBe('default@example.com');
		expect(result.current.fieldProps.props.value).toBeUndefined();
	});

	it('handles controlled mode with value', () => {
		const props: EmailInputProps = {
			label: 'Email',
			value: 'controlled@example.com',
			size: 'md',
		};

		const { result } = renderHook(() => useEmailInputProps({ props }));

		expect(result.current.fieldProps.props.value).toBe('controlled@example.com');
		expect(result.current.fieldProps.props.defaultValue).toBeUndefined();
	});
});

describe('useEmailInputProps - Return Values', () => {
	it('returns all expected values', () => {
		const props: EmailInputProps = {
			label: 'Email Address',
			error: 'Invalid',
			helperText: 'Helper',
			required: true,
			fullWidth: true,
			size: 'md',
		};

		const { result } = renderHook(() => useEmailInputProps({ props }));

		expect(result.current).toHaveProperty('state');
		expect(result.current).toHaveProperty('fieldProps');
		expect(result.current).toHaveProperty('label');
		expect(result.current).toHaveProperty('error');
		expect(result.current).toHaveProperty('helperText');
		expect(result.current).toHaveProperty('required');
		expect(result.current).toHaveProperty('fullWidth');
	});

	it('returns extracted label, error, and helperText', () => {
		const props: EmailInputProps = {
			label: 'Email Address',
			error: 'Invalid email',
			helperText: 'Enter your email',
			size: 'md',
		};

		const { result } = renderHook(() => useEmailInputProps({ props }));

		expect(result.current.label).toBe('Email Address');
		expect(result.current.error).toBe('Invalid email');
		expect(result.current.helperText).toBe('Enter your email');
	});

	it('returns required and fullWidth flags', () => {
		const props: EmailInputProps = {
			label: 'Email',
			required: true,
			fullWidth: true,
			size: 'md',
		};

		const { result } = renderHook(() => useEmailInputProps({ props }));

		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);
	});
});

describe('useEmailInputProps - Integration', () => {
	it('handles complete EmailInput props flow', () => {
		const onChange = () => {};
		const props: EmailInputProps = {
			label: 'Email Address',
			error: 'Invalid email',
			helperText: 'Enter your email',
			size: 'lg',
			fullWidth: true,
			inputId: 'email-address-input',
			disabled: false,
			required: true,
			value: 'test@example.com',
			onChange,
			placeholder: 'Enter email',
		};

		const { result } = renderHook(() => useEmailInputProps({ props }));

		// Check extracted props
		expect(result.current.label).toBe('Email Address');
		expect(result.current.error).toBe('Invalid email');
		expect(result.current.helperText).toBe('Enter your email');
		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);

		// Check computed state
		expect(result.current.state.finalId).toBe('email-address-input');
		expect(result.current.state.hasError).toBe(true);
		expect(result.current.state.ariaDescribedBy).toContain('email-address-input-error');
		expect(result.current.state.ariaDescribedBy).toContain('email-address-input-helper');

		// Check field props
		expect(result.current.fieldProps.id).toBe('email-address-input');
		expect(result.current.fieldProps.hasError).toBe(true);
		expect(result.current.fieldProps.disabled).toBe(false);
		expect(result.current.fieldProps.required).toBe(true);
		expect(result.current.fieldProps.props.value).toBe('test@example.com');
		expect(result.current.fieldProps.props.onChange).toBe(onChange);
		expect(result.current.fieldProps.props.placeholder).toBe('Enter email');
	});

	it('handles minimal props', () => {
		const props: EmailInputProps = {
			size: 'md',
		};

		const { result } = renderHook(() => useEmailInputProps({ props }));

		expect(result.current.label).toBeUndefined();
		expect(result.current.error).toBeUndefined();
		expect(result.current.helperText).toBeUndefined();
		expect(result.current.required).toBeUndefined();
		expect(result.current.fullWidth).toBe(false);
		expect(result.current.state).toBeDefined();
		expect(result.current.fieldProps).toBeDefined();
	});

	it('updates when props change', () => {
		const { result, rerender } = renderHook(
			({ props }: { props: EmailInputProps }) => useEmailInputProps({ props }),
			{
				initialProps: {
					props: {
						label: 'Email',
						size: 'md',
					},
				},
			}
		);

		expect(result.current.label).toBe('Email');
		expect(result.current.state.hasError).toBe(false);

		rerender({
			props: {
				label: 'Email',
				error: 'Invalid',
				size: 'md',
			},
		});

		expect(result.current.error).toBe('Invalid');
		expect(result.current.state.hasError).toBe(true);
	});
});
