/**
 * useSearchInput Tests
 *
 * Tests for the useSearchInputProps hook:
 * - Prop extraction
 * - State computation
 * - Field props building
 * - Return values
 */

import { useSearchInputProps } from '@core/ui/forms/search-input/hooks/useSearchInput';
import type { SearchInputProps } from '@src-types/ui/forms-inputs';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useSearchInputProps - Prop Extraction', () => {
	it('extracts all props correctly', () => {
		const props: SearchInputProps = {
			label: 'Search',
			error: 'Error message',
			helperText: 'Helper text',
			size: 'lg',
			fullWidth: true,
			inputId: 'custom-id',
			disabled: true,
			required: true,
			value: 'test value',
			onChange: () => {},
		};

		const { result } = renderHook(() => useSearchInputProps({ props }));

		expect(result.current.label).toBe('Search');
		expect(result.current.error).toBe('Error message');
		expect(result.current.helperText).toBe('Helper text');
		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);
	});

	it('uses default values for optional props', () => {
		const props: SearchInputProps = {
			label: 'Search',
		};

		const { result } = renderHook(() => useSearchInputProps({ props }));

		expect(result.current.label).toBe('Search');
		expect(result.current.error).toBeUndefined();
		expect(result.current.helperText).toBeUndefined();
		expect(result.current.required).toBeUndefined();
		expect(result.current.fullWidth).toBe(false);
	});

	it('defaults size to md when not provided', () => {
		const props: SearchInputProps = {
			label: 'Search',
		};

		const { result } = renderHook(() => useSearchInputProps({ props }));

		expect(result.current.state).toBeDefined();
		// State should be computed with default size 'md'
	});

	it('extracts value and onChange correctly', () => {
		const onChange = vi.fn();
		const props: SearchInputProps = {
			label: 'Search',
			value: 'test value',
			onChange,
		};

		const { result } = renderHook(() => useSearchInputProps({ props }));

		expect(result.current.fieldProps.value).toBe('test value');
		expect(result.current.fieldProps.props.onChange).toBeDefined();
	});

	it('extracts defaultValue correctly', () => {
		const props: SearchInputProps = {
			label: 'Search',
			defaultValue: 'default value',
		};

		const { result } = renderHook(() => useSearchInputProps({ props }));

		expect(result.current.fieldProps.value).toBeUndefined();
		// defaultValue is used internally for clear button logic
	});
});

describe('useSearchInputProps - State Computation', () => {
	it('computes state using useSearchInputState', () => {
		const props: SearchInputProps = {
			label: 'Search',
			error: 'Error message',
			helperText: 'Helper text',
			size: 'lg',
			inputId: 'test-id',
		};

		const { result } = renderHook(() => useSearchInputProps({ props }));

		expect(result.current.state).toBeDefined();
		expect(result.current.state.finalId).toBe('test-id');
		expect(result.current.state.hasError).toBe(true);
		expect(result.current.state.ariaDescribedBy).toContain('test-id-error');
		expect(result.current.state.ariaDescribedBy).toContain('test-id-helper');
	});

	it('passes computed state to field props', () => {
		const props: SearchInputProps = {
			label: 'Search',
			inputId: 'test-id',
			size: 'md',
		};

		const { result } = renderHook(() => useSearchInputProps({ props }));

		expect(result.current.fieldProps.id).toBe('test-id');
		expect(result.current.fieldProps.className).toBe(result.current.state.inputClasses);
		expect(result.current.fieldProps.hasError).toBe(result.current.state.hasError);
		expect(result.current.fieldProps.ariaDescribedBy).toBe(result.current.state.ariaDescribedBy);
	});
});

describe('useSearchInputProps - Clear Button Logic', () => {
	it('shows clear button when value is present', () => {
		const props: SearchInputProps = {
			label: 'Search',
			value: 'test',
		};

		const { result } = renderHook(() => useSearchInputProps({ props }));

		expect(result.current.fieldProps.showClearButton).toBe(true);
	});

	it('shows clear button when defaultValue is present', () => {
		const props: SearchInputProps = {
			label: 'Search',
			defaultValue: 'test',
		};

		const { result } = renderHook(() => useSearchInputProps({ props }));

		expect(result.current.fieldProps.showClearButton).toBe(true);
	});

	it('hides clear button when value is empty', () => {
		const props: SearchInputProps = {
			label: 'Search',
			value: '',
		};

		const { result } = renderHook(() => useSearchInputProps({ props }));

		expect(result.current.fieldProps.showClearButton).toBe(false);
	});

	it('hides clear button when showClearButton is false', () => {
		const props: SearchInputProps = {
			label: 'Search',
			value: 'test',
			showClearButton: false,
		};

		const { result } = renderHook(() => useSearchInputProps({ props }));

		expect(result.current.fieldProps.showClearButton).toBe(false);
	});

	it('shows clear button when showClearButton is true', () => {
		const props: SearchInputProps = {
			label: 'Search',
			value: 'test',
			showClearButton: true,
		};

		const { result } = renderHook(() => useSearchInputProps({ props }));

		expect(result.current.fieldProps.showClearButton).toBe(true);
	});
});

