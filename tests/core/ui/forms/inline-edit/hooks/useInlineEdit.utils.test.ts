/**
 * useInlineEdit.utils Tests
 *
 * Tests for utility functions:
 * - getCurrentValue
 * - trimValue
 * - shouldSaveOnBlur
 * - useInlineEditValue
 * - buildInlineEditReturn
 */

import {
	buildInlineEditReturn,
	getCurrentValue,
	shouldSaveOnBlur,
	trimValue,
	useInlineEditValue,
} from '@core/ui/forms/inline-edit/hooks/useInlineEdit.utils';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('getCurrentValue', () => {
	it('should be a function', () => {
		expect(typeof getCurrentValue).toBe('function');
	});

	it('returns controlledValue when provided', () => {
		const result = getCurrentValue('Controlled', 'Default');
		expect(result).toBe('Controlled');
	});

	it('returns defaultValue when controlledValue is undefined', () => {
		const result = getCurrentValue(undefined, 'Default');
		expect(result).toBe('Default');
	});

	it('returns empty string when both are undefined', () => {
		const result = getCurrentValue(undefined, undefined);
		expect(result).toBe('');
	});

	it('prioritizes controlledValue over defaultValue', () => {
		const result = getCurrentValue('Controlled', 'Default');
		expect(result).toBe('Controlled');
	});

	it('handles empty string controlledValue', () => {
		const result = getCurrentValue('', 'Default');
		expect(result).toBe('');
	});

	it('handles empty string defaultValue', () => {
		const result = getCurrentValue(undefined, '');
		expect(result).toBe('');
	});
});

describe('trimValue', () => {
	it('should be a function', () => {
		expect(typeof trimValue).toBe('function');
	});

	it('trims whitespace from both ends', () => {
		expect(trimValue('  trimmed  ')).toBe('trimmed');
		expect(trimValue('  left')).toBe('left');
		expect(trimValue('right  ')).toBe('right');
	});

	it('returns empty string for whitespace-only string', () => {
		expect(trimValue('   ')).toBe('');
		expect(trimValue('\t\n')).toBe('');
	});

	it('returns original string when no whitespace', () => {
		expect(trimValue('notrim')).toBe('notrim');
		expect(trimValue('')).toBe('');
	});

	it('handles string with only whitespace in middle', () => {
		expect(trimValue('no trim')).toBe('no trim');
	});

	it('handles empty string', () => {
		expect(trimValue('')).toBe('');
	});
});

describe('shouldSaveOnBlur', () => {
	it('should be a function', () => {
		expect(typeof shouldSaveOnBlur).toBe('function');
	});

	it('returns true when values differ', () => {
		expect(shouldSaveOnBlur('Changed', 'Original', undefined)).toBe(true);
		expect(shouldSaveOnBlur('Changed', 'Original', () => {})).toBe(true);
	});

	it('returns true when values are same and onCancel is not provided', () => {
		expect(shouldSaveOnBlur('Same', 'Same', undefined)).toBe(true);
	});

	it('returns false when values are same and onCancel is provided', () => {
		expect(shouldSaveOnBlur('Same', 'Same', () => {})).toBe(false);
	});

	it('handles empty strings', () => {
		expect(shouldSaveOnBlur('', '', undefined)).toBe(true);
		expect(shouldSaveOnBlur('', '', () => {})).toBe(false);
		expect(shouldSaveOnBlur('', 'Original', undefined)).toBe(true);
		expect(shouldSaveOnBlur('Changed', '', undefined)).toBe(true);
	});

	it('handles whitespace differences', () => {
		expect(shouldSaveOnBlur('  Value  ', 'Value', undefined)).toBe(true);
		expect(shouldSaveOnBlur('Value', '  Value  ', undefined)).toBe(true);
	});
});

