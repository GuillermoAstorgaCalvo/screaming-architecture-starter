/**
 * InlineEditSetup Tests
 *
 * Tests for setup functions:
 * - useInlineEditSetup
 * - createSetupOptions
 * - getSetupConfig
 */

import {
	createSetupOptions,
	getSetupConfig,
	useInlineEditSetup,
} from '@core/ui/forms/inline-edit/helpers/InlineEditSetup';
import type { InlineEditProps } from '@src-types/ui/forms-inputs';
import { act, renderHook } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

const DEFAULT_SIZE = 'md' as const;
const TYPE_FUNCTION = 'function';
const TEST_SHOULD_BE_FUNCTION = 'should be a function';

describe('useInlineEditSetup', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof useInlineEditSetup).toBe(TYPE_FUNCTION);
	});

	it('returns all expected properties', () => {
		const inputRef = createRef<HTMLInputElement>();

		const { result } = renderHook(() =>
			useInlineEditSetup({
				controlledValue: 'Test Value',
				defaultValue: undefined,
				onSave: undefined,
				onCancel: undefined,
				onChange: undefined,
				size: DEFAULT_SIZE,
				disabled: false,
				displayClassName: undefined,
				inputClassName: undefined,
				inputRef,
			})
		);

		expect(result.current).toHaveProperty('isEditing');
		expect(result.current).toHaveProperty('editValue');
		expect(result.current).toHaveProperty('displayValue');
		expect(result.current).toHaveProperty('isEmpty');
		expect(result.current).toHaveProperty('displayClasses');
		expect(result.current).toHaveProperty('inputClasses');
		expect(result.current).toHaveProperty('focusInput');
		expect(result.current).toHaveProperty('handleChange');
		expect(result.current).toHaveProperty('handleKeyDown');
		expect(result.current).toHaveProperty('handleBlur');
		expect(result.current).toHaveProperty('handleDisplayClick');
		expect(result.current).toHaveProperty('handleDisplayKeyDown');
	});

	it('computes displayValue from controlledValue', () => {
		const inputRef = createRef<HTMLInputElement>();

		const { result } = renderHook(() =>
			useInlineEditSetup({
				controlledValue: 'Controlled Value',
				defaultValue: undefined,
				onSave: undefined,
				onCancel: undefined,
				onChange: undefined,
				size: DEFAULT_SIZE,
				disabled: false,
				displayClassName: undefined,
				inputClassName: undefined,
				inputRef,
			})
		);

		expect(result.current.displayValue).toBe('Controlled Value');
		expect(result.current.isEmpty).toBe(false);
	});

	it('computes displayValue from defaultValue when controlledValue is undefined', () => {
		const inputRef = createRef<HTMLInputElement>();

		const { result } = renderHook(() =>
			useInlineEditSetup({
				controlledValue: undefined,
				defaultValue: 'Default Value',
				onSave: undefined,
				onCancel: undefined,
				onChange: undefined,
				size: DEFAULT_SIZE,
				disabled: false,
				displayClassName: undefined,
				inputClassName: undefined,
				inputRef,
			})
		);

		expect(result.current.displayValue).toBe('Default Value');
		expect(result.current.isEmpty).toBe(false);
	});

	it('computes empty string when both values are undefined', () => {
		const inputRef = createRef<HTMLInputElement>();

		const { result } = renderHook(() =>
			useInlineEditSetup({
				controlledValue: undefined,
				defaultValue: undefined,
				onSave: undefined,
				onCancel: undefined,
				onChange: undefined,
				size: DEFAULT_SIZE,
				disabled: false,
				displayClassName: undefined,
				inputClassName: undefined,
				inputRef,
			})
		);

		expect(result.current.displayValue).toBe('');
		expect(result.current.isEmpty).toBe(true);
	});

	it('starts in non-editing state', () => {
		const inputRef = createRef<HTMLInputElement>();

		const { result } = renderHook(() =>
			useInlineEditSetup({
				controlledValue: 'Test',
				defaultValue: undefined,
				onSave: undefined,
				onCancel: undefined,
				onChange: undefined,
				size: DEFAULT_SIZE,
				disabled: false,
				displayClassName: undefined,
				inputClassName: undefined,
				inputRef,
			})
		);

		expect(result.current.isEditing).toBe(false);
	});

	it('computes displayClasses with custom className', () => {
		const inputRef = createRef<HTMLInputElement>();

		const { result } = renderHook(() =>
			useInlineEditSetup({
				controlledValue: 'Test',
				defaultValue: undefined,
				onSave: undefined,
				onCancel: undefined,
				onChange: undefined,
				size: DEFAULT_SIZE,
				disabled: false,
				displayClassName: 'custom-display',
				inputClassName: undefined,
				inputRef,
			})
		);

		expect(result.current.displayClasses).toContain('custom-display');
	});

	it('computes inputClasses with custom className', () => {
		const inputRef = createRef<HTMLInputElement>();

		const { result } = renderHook(() =>
			useInlineEditSetup({
				controlledValue: 'Test',
				defaultValue: undefined,
				onSave: undefined,
				onCancel: undefined,
				onChange: undefined,
				size: DEFAULT_SIZE,
				disabled: false,
				displayClassName: undefined,
				inputClassName: 'custom-input',
				inputRef,
			})
		);

		expect(result.current.inputClasses).toContain('custom-input');
	});

	it('provides focusInput function', () => {
		const inputRef = createRef<HTMLInputElement>();

		const { result } = renderHook(() =>
			useInlineEditSetup({
				controlledValue: 'Test',
				defaultValue: undefined,
				onSave: undefined,
				onCancel: undefined,
				onChange: undefined,
				size: DEFAULT_SIZE,
				disabled: false,
				displayClassName: undefined,
				inputClassName: undefined,
				inputRef,
			})
		);

		expect(typeof result.current.focusInput).toBe(TYPE_FUNCTION);
	});

	it('provides handleDisplayClick that starts editing', () => {
		const inputRef = createRef<HTMLInputElement>();

		const { result } = renderHook(() =>
			useInlineEditSetup({
				controlledValue: 'Test',
				defaultValue: undefined,
				onSave: undefined,
				onCancel: undefined,
				onChange: undefined,
				size: DEFAULT_SIZE,
				disabled: false,
				displayClassName: undefined,
				inputClassName: undefined,
				inputRef,
			})
		);

		expect(result.current.isEditing).toBe(false);
		act(() => {
			result.current.handleDisplayClick();
		});
		expect(result.current.isEditing).toBe(true);
	});

	it('does not start editing when disabled', () => {
		const inputRef = createRef<HTMLInputElement>();

		const { result } = renderHook(() =>
			useInlineEditSetup({
				controlledValue: 'Test',
				defaultValue: undefined,
				onSave: undefined,
				onCancel: undefined,
				onChange: undefined,
				size: DEFAULT_SIZE,
				disabled: true,
				displayClassName: undefined,
				inputClassName: undefined,
				inputRef,
			})
		);

		expect(result.current.isEditing).toBe(false);
		act(() => {
			result.current.handleDisplayClick();
		});
		expect(result.current.isEditing).toBe(false);
	});
});