describe('useSearchInputProps - Field Props Building', () => {
	it('builds complete field props object', () => {
		const onChange = vi.fn();
		const props: SearchInputProps = {
			label: 'Search',
			inputId: 'test-id',
			disabled: true,
			required: true,
			value: 'test value',
			onChange,
			size: 'md',
		};

		const { result } = renderHook(() => useSearchInputProps({ props }));

		expect(result.current.fieldProps).toBeDefined();
		expect(result.current.fieldProps.id).toBe('test-id');
		expect(result.current.fieldProps.className).toBeDefined();
		expect(result.current.fieldProps.hasError).toBe(false);
		expect(result.current.fieldProps.disabled).toBe(true);
		expect(result.current.fieldProps.required).toBe(true);
		expect(result.current.fieldProps.value).toBe('test value');
		expect(typeof result.current.fieldProps.onClear).toBe('function');
		expect(result.current.fieldProps.props).toBeDefined();
	});

	it('includes rest props in field props', () => {
		const props: SearchInputProps = {
			label: 'Search',
			placeholder: 'Enter search',
			'data-testid': 'search-input',
			size: 'md',
		} as any;

		const { result } = renderHook(() => useSearchInputProps({ props }));

		expect(result.current.fieldProps.props).toBeDefined();
		expect(result.current.fieldProps.props.placeholder).toBe('Enter search');
		expect((result.current.fieldProps.props as any)['data-testid']).toBe('search-input');
	});

	it('creates onClear handler that calls onChange', () => {
		const onChange = vi.fn();
		const props: SearchInputProps = {
			label: 'Search',
			value: 'test',
			onChange,
		};

		const { result } = renderHook(() => useSearchInputProps({ props }));

		result.current.fieldProps.onClear();

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith('');
	});

	it('creates onChange handler that calls onChange prop', () => {
		const onChange = vi.fn();
		const props: SearchInputProps = {
			label: 'Search',
			onChange,
		};

		const { result } = renderHook(() => useSearchInputProps({ props }));

		const mockEvent = {
			target: { value: 'new value' },
		} as React.ChangeEvent<HTMLInputElement>;

		result.current.fieldProps.props.onChange?.(mockEvent);

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith('new value');
	});
});

describe('useSearchInputProps - Return Values', () => {
	it('returns all expected values', () => {
		const props: SearchInputProps = {
			label: 'Search',
			error: 'Error',
			helperText: 'Helper',
			required: true,
			fullWidth: true,
			size: 'md',
		};

		const { result } = renderHook(() => useSearchInputProps({ props }));

		expect(result.current).toHaveProperty('state');
		expect(result.current).toHaveProperty('fieldProps');
		expect(result.current).toHaveProperty('label');
		expect(result.current).toHaveProperty('error');
		expect(result.current).toHaveProperty('helperText');
		expect(result.current).toHaveProperty('required');
		expect(result.current).toHaveProperty('fullWidth');
	});

	it('returns extracted label, error, and helperText', () => {
		const props: SearchInputProps = {
			label: 'Search',
			error: 'Error message',
			helperText: 'Helper text',
			size: 'md',
		};

		const { result } = renderHook(() => useSearchInputProps({ props }));

		expect(result.current.label).toBe('Search');
		expect(result.current.error).toBe('Error message');
		expect(result.current.helperText).toBe('Helper text');
	});

	it('returns required and fullWidth flags', () => {
		const props: SearchInputProps = {
			label: 'Search',
			required: true,
			fullWidth: true,
			size: 'md',
		};

		const { result } = renderHook(() => useSearchInputProps({ props }));

		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);
	});
});

describe('useSearchInputProps - Integration', () => {
	it('handles complete SearchInput props flow', () => {
		const onChange = vi.fn();
		const props: SearchInputProps = {
			label: 'Search',
			error: 'Error message',
			helperText: 'Helper text',
			size: 'lg',
			fullWidth: true,
			inputId: 'search-input',
			disabled: false,
			required: true,
			value: 'test value',
			onChange,
			placeholder: 'Enter search',
		};

		const { result } = renderHook(() => useSearchInputProps({ props }));

		// Check extracted props
		expect(result.current.label).toBe('Search');
		expect(result.current.error).toBe('Error message');
		expect(result.current.helperText).toBe('Helper text');
		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);

		// Check computed state
		expect(result.current.state.finalId).toBe('search-input');
		expect(result.current.state.hasError).toBe(true);
		expect(result.current.state.ariaDescribedBy).toContain('search-input-error');
		expect(result.current.state.ariaDescribedBy).toContain('search-input-helper');

		// Check field props
		expect(result.current.fieldProps.id).toBe('search-input');
		expect(result.current.fieldProps.hasError).toBe(true);
		expect(result.current.fieldProps.disabled).toBe(false);
		expect(result.current.fieldProps.required).toBe(true);
		expect(result.current.fieldProps.value).toBe('test value');
		expect(typeof result.current.fieldProps.onClear).toBe('function');
		expect(result.current.fieldProps.showClearButton).toBe(true);
		expect(result.current.fieldProps.props.placeholder).toBe('Enter search');
	});

	it('handles minimal props', () => {
		const props: SearchInputProps = {
			size: 'md',
		};

		const { result } = renderHook(() => useSearchInputProps({ props }));

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
			({ props }: { props: SearchInputProps }) => useSearchInputProps({ props }),
			{
				initialProps: {
					props: {
						label: 'Search',
						size: 'md',
					},
				},
			}
		);

		expect(result.current.label).toBe('Search');
		expect(result.current.state.hasError).toBe(false);

		rerender({
			props: {
				label: 'Search',
				error: 'Error',
				size: 'md',
			},
		});

		expect(result.current.error).toBe('Error');
		expect(result.current.state.hasError).toBe(true);
	});
});