describe('useInlineEditValue', () => {
	it('should be a function', () => {
		expect(typeof useInlineEditValue).toBe('function');
	});

	it('returns currentValue from controlledValue', () => {
		const { result } = renderHook(() =>
			useInlineEditValue({
				controlledValue: 'Controlled',
				defaultValue: undefined,
			})
		);

		expect(result.current.currentValue).toBe('Controlled');
		expect(typeof result.current.getCurrentValueFn).toBe('function');
	});

	it('returns currentValue from defaultValue when controlledValue is undefined', () => {
		const { result } = renderHook(() =>
			useInlineEditValue({
				controlledValue: undefined,
				defaultValue: 'Default',
			})
		);

		expect(result.current.currentValue).toBe('Default');
	});

	it('returns empty string when both are undefined', () => {
		const { result } = renderHook(() =>
			useInlineEditValue({
				controlledValue: undefined,
				defaultValue: undefined,
			})
		);

		expect(result.current.currentValue).toBe('');
	});

	it('getCurrentValueFn returns current value', () => {
		const { result } = renderHook(() =>
			useInlineEditValue({
				controlledValue: 'Test',
				defaultValue: undefined,
			})
		);

		expect(result.current.getCurrentValueFn()).toBe('Test');
	});

	it('getCurrentValueFn updates when controlledValue changes', () => {
		const { result, rerender } = renderHook(
			({ controlledValue }: { controlledValue?: string }) =>
				useInlineEditValue({
					controlledValue,
					defaultValue: undefined,
				}),
			{
				initialProps: { controlledValue: 'Initial' },
			}
		);

		expect(result.current.getCurrentValueFn()).toBe('Initial');

		rerender({ controlledValue: 'Updated' });
		expect(result.current.getCurrentValueFn()).toBe('Updated');
	});

	it('getCurrentValueFn updates when defaultValue changes', () => {
		const { result, rerender } = renderHook(
			({ defaultValue }: { defaultValue?: string }) =>
				useInlineEditValue({
					controlledValue: undefined,
					defaultValue,
				}),
			{
				initialProps: { defaultValue: 'Initial' },
			}
		);

		expect(result.current.getCurrentValueFn()).toBe('Initial');

		rerender({ defaultValue: 'Updated' });
		expect(result.current.getCurrentValueFn()).toBe('Updated');
	});

	it('prioritizes controlledValue in getCurrentValueFn', () => {
		const { result } = renderHook(() =>
			useInlineEditValue({
				controlledValue: 'Controlled',
				defaultValue: 'Default',
			})
		);

		expect(result.current.getCurrentValueFn()).toBe('Controlled');
	});

	it('memoizes getCurrentValueFn', () => {
		const { result, rerender } = renderHook(
			({ controlledValue }: { controlledValue?: string }) =>
				useInlineEditValue({
					controlledValue,
					defaultValue: undefined,
				}),
			{
				initialProps: { controlledValue: 'Test' },
			}
		);

		const fn1 = result.current.getCurrentValueFn;

		rerender({ controlledValue: 'Test' });
		const fn2 = result.current.getCurrentValueFn;

		// Should be the same function when dependencies haven't changed
		expect(fn1).toBe(fn2);
	});
});

describe('buildInlineEditReturn', () => {
	it('should be a function', () => {
		expect(typeof buildInlineEditReturn).toBe('function');
	});

	it('builds return object with all properties', () => {
		// Mock state
		const state = {
			isEditing: false,
			editValue: 'Test',
			stopEditing: () => {},
		};

		// Mock handlers - we need to create a minimal mock
		const handlers = {
			startEditing: () => {},
			handleChange: () => {},
			handleKeyDown: () => {},
			handleBlur: () => {},
		};

		const result = buildInlineEditReturn(state, handlers);

		expect(result).toHaveProperty('isEditing');
		expect(result).toHaveProperty('editValue');
		expect(result).toHaveProperty('startEditing');
		expect(result).toHaveProperty('stopEditing');
		expect(result).toHaveProperty('handleChange');
		expect(result).toHaveProperty('handleKeyDown');
		expect(result).toHaveProperty('handleBlur');
	});

	it('includes state properties', () => {
		const state = {
			isEditing: true,
			editValue: 'Edited',
			stopEditing: () => {},
		};

		const handlers = {
			startEditing: () => {},
			handleChange: () => {},
			handleKeyDown: () => {},
			handleBlur: () => {},
		};

		const result = buildInlineEditReturn(state, handlers);

		expect(result.isEditing).toBe(true);
		expect(result.editValue).toBe('Edited');
		expect(typeof result.stopEditing).toBe('function');
	});

	it('includes handler functions', () => {
		const state = {
			isEditing: false,
			editValue: 'Test',
			stopEditing: () => {},
		};

		const startEditing = () => {};
		const handleChange = () => {};
		const handleKeyDown = () => {};
		const handleBlur = () => {};

		const handlers = {
			startEditing,
			handleChange,
			handleKeyDown,
			handleBlur,
		};

		const result = buildInlineEditReturn(state, handlers);

		expect(result.startEditing).toBe(startEditing);
		expect(result.handleChange).toBe(handleChange);
		expect(result.handleKeyDown).toBe(handleKeyDown);
		expect(result.handleBlur).toBe(handleBlur);
	});

	it('returns readonly properties', () => {
		const state = {
			isEditing: false,
			editValue: 'Test',
			stopEditing: () => {},
		};

		const handlers = {
			startEditing: () => {},
			handleChange: () => {},
			handleKeyDown: () => {},
			handleBlur: () => {},
		};

		const result = buildInlineEditReturn(state, handlers);

		// TypeScript would enforce readonly, but we can verify structure
		expect(result).toBeDefined();
		expect(typeof result.isEditing).toBe('boolean');
		expect(typeof result.editValue).toBe('string');
	});
});
