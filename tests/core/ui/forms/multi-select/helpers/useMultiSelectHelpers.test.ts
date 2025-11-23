/**
 * useMultiSelectHelpers Tests
 *
 * Tests for multi-select helper functions:
 * - getOptionLabel
 * - findNextEnabledIndex
 */

import {
	findNextEnabledIndex,
	getOptionLabel,
} from '@core/ui/forms/multi-select/helpers/useMultiSelectHelpers';
import type { MultiSelectOption } from '@core/ui/forms/multi-select/MultiSelect';
import React from 'react';
import { describe, expect, it } from 'vitest';

describe('getOptionLabel', () => {
	it('returns string label as-is', () => {
		const option: MultiSelectOption = {
			value: '1',
			label: 'Option 1',
		};
		expect(getOptionLabel(option)).toBe('Option 1');
	});

	it('converts number label to string', () => {
		const option: MultiSelectOption = {
			value: '1',
			label: 42,
		};
		expect(getOptionLabel(option)).toBe('42');
	});

	it('converts boolean label to string', () => {
		const optionTrue: MultiSelectOption = {
			value: '1',
			label: true,
		};
		expect(getOptionLabel(optionTrue)).toBe('true');

		const optionFalse: MultiSelectOption = {
			value: '2',
			label: false,
		};
		expect(getOptionLabel(optionFalse)).toBe('false');
	});

	it('returns empty string for non-string/number/boolean labels', () => {
		const optionWithReactNode: MultiSelectOption = {
			value: '1',
			label: React.createElement('span', null, 'React Node'),
		};
		expect(getOptionLabel(optionWithReactNode)).toBe('');

		const optionWithNull: MultiSelectOption = {
			value: '1',
			label: null as unknown as React.ReactNode,
		};
		expect(getOptionLabel(optionWithNull)).toBe('');

		const optionWithUndefined: MultiSelectOption = {
			value: '1',
			label: undefined as unknown as React.ReactNode,
		};
		expect(getOptionLabel(optionWithUndefined)).toBe('');
	});

	it('handles empty string label', () => {
		const option: MultiSelectOption = {
			value: '1',
			label: '',
		};
		expect(getOptionLabel(option)).toBe('');
	});
});

describe('findNextEnabledIndex', () => {
	it('finds next enabled index moving forward', () => {
		const options: MultiSelectOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2', disabled: true },
			{ value: '3', label: 'Option 3' },
			{ value: '4', label: 'Option 4' },
		];

		expect(findNextEnabledIndex(options, 0, 1)).toBe(2);
		expect(findNextEnabledIndex(options, 2, 1)).toBe(3);
	});

	it('finds next enabled index moving backward', () => {
		const options: MultiSelectOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2', disabled: true },
			{ value: '3', label: 'Option 3' },
			{ value: '4', label: 'Option 4' },
		];

		expect(findNextEnabledIndex(options, 3, -1)).toBe(2);
		expect(findNextEnabledIndex(options, 2, -1)).toBe(0);
	});

	it('wraps around when moving forward from last index', () => {
		const options: MultiSelectOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2' },
			{ value: '3', label: 'Option 3' },
		];

		expect(findNextEnabledIndex(options, 2, 1)).toBe(0);
	});

	it('wraps around when moving backward from first index', () => {
		const options: MultiSelectOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2' },
			{ value: '3', label: 'Option 3' },
		];

		expect(findNextEnabledIndex(options, 0, -1)).toBe(2);
	});

	it('skips disabled options when moving forward', () => {
		const options: MultiSelectOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2', disabled: true },
			{ value: '3', label: 'Option 3', disabled: true },
			{ value: '4', label: 'Option 4' },
		];

		expect(findNextEnabledIndex(options, 0, 1)).toBe(3);
	});

	it('skips disabled options when moving backward', () => {
		const options: MultiSelectOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2', disabled: true },
			{ value: '3', label: 'Option 3', disabled: true },
			{ value: '4', label: 'Option 4' },
		];

		expect(findNextEnabledIndex(options, 3, -1)).toBe(0);
	});

	it('returns -1 when all options are disabled', () => {
		const options: MultiSelectOption[] = [
			{ value: '1', label: 'Option 1', disabled: true },
			{ value: '2', label: 'Option 2', disabled: true },
			{ value: '3', label: 'Option 3', disabled: true },
		];

		expect(findNextEnabledIndex(options, 0, 1)).toBe(-1);
		expect(findNextEnabledIndex(options, 1, -1)).toBe(-1);
	});

	it('handles empty options array', () => {
		const options: MultiSelectOption[] = [];
		expect(findNextEnabledIndex(options, 0, 1)).toBe(-1);
		expect(findNextEnabledIndex(options, 0, -1)).toBe(-1);
	});

	it('handles single enabled option', () => {
		const options: MultiSelectOption[] = [{ value: '1', label: 'Option 1' }];
		expect(findNextEnabledIndex(options, 0, 1)).toBe(0);
		expect(findNextEnabledIndex(options, 0, -1)).toBe(0);
	});

	it('handles all options enabled', () => {
		const options: MultiSelectOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2' },
			{ value: '3', label: 'Option 3' },
		];

		expect(findNextEnabledIndex(options, 0, 1)).toBe(1);
		expect(findNextEnabledIndex(options, 1, 1)).toBe(2);
		expect(findNextEnabledIndex(options, 2, 1)).toBe(0);
		expect(findNextEnabledIndex(options, 0, -1)).toBe(2);
		expect(findNextEnabledIndex(options, 2, -1)).toBe(1);
		expect(findNextEnabledIndex(options, 1, -1)).toBe(0);
	});

	it('handles starting from -1 index (before first)', () => {
		const options: MultiSelectOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2', disabled: true },
			{ value: '3', label: 'Option 3' },
		];

		expect(findNextEnabledIndex(options, -1, 1)).toBe(0);
	});

	it('handles starting from index beyond array length', () => {
		const options: MultiSelectOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2' },
		];

		// When startIndex is beyond array, modulo wraps it
		// For index 5 with direction 1: (5 + 1 + 2) % 2 = 0
		// For index 5 with direction -1: (5 + (-1) + 2) % 2 = 0
		expect(findNextEnabledIndex(options, 5, 1)).toBe(0);
		expect(findNextEnabledIndex(options, 5, -1)).toBe(0);
	});

	it('handles options with undefined disabled property', () => {
		const options: MultiSelectOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2' },
			{ value: '3', label: 'Option 3' },
		];

		expect(findNextEnabledIndex(options, 0, 1)).toBe(1);
		expect(findNextEnabledIndex(options, 1, 1)).toBe(2);
	});
});
