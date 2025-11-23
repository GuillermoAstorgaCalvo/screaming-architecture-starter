/**
 * useSearchInputProps.helpers Tests
 *
 * Tests for SearchInput helper functions:
 * - shouldShowClearButton
 * - buildFieldProps
 */

import type { ExtractedSearchInputProps } from '@core/ui/forms/search-input/hooks/useSearchInputProps.extract';
import {
	buildFieldProps,
	shouldShowClearButton,
} from '@core/ui/forms/search-input/hooks/useSearchInputProps.helpers';
import type { UseSearchInputStateReturn } from '@core/ui/forms/search-input/types/SearchInputTypes';
import { describe, expect, it, vi } from 'vitest';

describe('shouldShowClearButton', () => {
	it('returns true when value is present and showClearButtonProp is not false', () => {
		const result = shouldShowClearButton('test value', undefined, undefined);
		expect(result).toBe(true);
	});

	it('returns true when defaultValue is present and showClearButtonProp is not false', () => {
		const result = shouldShowClearButton(undefined, 'default value', undefined);
		expect(result).toBe(true);
	});

	it('returns false when showClearButtonProp is explicitly false', () => {
		const result = shouldShowClearButton('test value', undefined, false);
		expect(result).toBe(false);
	});

	it('returns false when value is empty string', () => {
		const result = shouldShowClearButton('', undefined, undefined);
		expect(result).toBe(false);
	});

	it('returns false when defaultValue is empty string', () => {
		const result = shouldShowClearButton(undefined, '', undefined);
		expect(result).toBe(false);
	});

	it('returns false when both value and defaultValue are empty', () => {
		const result = shouldShowClearButton('', '', undefined);
		expect(result).toBe(false);
	});

	it('returns false when both value and defaultValue are undefined', () => {
		const result = shouldShowClearButton(undefined, undefined, undefined);
		expect(result).toBe(false);
	});

	it('returns true when showClearButtonProp is true', () => {
		const result = shouldShowClearButton('test', undefined, true);
		expect(result).toBe(true);
	});

	it('returns true when showClearButtonProp is undefined and value exists', () => {
		const result = shouldShowClearButton('test', undefined, undefined);
		expect(result).toBe(true);
	});

	it('prefers value over defaultValue', () => {
		const result = shouldShowClearButton('value', 'default', undefined);
		expect(result).toBe(true);
	});

	it('uses defaultValue when value is undefined', () => {
		const result = shouldShowClearButton(undefined, 'default', undefined);
		expect(result).toBe(true);
	});

	it('handles whitespace-only value as non-empty', () => {
		const result = shouldShowClearButton('   ', undefined, undefined);
		expect(result).toBe(true);
	});
});

