/**
 * useSearchInputProps.extract Tests
 *
 * Tests for the extractSearchInputProps function:
 * - Prop extraction
 * - Default values
 * - Rest props handling
 */

import { extractSearchInputProps } from '@core/ui/forms/search-input/hooks/useSearchInputProps.extract';
import type { SearchInputProps } from '@src-types/ui/forms-inputs';
import { describe, expect, it } from 'vitest';

describe('extractSearchInputProps - Basic Extraction', () => {
	it('extracts all props correctly', () => {
		const props: SearchInputProps = {
			label: 'Search',
			error: 'Error message',
			helperText: 'Helper text',
			size: 'lg',
			fullWidth: true,
			inputId: 'custom-id',
			className: 'custom-class',
			disabled: true,
			required: true,
			value: 'test value',
			onChange: () => {},
			showClearButton: true,
			placeholder: 'Enter search',
		};

		const extracted = extractSearchInputProps(props);

		expect(extracted.label).toBe('Search');
		expect(extracted.error).toBe('Error message');
		expect(extracted.helperText).toBe('Helper text');
		expect(extracted.size).toBe('lg');
		expect(extracted.fullWidth).toBe(true);
		expect(extracted.inputId).toBe('custom-id');
		expect(extracted.className).toBe('custom-class');
		expect(extracted.disabled).toBe(true);
		expect(extracted.required).toBe(true);
		expect(extracted.value).toBe('test value');
		expect(extracted.onChange).toBeDefined();
		expect(extracted.showClearButtonProp).toBe(true);
	});

	it('uses default size when not provided', () => {
		const props: SearchInputProps = {
			label: 'Search',
		};

		const extracted = extractSearchInputProps(props);

		expect(extracted.size).toBe('md');
	});

	it('uses default fullWidth when not provided', () => {
		const props: SearchInputProps = {
			label: 'Search',
		};

		const extracted = extractSearchInputProps(props);

		expect(extracted.fullWidth).toBe(false);
	});

	it('handles undefined optional props', () => {
		const props: SearchInputProps = {
			size: 'md',
		};

		const extracted = extractSearchInputProps(props);

		expect(extracted.label).toBeUndefined();
		expect(extracted.error).toBeUndefined();
		expect(extracted.helperText).toBeUndefined();
		expect(extracted.inputId).toBeUndefined();
		expect(extracted.className).toBeUndefined();
		expect(extracted.disabled).toBeUndefined();
		expect(extracted.required).toBeUndefined();
		expect(extracted.value).toBeUndefined();
		expect(extracted.defaultValue).toBeUndefined();
		expect(extracted.onChange).toBeUndefined();
		expect(extracted.showClearButtonProp).toBeUndefined();
	});
});

describe('extractSearchInputProps - Value Handling', () => {
	it('extracts controlled value', () => {
		const props: SearchInputProps = {
			value: 'controlled value',
			size: 'md',
		};

		const extracted = extractSearchInputProps(props);

		expect(extracted.value).toBe('controlled value');
		expect(extracted.defaultValue).toBeUndefined();
	});

	it('extracts defaultValue', () => {
		const props: SearchInputProps = {
			defaultValue: 'default value',
			size: 'md',
		};

		const extracted = extractSearchInputProps(props);

		expect(extracted.defaultValue).toBe('default value');
		expect(extracted.value).toBeUndefined();
	});

	it('handles both value and defaultValue', () => {
		const props: SearchInputProps = {
			value: 'controlled',
			defaultValue: 'default',
			size: 'md',
		};

		const extracted = extractSearchInputProps(props);

		expect(extracted.value).toBe('controlled');
		expect(extracted.defaultValue).toBe('default');
	});
});

