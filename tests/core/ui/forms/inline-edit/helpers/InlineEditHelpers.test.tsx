/**
 * InlineEditHelpers Tests
 *
 * Tests for helper functions:
 * - DISPLAY_BASE_CLASSES
 * - DISPLAY_SIZE_CLASSES
 * - PLACEHOLDER_CLASSES
 * - getDisplayContent
 * - buildHookOptions
 * - getDisplayClasses
 * - getInputClasses
 * - computeValues
 */

import {
	buildHookOptions,
	computeValues,
	DISPLAY_BASE_CLASSES,
	DISPLAY_SIZE_CLASSES,
	getDisplayClasses,
	getDisplayContent,
	getInputClasses,
	PLACEHOLDER_CLASSES,
} from '@core/ui/forms/inline-edit/helpers/InlineEditHelpers';
import type { InlineEditProps } from '@src-types/ui/forms-inputs';
import { describe, expect, it } from 'vitest';

describe('Constants', () => {
	it('DISPLAY_BASE_CLASSES should be defined', () => {
		expect(DISPLAY_BASE_CLASSES).toBeDefined();
		expect(typeof DISPLAY_BASE_CLASSES).toBe('string');
		expect(DISPLAY_BASE_CLASSES.length).toBeGreaterThan(0);
	});

	it('DISPLAY_SIZE_CLASSES should contain sm, md, lg', () => {
		expect(DISPLAY_SIZE_CLASSES).toHaveProperty('sm');
		expect(DISPLAY_SIZE_CLASSES).toHaveProperty('md');
		expect(DISPLAY_SIZE_CLASSES).toHaveProperty('lg');
		expect(typeof DISPLAY_SIZE_CLASSES.sm).toBe('string');
		expect(typeof DISPLAY_SIZE_CLASSES.md).toBe('string');
		expect(typeof DISPLAY_SIZE_CLASSES.lg).toBe('string');
	});

	it('PLACEHOLDER_CLASSES should be defined', () => {
		expect(PLACEHOLDER_CLASSES).toBeDefined();
		expect(typeof PLACEHOLDER_CLASSES).toBe('string');
		expect(PLACEHOLDER_CLASSES.length).toBeGreaterThan(0);
	});
});

describe('getDisplayContent', () => {
	it('should be a function', () => {
		expect(typeof getDisplayContent).toBe('function');
	});

	it('returns placeholder when empty and showEmptyPlaceholder is true', () => {
		const result = getDisplayContent({
			isEmpty: true,
			showEmptyPlaceholder: true,
			placeholder: 'Click to edit',
			displayValue: '',
			renderDisplay: undefined,
		});

		expect(result).toBeDefined();
		// Should return a React element with placeholder text
		if (result && typeof result === 'object' && 'props' in result) {
			const element = result as React.ReactElement;
			expect((element.props as { children: string }).children).toBe('Click to edit');
		}
	});

	it('returns renderDisplay result when provided', () => {
		const renderDisplay = (value: string) => <strong>{value}</strong>;
		const result = getDisplayContent({
			isEmpty: false,
			showEmptyPlaceholder: true,
			placeholder: 'Click to edit',
			displayValue: 'Test Value',
			renderDisplay,
		});

		expect(result).toBeDefined();
		if (result && typeof result === 'object' && 'props' in result) {
			const element = result as React.ReactElement;
			expect(element.type).toBe('strong');
			expect((element.props as { children: string }).children).toBe('Test Value');
		}
	});

	it('returns displayValue when no renderDisplay and not empty', () => {
		const result = getDisplayContent({
			isEmpty: false,
			showEmptyPlaceholder: true,
			placeholder: 'Click to edit',
			displayValue: 'Test Value',
			renderDisplay: undefined,
		});

		expect(result).toBe('Test Value');
	});

	it('returns displayValue when empty but showEmptyPlaceholder is false', () => {
		const result = getDisplayContent({
			isEmpty: true,
			showEmptyPlaceholder: false,
			placeholder: 'Click to edit',
			displayValue: '',
			renderDisplay: undefined,
		});

		expect(result).toBe('');
	});

	it('prioritizes renderDisplay over placeholder', () => {
		const renderDisplay = (value: string) => <em>{value}</em>;
		const result = getDisplayContent({
			isEmpty: true,
			showEmptyPlaceholder: true,
			placeholder: 'Click to edit',
			displayValue: '',
			renderDisplay,
		});

		expect(result).toBeDefined();
		if (result && typeof result === 'object' && 'props' in result) {
			expect(result.type).toBe('em');
		}
	});
});