describe('buildFieldProps', () => {
	const createMockState = (
		overrides?: Partial<UseSearchInputStateReturn>
	): UseSearchInputStateReturn => ({
		finalId: 'test-id',
		hasError: false,
		ariaDescribedBy: undefined,
		inputClasses: 'input-classes',
		...overrides,
	});

	const createMockExtracted = (
		overrides?: Partial<ExtractedSearchInputProps>
	): ExtractedSearchInputProps => ({
		label: 'Search',
		size: 'md',
		fullWidth: false,
		disabled: false,
		required: false,
		value: undefined,
		defaultValue: undefined,
		onChange: undefined,
		rest: {},
		...overrides,
	});

	it('builds complete field props object', () => {
		const state = createMockState();
		const extracted = createMockExtracted({
			disabled: true,
			required: true,
			value: 'test value',
		});
		const onChange = vi.fn();

		const fieldProps = buildFieldProps({
			state,
			extracted,
			showClearButton: true,
			onChange,
		});

		expect(fieldProps.id).toBe('test-id');
		expect(fieldProps.className).toBe('input-classes');
		expect(fieldProps.hasError).toBe(false);
		expect(fieldProps.ariaDescribedBy).toBeUndefined();
		expect(fieldProps.disabled).toBe(true);
		expect(fieldProps.required).toBe(true);
		expect(fieldProps.value).toBe('test value');
		expect(fieldProps.showClearButton).toBe(true);
		expect(typeof fieldProps.onClear).toBe('function');
		expect(fieldProps.props).toBeDefined();
	});

	it('includes state values in field props', () => {
		const state = createMockState({
			finalId: 'custom-id',
			hasError: true,
			ariaDescribedBy: 'custom-id-error',
			inputClasses: 'custom-classes',
		});
		const extracted = createMockExtracted();

		const fieldProps = buildFieldProps({
			state,
			extracted,
			showClearButton: false,
		});

		expect(fieldProps.id).toBe('custom-id');
		expect(fieldProps.className).toBe('custom-classes');
		expect(fieldProps.hasError).toBe(true);
		expect(fieldProps.ariaDescribedBy).toBe('custom-id-error');
	});

	it('includes extracted disabled and required', () => {
		const state = createMockState();
		const extracted = createMockExtracted({
			disabled: true,
			required: true,
		});

		const fieldProps = buildFieldProps({
			state,
			extracted,
			showClearButton: false,
		});

		expect(fieldProps.disabled).toBe(true);
		expect(fieldProps.required).toBe(true);
	});

	it('includes extracted value', () => {
		const state = createMockState();
		const extracted = createMockExtracted({
			value: 'controlled value',
		});

		const fieldProps = buildFieldProps({
			state,
			extracted,
			showClearButton: false,
		});

		expect(fieldProps.value).toBe('controlled value');
	});

	it('creates onClear handler that calls onChange with empty string', () => {
		const onChange = vi.fn();
		const state = createMockState();
		const extracted = createMockExtracted();

		const fieldProps = buildFieldProps({
			state,
			extracted,
			showClearButton: true,
			onChange,
		});

		fieldProps.onClear();

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith('');
	});

	it('handles onClear when onChange is undefined', () => {
		const state = createMockState();
		const extracted = createMockExtracted();

		const fieldProps = buildFieldProps({
			state,
			extracted,
			showClearButton: true,
			onChange: undefined,
		});

		// Should not throw
		expect(() => fieldProps.onClear()).not.toThrow();
	});

	it('creates handleInputChange that calls onChange with event target value', () => {
		const onChange = vi.fn();
		const state = createMockState();
		const extracted = createMockExtracted();

		const fieldProps = buildFieldProps({
			state,
			extracted,
			showClearButton: false,
			onChange,
		});

		const mockEvent = {
			target: { value: 'new value' },
		} as React.ChangeEvent<HTMLInputElement>;

		fieldProps.props.onChange?.(mockEvent);

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith('new value');
	});

	it('handles handleInputChange when onChange is undefined', () => {
		const state = createMockState();
		const extracted = createMockExtracted();

		const fieldProps = buildFieldProps({
			state,
			extracted,
			showClearButton: false,
			onChange: undefined,
		});

		const mockEvent = {
			target: { value: 'new value' },
		} as React.ChangeEvent<HTMLInputElement>;

		// Should not throw
		expect(() => fieldProps.props.onChange?.(mockEvent)).not.toThrow();
	});

	it('includes rest props in field props', () => {
		const state = createMockState();
		const extracted = createMockExtracted({
			rest: {
				placeholder: 'Enter search',
				'data-testid': 'search-input',
				autoFocus: true,
			} as any,
		});

		const fieldProps = buildFieldProps({
			state,
			extracted,
			showClearButton: false,
		});

		expect(fieldProps.props.placeholder).toBe('Enter search');
		expect((fieldProps.props as any)['data-testid']).toBe('search-input');
		expect(fieldProps.props.autoFocus).toBe(true);
	});

	it('overrides onChange in rest props with handler', () => {
		const onChange = vi.fn();
		const state = createMockState();
		const extracted = createMockExtracted({
			rest: {
				onChange: vi.fn(),
			} as any,
		});

		const fieldProps = buildFieldProps({
			state,
			extracted,
			showClearButton: false,
			onChange,
		});

		const mockEvent = {
			target: { value: 'test' },
		} as React.ChangeEvent<HTMLInputElement>;

		fieldProps.props.onChange?.(mockEvent);

		// Should call the provided onChange, not the one from rest
		expect(onChange).toHaveBeenCalledWith('test');
	});

	it('handles showClearButton flag', () => {
		const state = createMockState();
		const extracted = createMockExtracted();

		const fieldPropsWithClear = buildFieldProps({
			state,
			extracted,
			showClearButton: true,
		});

		const fieldPropsWithoutClear = buildFieldProps({
			state,
			extracted,
			showClearButton: false,
		});

		expect(fieldPropsWithClear.showClearButton).toBe(true);
		expect(fieldPropsWithoutClear.showClearButton).toBe(false);
	});
});