describe('extractSearchInputProps - Rest Props', () => {
	it('includes rest props in rest object', () => {
		const props: SearchInputProps = {
			label: 'Search',
			placeholder: 'Enter search',
			'data-testid': 'search-input',
			autoFocus: true,
			size: 'md',
		} as any;

		const extracted = extractSearchInputProps(props);

		expect(extracted.rest.placeholder).toBe('Enter search');
		expect((extracted.rest as any)['data-testid']).toBe('search-input');
		expect(extracted.rest.autoFocus).toBe(true);
	});

	it('excludes controlled props from rest', () => {
		const props: SearchInputProps = {
			label: 'Search',
			size: 'md',
			disabled: true,
			required: true,
			value: 'test',
			className: 'custom',
			inputId: 'id',
		};

		const extracted = extractSearchInputProps(props);

		expect(extracted.rest).not.toHaveProperty('size');
		expect(extracted.rest).not.toHaveProperty('id');
		expect(extracted.rest).not.toHaveProperty('className');
		expect(extracted.rest).not.toHaveProperty('disabled');
		expect(extracted.rest).not.toHaveProperty('required');
		expect(extracted.rest).not.toHaveProperty('type');
		expect(extracted.rest).not.toHaveProperty('value');
		expect(extracted.rest).not.toHaveProperty('defaultValue');
		expect(extracted.rest).not.toHaveProperty('onChange');
		expect(extracted.rest).not.toHaveProperty('aria-invalid');
		expect(extracted.rest).not.toHaveProperty('aria-describedby');
	});

	it('handles empty rest props', () => {
		const props: SearchInputProps = {
			label: 'Search',
			size: 'md',
		};

		const extracted = extractSearchInputProps(props);

		expect(extracted.rest).toBeDefined();
		expect(typeof extracted.rest).toBe('object');
	});

	it('preserves all HTML input attributes in rest', () => {
		const props: SearchInputProps = {
			label: 'Search',
			placeholder: 'Enter search',
			maxLength: 100,
			minLength: 1,
			pattern: '[a-z]+',
			readOnly: true,
			autoComplete: 'off',
			autoFocus: true,
			tabIndex: 0,
			'aria-label': 'Search input',
			'data-testid': 'search',
			size: 'md',
		} as any;

		const extracted = extractSearchInputProps(props);

		expect(extracted.rest.placeholder).toBe('Enter search');
		expect(extracted.rest.maxLength).toBe(100);
		expect(extracted.rest.minLength).toBe(1);
		expect(extracted.rest.pattern).toBe('[a-z]+');
		expect(extracted.rest.readOnly).toBe(true);
		expect(extracted.rest.autoComplete).toBe('off');
		expect(extracted.rest.autoFocus).toBe(true);
		expect(extracted.rest.tabIndex).toBe(0);
		expect(extracted.rest['aria-label']).toBe('Search input');
		expect((extracted.rest as any)['data-testid']).toBe('search');
	});
});

describe('extractSearchInputProps - ShowClearButton', () => {
	it('extracts showClearButton prop', () => {
		const props: SearchInputProps = {
			showClearButton: true,
			size: 'md',
		};

		const extracted = extractSearchInputProps(props);

		expect(extracted.showClearButtonProp).toBe(true);
	});

	it('extracts showClearButton as false', () => {
		const props: SearchInputProps = {
			showClearButton: false,
			size: 'md',
		};

		const extracted = extractSearchInputProps(props);

		expect(extracted.showClearButtonProp).toBe(false);
	});

	it('handles undefined showClearButton', () => {
		const props: SearchInputProps = {
			size: 'md',
		};

		const extracted = extractSearchInputProps(props);

		expect(extracted.showClearButtonProp).toBeUndefined();
	});
});

describe('extractSearchInputProps - Edge Cases', () => {
	it('handles minimal props', () => {
		const props: SearchInputProps = {
			size: 'md',
		};

		const extracted = extractSearchInputProps(props);

		expect(extracted.size).toBe('md');
		expect(extracted.fullWidth).toBe(false);
		expect(extracted.rest).toBeDefined();
	});

	it('handles all props with empty strings', () => {
		const props: SearchInputProps = {
			label: '',
			error: '',
			helperText: '',
			value: '',
			inputId: '',
			className: '',
			size: 'md',
		};

		const extracted = extractSearchInputProps(props);

		expect(extracted.label).toBe('');
		expect(extracted.error).toBe('');
		expect(extracted.helperText).toBe('');
		expect(extracted.value).toBe('');
		expect(extracted.inputId).toBe('');
		expect(extracted.className).toBe('');
	});

	it('preserves readonly nature of props', () => {
		const props: Readonly<SearchInputProps> = {
			label: 'Search',
			size: 'md',
		};

		const extracted = extractSearchInputProps(props);

		expect(extracted.label).toBe('Search');
		expect(extracted.size).toBe('md');
	});
});