describe('createSetupOptions', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof createSetupOptions).toBe(TYPE_FUNCTION);
	});

	it('creates setup options from params', () => {
		const inputRef = createRef<HTMLInputElement>();

		const result = createSetupOptions({
			controlledValue: 'Value',
			defaultValue: 'Default',
			onSave: vi.fn(),
			onCancel: vi.fn(),
			onChange: vi.fn(),
			size: 'lg',
			disabled: true,
			displayClassName: 'display',
			inputClassName: 'input',
			inputRef,
		});

		expect(result.controlledValue).toBe('Value');
		expect(result.defaultValue).toBe('Default');
		expect(result.size).toBe('lg');
		expect(result.disabled).toBe(true);
		expect(result.displayClassName).toBe('display');
		expect(result.inputClassName).toBe('input');
		expect(result.inputRef).toBe(inputRef);
	});

	it('handles undefined values', () => {
		const inputRef = createRef<HTMLInputElement>();

		const result = createSetupOptions({
			controlledValue: undefined,
			defaultValue: undefined,
			onSave: undefined,
			onCancel: undefined,
			onChange: undefined,
			size: DEFAULT_SIZE,
			disabled: false,
			displayClassName: undefined,
			inputClassName: undefined,
			inputRef,
		});

		expect(result.controlledValue).toBeUndefined();
		expect(result.defaultValue).toBeUndefined();
		expect(result.onSave).toBeUndefined();
		expect(result.onCancel).toBeUndefined();
		expect(result.onChange).toBeUndefined();
	});
});

describe('getSetupConfig', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof getSetupConfig).toBe(TYPE_FUNCTION);
	});

	it('creates setup config from props', () => {
		const inputRef = createRef<HTMLInputElement>();

		const props: InlineEditProps = {
			value: 'Value',
			defaultValue: 'Default',
			onSave: vi.fn(),
			onCancel: vi.fn(),
			onChange: vi.fn(),
			size: 'lg',
			disabled: true,
			displayClassName: 'display',
			inputClassName: 'input',
		};

		const result = getSetupConfig(props, inputRef);

		expect(result.controlledValue).toBe('Value');
		expect(result.defaultValue).toBe('Default');
		expect(result.size).toBe('lg');
		expect(result.disabled).toBe(true);
		expect(result.displayClassName).toBe('display');
		expect(result.inputClassName).toBe('input');
		expect(result.inputRef).toBe(inputRef);
	});

	it('uses default size when not provided', () => {
		const inputRef = createRef<HTMLInputElement>();

		const props: InlineEditProps = {};

		const result = getSetupConfig(props, inputRef);

		expect(result.size).toBe('md');
	});

	it('uses default disabled when not provided', () => {
		const inputRef = createRef<HTMLInputElement>();

		const props: InlineEditProps = {};

		const result = getSetupConfig(props, inputRef);

		expect(result.disabled).toBe(false);
	});
});
