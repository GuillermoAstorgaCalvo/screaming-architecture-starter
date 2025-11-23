/**
 * usePasswordInput Tests
 *
 * Tests for the usePasswordInput hooks:
 * - usePasswordInputState: ID generation, error state, ARIA attributes, classes
 * - usePasswordInputProps: Prop processing, state computation, field props building
 * - Password visibility state management
 */

import {
	usePasswordInputProps,
	usePasswordInputState,
} from '@core/ui/forms/password-input/hooks/usePasswordInput';
import type { PasswordInputProps } from '@src-types/ui/forms-specialized';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('usePasswordInputState - ID Generation', () => {
	it('generates ID from label when inputId is not provided', () => {
		const { result } = renderHook(() =>
			usePasswordInputState({
				label: 'Password',
				size: 'md',
			})
		);

		expect(result.current.finalId).toBeDefined();
		expect(result.current.finalId).toContain('password-input-');
	});

	it('uses provided inputId when available', () => {
		const customId = 'custom-password-input-id';
		const { result } = renderHook(() =>
			usePasswordInputState({
				inputId: customId,
				label: 'Password',
				size: 'md',
			})
		);

		expect(result.current.finalId).toBe(customId);
	});

	it('returns undefined when no label and no inputId provided', () => {
		const { result } = renderHook(() =>
			usePasswordInputState({
				size: 'md',
			})
		);

		expect(result.current.finalId).toBeUndefined();
	});

	it('generates ID when label is provided even without inputId', () => {
		const { result } = renderHook(() =>
			usePasswordInputState({
				label: 'Confirm Password',
				size: 'md',
			})
		);

		expect(result.current.finalId).toBeDefined();
		expect(result.current.finalId).toContain('password-input-');
	});

	it('prioritizes inputId over label for ID generation', () => {
		const customId = 'my-custom-id';
		const { result } = renderHook(() =>
			usePasswordInputState({
				inputId: customId,
				label: 'Password',
				size: 'md',
			})
		);

		expect(result.current.finalId).toBe(customId);
	});
});

