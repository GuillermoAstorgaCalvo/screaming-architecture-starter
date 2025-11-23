/**
 * useComboboxHelpers Tests
 *
 * Tests for the combobox helper functions:
 * - getOptionLabel
 * - findNextEnabledIndex
 */

import type { ComboboxOption } from '@core/ui/forms/combobox/Combobox';
import {
	findNextEnabledIndex,
	getOptionLabel,
} from '@core/ui/forms/combobox/helpers/useComboboxHelpers';
import React from 'react';
import { describe, expect, it } from 'vitest';

describe('getOptionLabel', () => {
	it('returns string label as-is', () => {
		const option: ComboboxOption = { value: '1', label: 'Test Label' };
		expect(getOptionLabel(option)).toBe('Test Label');
	});

	it('converts number label to string', () => {
		const option: ComboboxOption = { value: '1', label: 123 };
		expect(getOptionLabel(option)).toBe('123');
	});

	it('converts boolean true to string', () => {
		const option: ComboboxOption = { value: '1', label: true };
		expect(getOptionLabel(option)).toBe('true');
	});

	it('converts boolean false to string', () => {
		const option: ComboboxOption = { value: '1', label: false };
		expect(getOptionLabel(option)).toBe('false');
	});

	it('returns empty string for ReactNode label', () => {
		// Use a React element as ReactNode
		const reactNode = React.createElement('span', null, 'Custom Label');
		const option: ComboboxOption = {
			value: '1',
			label: reactNode,
		};
		expect(getOptionLabel(option)).toBe('');
	});

	it('returns empty string for null label', () => {
		const option: ComboboxOption = { value: '1', label: null as unknown as string };
		expect(getOptionLabel(option)).toBe('');
	});

	it('returns empty string for undefined label', () => {
		const option: ComboboxOption = { value: '1', label: undefined as unknown as string };
		expect(getOptionLabel(option)).toBe('');
	});
});

describe('findNextEnabledIndex', () => {
	const enabledOptions: ComboboxOption[] = [
		{ value: '1', label: 'Option 1' },
		{ value: '2', label: 'Option 2' },
		{ value: '3', label: 'Option 3' },
		{ value: '4', label: 'Option 4' },
	];

	it('finds next enabled index when moving forward', () => {
		const result = findNextEnabledIndex(enabledOptions, 0, 1);
		expect(result).toBe(1);
	});

	it('finds previous enabled index when moving backward', () => {
		const result = findNextEnabledIndex(enabledOptions, 2, -1);
		expect(result).toBe(1);
	});

	it('wraps around to first option when at end and moving forward', () => {
		const result = findNextEnabledIndex(enabledOptions, enabledOptions.length - 1, 1);
		expect(result).toBe(0);
	});

	it('wraps around to last option when at start and moving backward', () => {
		const result = findNextEnabledIndex(enabledOptions, 0, -1);
		expect(result).toBe(enabledOptions.length - 1);
	});

	it('skips disabled options when moving forward', () => {
		const options: ComboboxOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2', disabled: true },
			{ value: '3', label: 'Option 3', disabled: true },
			{ value: '4', label: 'Option 4' },
		];

		const result = findNextEnabledIndex(options, 0, 1);
		expect(result).toBe(3);
	});

	it('skips disabled options when moving backward', () => {
		const options: ComboboxOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2', disabled: true },
			{ value: '3', label: 'Option 3', disabled: true },
			{ value: '4', label: 'Option 4' },
		];

		const result = findNextEnabledIndex(options, 3, -1);
		expect(result).toBe(0);
	});

	it('returns -1 when all options are disabled', () => {
		const options: ComboboxOption[] = [
			{ value: '1', label: 'Option 1', disabled: true },
			{ value: '2', label: 'Option 2', disabled: true },
			{ value: '3', label: 'Option 3', disabled: true },
		];

		const result = findNextEnabledIndex(options, 0, 1);
		expect(result).toBe(-1);
	});

	it('handles single enabled option', () => {
		const options: ComboboxOption[] = [
			{ value: '1', label: 'Option 1', disabled: true },
			{ value: '2', label: 'Option 2' },
			{ value: '3', label: 'Option 3', disabled: true },
		];

		const result = findNextEnabledIndex(options, 1, 1);
		expect(result).toBe(1); // Wraps around and finds itself
	});

	it('handles empty options array', () => {
		const result = findNextEnabledIndex([], 0, 1);
		expect(result).toBe(-1);
	});

	it('handles startIndex out of bounds', () => {
		// When startIndex is 10 and direction is 1, with 4 options:
		// (10 + 1 + 4) % 4 = 15 % 4 = 3
		const result = findNextEnabledIndex(enabledOptions, 10, 1);
		expect(result).toBe(3);
	});

	it('handles negative startIndex', () => {
		const result = findNextEnabledIndex(enabledOptions, -1, 1);
		expect(result).toBe(0);
	});

	it('finds next enabled when current index is disabled', () => {
		const options: ComboboxOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2', disabled: true },
			{ value: '3', label: 'Option 3' },
		];

		const result = findNextEnabledIndex(options, 1, 1);
		expect(result).toBe(2);
	});

	it('wraps correctly when all middle options are disabled', () => {
		const options: ComboboxOption[] = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2', disabled: true },
			{ value: '3', label: 'Option 3', disabled: true },
			{ value: '4', label: 'Option 4' },
		];

		const result = findNextEnabledIndex(options, 0, 1);
		expect(result).toBe(3);
	});
});