describe('buildHookOptions', () => {
	it('should be a function', () => {
		expect(typeof buildHookOptions).toBe('function');
	});

	it('includes value when provided', () => {
		const props: InlineEditProps = {
			value: 'Test Value',
		};
		const result = buildHookOptions(props);
		expect(result).toHaveProperty('value');
		expect(result.value).toBe('Test Value');
	});

	it('excludes value when undefined', () => {
		const props: InlineEditProps = {};
		const result = buildHookOptions(props);
		expect(result).not.toHaveProperty('value');
	});

	it('includes defaultValue when provided', () => {
		const props: InlineEditProps = {
			defaultValue: 'Default Value',
		};
		const result = buildHookOptions(props);
		expect(result).toHaveProperty('defaultValue');
		expect(result.defaultValue).toBe('Default Value');
	});

	it('excludes defaultValue when undefined', () => {
		const props: InlineEditProps = {};
		const result = buildHookOptions(props);
		expect(result).not.toHaveProperty('defaultValue');
	});

	it('includes onSave when provided', () => {
		const onSave = () => {};
		const props: InlineEditProps = {
			onSave,
		};
		const result = buildHookOptions(props);
		expect(result).toHaveProperty('onSave');
		expect(result.onSave).toBe(onSave);
	});

	it('excludes onSave when undefined', () => {
		const props: InlineEditProps = {};
		const result = buildHookOptions(props);
		expect(result).not.toHaveProperty('onSave');
	});

	it('includes onCancel when provided', () => {
		const onCancel = () => {};
		const props: InlineEditProps = {
			onCancel,
		};
		const result = buildHookOptions(props);
		expect(result).toHaveProperty('onCancel');
		expect(result.onCancel).toBe(onCancel);
	});

	it('excludes onCancel when undefined', () => {
		const props: InlineEditProps = {};
		const result = buildHookOptions(props);
		expect(result).not.toHaveProperty('onCancel');
	});

	it('includes onChange when provided', () => {
		const onChange = () => {};
		const props: InlineEditProps = {
			onChange,
		};
		const result = buildHookOptions(props);
		expect(result).toHaveProperty('onChange');
		expect(result.onChange).toBe(onChange);
	});

	it('excludes onChange when undefined', () => {
		const props: InlineEditProps = {};
		const result = buildHookOptions(props);
		expect(result).not.toHaveProperty('onChange');
	});

	it('includes all options when all are provided', () => {
		const onSave = () => {};
		const onCancel = () => {};
		const onChange = () => {};
		const props: InlineEditProps = {
			value: 'Value',
			defaultValue: 'Default',
			onSave,
			onCancel,
			onChange,
		};
		const result = buildHookOptions(props);
		expect(result).toHaveProperty('value');
		expect(result).toHaveProperty('defaultValue');
		expect(result).toHaveProperty('onSave');
		expect(result).toHaveProperty('onCancel');
		expect(result).toHaveProperty('onChange');
	});
});

describe('getDisplayClasses', () => {
	it('should be a function', () => {
		expect(typeof getDisplayClasses).toBe('function');
	});

	it('returns classes for small size', () => {
		const result = getDisplayClasses('sm', false);
		expect(typeof result).toBe('string');
		expect(result.length).toBeGreaterThan(0);
		expect(result).toContain(DISPLAY_SIZE_CLASSES.sm);
	});

	it('returns classes for medium size', () => {
		const result = getDisplayClasses('md', false);
		expect(typeof result).toBe('string');
		expect(result.length).toBeGreaterThan(0);
		expect(result).toContain(DISPLAY_SIZE_CLASSES.md);
	});

	it('returns classes for large size', () => {
		const result = getDisplayClasses('lg', false);
		expect(typeof result).toBe('string');
		expect(result.length).toBeGreaterThan(0);
		expect(result).toContain(DISPLAY_SIZE_CLASSES.lg);
	});

	it('includes disabled classes when disabled', () => {
		const result = getDisplayClasses('md', true);
		expect(typeof result).toBe('string');
		expect(result).toContain('cursor-not-allowed');
		expect(result).toContain('opacity-disabled');
	});

	it('does not include disabled classes when not disabled', () => {
		const result = getDisplayClasses('md', false);
		expect(result).not.toContain('cursor-not-allowed');
		expect(result).not.toContain('opacity-disabled');
	});

	it('includes custom displayClassName', () => {
		const customClass = 'custom-display-class';
		const result = getDisplayClasses('md', false, customClass);
		expect(result).toContain(customClass);
	});

	it('merges custom className with base classes', () => {
		const customClass = 'my-custom-class';
		const result = getDisplayClasses('md', false, customClass);
		expect(result).toContain(customClass);
		expect(result).toContain(DISPLAY_BASE_CLASSES);
	});

	it('works without custom className', () => {
		const result = getDisplayClasses('md', false);
		expect(typeof result).toBe('string');
		expect(result.length).toBeGreaterThan(0);
	});
});