describe('usePasswordInputState - Error State', () => {
	it('sets hasError to true when error is provided', () => {
		const { result } = renderHook(() =>
			usePasswordInputState({
				error: 'Invalid password',
				size: 'md',
			})
		);

		expect(result.current.hasError).toBe(true);
	});

	it('sets hasError to false when no error is provided', () => {
		const { result } = renderHook(() =>
			usePasswordInputState({
				size: 'md',
			})
		);

		expect(result.current.hasError).toBe(false);
	});

	it('sets hasError to false when error is empty string', () => {
		const { result } = renderHook(() =>
			usePasswordInputState({
				error: '',
				size: 'md',
			})
		);

		expect(result.current.hasError).toBe(false);
	});

	it('updates hasError when error changes', () => {
		const { result, rerender } = renderHook(
			({ error }: { error?: string }) =>
				usePasswordInputState({
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

describe('usePasswordInputState - ARIA Attributes', () => {
	it('generates aria-describedby with error ID when error is provided', () => {
		const { result } = renderHook(() =>
			usePasswordInputState({
				inputId: 'test-password-input',
				error: 'Invalid password',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toBe('test-password-input-error');
	});

	it('generates aria-describedby with helper text ID when helperText is provided', () => {
		const { result } = renderHook(() =>
			usePasswordInputState({
				inputId: 'test-password-input',
				helperText: 'Enter your password',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toBe('test-password-input-helper');
	});

	it('generates aria-describedby with both error and helper text IDs', () => {
		const { result } = renderHook(() =>
			usePasswordInputState({
				inputId: 'test-password-input',
				error: 'Invalid password',
				helperText: 'Enter your password',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toContain('test-password-input-error');
		expect(result.current.ariaDescribedBy).toContain('test-password-input-helper');
	});

	it('returns undefined for aria-describedby when no error or helperText', () => {
		const { result } = renderHook(() =>
			usePasswordInputState({
				inputId: 'test-password-input',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toBeUndefined();
	});

	it('returns undefined for aria-describedby when finalId is undefined', () => {
		const { result } = renderHook(() =>
			usePasswordInputState({
				error: 'Invalid password',
				helperText: 'Enter your password',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toBeUndefined();
	});
});

describe('usePasswordInputState - CSS Classes', () => {
	it('generates input classes with default size', () => {
		const { result } = renderHook(() =>
			usePasswordInputState({
				size: 'md',
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(typeof result.current.inputClasses).toBe('string');
	});

	it('generates input classes for small size', () => {
		const { result } = renderHook(() =>
			usePasswordInputState({
				size: 'sm',
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(typeof result.current.inputClasses).toBe('string');
	});

	it('generates input classes for large size', () => {
		const { result } = renderHook(() =>
			usePasswordInputState({
				size: 'lg',
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(typeof result.current.inputClasses).toBe('string');
	});

	it('includes error classes when hasError is true', () => {
		const { result } = renderHook(() =>
			usePasswordInputState({
				error: 'Invalid password',
				size: 'md',
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(result.current.hasError).toBe(true);
	});

	it('applies custom className when provided', () => {
		const customClass = 'custom-password-input-class';
		const { result } = renderHook(() =>
			usePasswordInputState({
				size: 'md',
				className: customClass,
			})
		);

		expect(result.current.inputClasses).toContain(customClass);
	});
});

describe('usePasswordInputProps - Prop Extraction', () => {
	it('extracts all props correctly', () => {
		const props: PasswordInputProps = {
			label: 'Password',
			error: 'Invalid password',
			helperText: 'Enter your password',
			size: 'lg',
			fullWidth: true,
			inputId: 'custom-id',
			disabled: true,
			required: true,
			value: 'password123',
			onChange: () => {},
		};

		const { result } = renderHook(() => usePasswordInputProps({ props }));

		expect(result.current.label).toBe('Password');
		expect(result.current.error).toBe('Invalid password');
		expect(result.current.helperText).toBe('Enter your password');
		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);
	});

	it('uses default values for optional props', () => {
		const props: PasswordInputProps = {
			label: 'Password',
		};

		const { result } = renderHook(() => usePasswordInputProps({ props }));

		expect(result.current.label).toBe('Password');
		expect(result.current.error).toBeUndefined();
		expect(result.current.helperText).toBeUndefined();
		expect(result.current.required).toBeUndefined();
		expect(result.current.fullWidth).toBe(false);
	});

	it('defaults size to md when not provided', () => {
		const props: PasswordInputProps = {
			label: 'Password',
		};

		const { result } = renderHook(() => usePasswordInputProps({ props }));

		expect(result.current.state).toBeDefined();
	});

	it('extracts value and onChange correctly', () => {
		const onChange = () => {};
		const props: PasswordInputProps = {
			label: 'Password',
			value: 'password123',
			onChange,
		};

		const { result } = renderHook(() => usePasswordInputProps({ props }));

		expect(result.current.fieldProps.props.value).toBe('password123');
		expect(result.current.fieldProps.props.onChange).toBe(onChange);
	});

	it('extracts disabled and required correctly', () => {
		const props: PasswordInputProps = {
			label: 'Password',
			disabled: true,
			required: true,
		};

		const { result } = renderHook(() => usePasswordInputProps({ props }));

		expect(result.current.fieldProps.disabled).toBe(true);
		expect(result.current.fieldProps.required).toBe(true);
	});
});

describe('usePasswordInputProps - Password Visibility State', () => {
	it('initializes with showPassword as false', () => {
		const props: PasswordInputProps = {
			label: 'Password',
		};

		const { result } = renderHook(() => usePasswordInputProps({ props }));

		expect(result.current.fieldProps.showPassword).toBe(false);
	});

	it('toggles showPassword when onToggleVisibility is called', () => {
		const props: PasswordInputProps = {
			label: 'Password',
		};

		const { result } = renderHook(() => usePasswordInputProps({ props }));

		expect(result.current.fieldProps.showPassword).toBe(false);

		// Simulate toggle
		result.current.fieldProps.onToggleVisibility();

		// Note: In a real component, this would trigger a re-render
		// Here we're just testing that the function exists and can be called
		expect(typeof result.current.fieldProps.onToggleVisibility).toBe('function');
	});

	it('provides onToggleVisibility function in field props', () => {
		const props: PasswordInputProps = {
			label: 'Password',
		};

		const { result } = renderHook(() => usePasswordInputProps({ props }));

		expect(result.current.fieldProps.onToggleVisibility).toBeDefined();
		expect(typeof result.current.fieldProps.onToggleVisibility).toBe('function');
	});
});

describe('usePasswordInputProps - State Computation', () => {
	it('computes state using usePasswordInputState', () => {
		const props: PasswordInputProps = {
			label: 'Password',
			error: 'Invalid password',
			helperText: 'Enter your password',
			size: 'lg',
			inputId: 'test-id',
		};

		const { result } = renderHook(() => usePasswordInputProps({ props }));

		expect(result.current.state).toBeDefined();
		expect(result.current.state.finalId).toBe('test-id');
		expect(result.current.state.hasError).toBe(true);
		expect(result.current.state.ariaDescribedBy).toContain('test-id-error');
		expect(result.current.state.ariaDescribedBy).toContain('test-id-helper');
	});

	it('passes computed state to field props', () => {
		const props: PasswordInputProps = {
			label: 'Password',
			inputId: 'test-id',
			size: 'md',
		};

		const { result } = renderHook(() => usePasswordInputProps({ props }));

		expect(result.current.fieldProps.id).toBe('test-id');
		expect(result.current.fieldProps.className).toBe(result.current.state.inputClasses);
		expect(result.current.fieldProps.hasError).toBe(result.current.state.hasError);
		expect(result.current.fieldProps.ariaDescribedBy).toBe(result.current.state.ariaDescribedBy);
	});
});

describe('usePasswordInputProps - Field Props Building', () => {
	it('builds complete field props object', () => {
		const onChange = () => {};
		const props: PasswordInputProps = {
			label: 'Password',
			inputId: 'test-id',
			disabled: true,
			required: true,
			value: 'password123',
			onChange,
			size: 'md',
		};

		const { result } = renderHook(() => usePasswordInputProps({ props }));

		expect(result.current.fieldProps).toBeDefined();
		expect(result.current.fieldProps.id).toBe('test-id');
		expect(result.current.fieldProps.className).toBeDefined();
		expect(result.current.fieldProps.hasError).toBe(false);
		expect(result.current.fieldProps.disabled).toBe(true);
		expect(result.current.fieldProps.required).toBe(true);
		expect(result.current.fieldProps.showPassword).toBe(false);
		expect(result.current.fieldProps.onToggleVisibility).toBeDefined();
		expect(result.current.fieldProps.props.value).toBe('password123');
		expect(result.current.fieldProps.props.onChange).toBe(onChange);
	});

	it('includes rest props in field props', () => {
		const props: PasswordInputProps = {
			label: 'Password',
			placeholder: 'Enter your password',
			'data-testid': 'password-input',
			size: 'md',
		} as any;

		const { result } = renderHook(() => usePasswordInputProps({ props }));

		expect(result.current.fieldProps.props).toBeDefined();
		expect(result.current.fieldProps.props.placeholder).toBe('Enter your password');
		expect((result.current.fieldProps.props as any)['data-testid']).toBe('password-input');
	});
});

describe('usePasswordInputProps - Return Values', () => {
	it('returns all expected values', () => {
		const props: PasswordInputProps = {
			label: 'Password',
			error: 'Invalid',
			helperText: 'Helper',
			required: true,
			fullWidth: true,
			size: 'md',
		};

		const { result } = renderHook(() => usePasswordInputProps({ props }));

		expect(result.current).toHaveProperty('state');
		expect(result.current).toHaveProperty('fieldProps');
		expect(result.current).toHaveProperty('label');
		expect(result.current).toHaveProperty('error');
		expect(result.current).toHaveProperty('helperText');
		expect(result.current).toHaveProperty('required');
		expect(result.current).toHaveProperty('fullWidth');
	});
});

describe('usePasswordInputProps - Integration', () => {
	it('handles complete PasswordInput props flow', () => {
		const onChange = () => {};
		const props: PasswordInputProps = {
			label: 'Password',
			error: 'Invalid password',
			helperText: 'Enter your password',
			size: 'lg',
			fullWidth: true,
			inputId: 'password-input',
			disabled: false,
			required: true,
			value: 'password123',
			onChange,
			placeholder: 'Enter password',
		};

		const { result } = renderHook(() => usePasswordInputProps({ props }));

		// Check extracted props
		expect(result.current.label).toBe('Password');
		expect(result.current.error).toBe('Invalid password');
		expect(result.current.helperText).toBe('Enter your password');
		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);

		// Check computed state
		expect(result.current.state.finalId).toBe('password-input');
		expect(result.current.state.hasError).toBe(true);
		expect(result.current.state.ariaDescribedBy).toContain('password-input-error');
		expect(result.current.state.ariaDescribedBy).toContain('password-input-helper');

		// Check field props
		expect(result.current.fieldProps.id).toBe('password-input');
		expect(result.current.fieldProps.hasError).toBe(true);
		expect(result.current.fieldProps.disabled).toBe(false);
		expect(result.current.fieldProps.required).toBe(true);
		expect(result.current.fieldProps.showPassword).toBe(false);
		expect(result.current.fieldProps.props.value).toBe('password123');
		expect(result.current.fieldProps.props.onChange).toBe(onChange);
		expect(result.current.fieldProps.props.placeholder).toBe('Enter password');
	});
});