describe('getInputClasses', () => {
	it('should be a function', () => {
		expect(typeof getInputClasses).toBe('function');
	});

	it('returns classes for small size', () => {
		const result = getInputClasses('sm');
		expect(typeof result).toBe('string');
		expect(result.length).toBeGreaterThan(0);
	});

	it('returns classes for medium size', () => {
		const result = getInputClasses('md');
		expect(typeof result).toBe('string');
		expect(result.length).toBeGreaterThan(0);
	});

	it('returns classes for large size', () => {
		const result = getInputClasses('lg');
		expect(typeof result).toBe('string');
		expect(result.length).toBeGreaterThan(0);
	});

	it('includes custom inputClassName', () => {
		const customClass = 'custom-input-class';
		const result = getInputClasses('md', customClass);
		expect(result).toContain(customClass);
	});

	it('includes min-w-0 class', () => {
		const result = getInputClasses('md');
		expect(result).toContain('min-w-0');
	});

	it('merges custom className with base classes', () => {
		const customClass = 'my-custom-input';
		const result = getInputClasses('md', customClass);
		expect(result).toContain(customClass);
		expect(result).toContain('min-w-0');
	});
});

describe('computeValues', () => {
	it('should be a function', () => {
		expect(typeof computeValues).toBe('function');
	});

	it('computes displayValue from controlledValue', () => {
		const result = computeValues({
			controlledValue: 'Controlled',
			defaultValue: undefined,
			size: 'md',
			disabled: false,
			displayClassName: undefined,
			inputClassName: undefined,
		});

		expect(result.displayValue).toBe('Controlled');
		expect(result.isEmpty).toBe(false);
	});

	it('computes displayValue from defaultValue when controlledValue is undefined', () => {
		const result = computeValues({
			controlledValue: undefined,
			defaultValue: 'Default',
			size: 'md',
			disabled: false,
			displayClassName: undefined,
			inputClassName: undefined,
		});

		expect(result.displayValue).toBe('Default');
		expect(result.isEmpty).toBe(false);
	});

	it('computes empty string when both values are undefined', () => {
		const result = computeValues({
			controlledValue: undefined,
			defaultValue: undefined,
			size: 'md',
			disabled: false,
			displayClassName: undefined,
			inputClassName: undefined,
		});

		expect(result.displayValue).toBe('');
		expect(result.isEmpty).toBe(true);
	});

	it('prioritizes controlledValue over defaultValue', () => {
		const result = computeValues({
			controlledValue: 'Controlled',
			defaultValue: 'Default',
			size: 'md',
			disabled: false,
			displayClassName: undefined,
			inputClassName: undefined,
		});

		expect(result.displayValue).toBe('Controlled');
	});

	it('computes isEmpty correctly', () => {
		const emptyResult = computeValues({
			controlledValue: '',
			defaultValue: undefined,
			size: 'md',
			disabled: false,
			displayClassName: undefined,
			inputClassName: undefined,
		});

		expect(emptyResult.isEmpty).toBe(true);

		const nonEmptyResult = computeValues({
			controlledValue: 'Value',
			defaultValue: undefined,
			size: 'md',
			disabled: false,
			displayClassName: undefined,
			inputClassName: undefined,
		});

		expect(nonEmptyResult.isEmpty).toBe(false);
	});

	it('computes displayClasses', () => {
		const result = computeValues({
			controlledValue: 'Value',
			defaultValue: undefined,
			size: 'md',
			disabled: false,
			displayClassName: 'custom-display',
			inputClassName: undefined,
		});

		expect(result.displayClasses).toBeDefined();
		expect(typeof result.displayClasses).toBe('string');
		expect(result.displayClasses).toContain('custom-display');
	});

	it('computes inputClasses', () => {
		const result = computeValues({
			controlledValue: 'Value',
			defaultValue: undefined,
			size: 'md',
			disabled: false,
			displayClassName: undefined,
			inputClassName: 'custom-input',
		});

		expect(result.inputClasses).toBeDefined();
		expect(typeof result.inputClasses).toBe('string');
		expect(result.inputClasses).toContain('custom-input');
	});

	it('computes all values together', () => {
		const result = computeValues({
			controlledValue: 'Test Value',
			defaultValue: 'Default',
			size: 'lg',
			disabled: true,
			displayClassName: 'custom-display',
			inputClassName: 'custom-input',
		});

		expect(result.displayValue).toBe('Test Value');
		expect(result.isEmpty).toBe(false);
		expect(result.displayClasses).toContain('custom-display');
		expect(result.inputClasses).toContain('custom-input');
		expect(result.displayClasses).toContain('cursor-not-allowed');
	});
});
