/**
 * Tests for useAutocompleteHelpers helper functions
 *
 * Tests helper functions:
 * - getOptionLabel
 * - findNextEnabledIndex
 */

import type { AutocompleteOption } from '@core/ui/forms/autocomplete/Autocomplete';
import {
	findNextEnabledIndex,
	getOptionLabel,
} from '@core/ui/forms/autocomplete/helpers/useAutocompleteHelpers';
import { describe, expect, it } from 'vitest';

describe('getOptionLabel', () => {
	describe('string labels', () => {
		it('returns string label as-is', () => {
			const option: AutocompleteOption = {
				value: 'test',
				label: 'Test Label',
			};
			expect(getOptionLabel(option)).toBe('Test Label');
		});

		it('handles empty string label', () => {
			const option: AutocompleteOption = {
				value: 'test',
				label: '',
			};
			expect(getOptionLabel(option)).toBe('');
		});
	});

	describe('number labels', () => {
		it('converts number label to string', () => {
			const option: AutocompleteOption = {
				value: 'test',
				label: 42,
			};
			expect(getOptionLabel(option)).toBe('42');
		});

		it('handles zero as number label', () => {
			const option: AutocompleteOption = {
				value: 'test',
				label: 0,
			};
			expect(getOptionLabel(option)).toBe('0');
		});

		it('handles negative numbers as label', () => {
			const option: AutocompleteOption = {
				value: 'test',
				label: -42,
			};
			expect(getOptionLabel(option)).toBe('-42');
		});

		it('handles decimal numbers as label', () => {
			const option: AutocompleteOption = {
				value: 'test',
				label: 3.14,
			};
			expect(getOptionLabel(option)).toBe('3.14');
		});
	});

	describe('boolean labels', () => {
		it('converts boolean true label to string', () => {
			const option: AutocompleteOption = {
				value: 'test',
				label: true,
			};
			expect(getOptionLabel(option)).toBe('true');
		});

		it('converts boolean false label to string', () => {
			const option: AutocompleteOption = {
				value: 'test',
				label: false,
			};
			expect(getOptionLabel(option)).toBe('false');
		});
	});

	describe('invalid labels', () => {
		it('returns empty string for ReactNode label (non-string, non-number, non-boolean)', () => {
			// Using an object to represent a ReactNode (JSX would be converted to an object anyway)
			const reactNode = { type: 'span', props: { children: 'React Node' } };
			const option = {
				value: 'test',
				label: reactNode,
			} as AutocompleteOption;
			expect(getOptionLabel(option)).toBe('');
		});

		it('returns empty string for null label', () => {
			const option: AutocompleteOption = {
				value: 'test',
				label: null,
			};
			expect(getOptionLabel(option)).toBe('');
		});

		it('returns empty string for undefined label', () => {
			const option: AutocompleteOption = {
				value: 'test',
				label: undefined,
			};
			expect(getOptionLabel(option)).toBe('');
		});
	});
});

describe('findNextEnabledIndex', () => {
	describe('basic navigation', () => {
		it('finds next enabled index forward from start', () => {
			const options: AutocompleteOption[] = [
				{ value: '1', label: 'Option 1' },
				{ value: '2', label: 'Option 2' },
				{ value: '3', label: 'Option 3' },
			];
			expect(findNextEnabledIndex(options, 0, 1)).toBe(1);
		});

		it('finds next enabled index backward from start', () => {
			const options: AutocompleteOption[] = [
				{ value: '1', label: 'Option 1' },
				{ value: '2', label: 'Option 2' },
				{ value: '3', label: 'Option 3' },
			];
			expect(findNextEnabledIndex(options, 0, -1)).toBe(2);
		});

		it('handles starting from middle index', () => {
			const options: AutocompleteOption[] = [
				{ value: '1', label: 'Option 1' },
				{ value: '2', label: 'Option 2' },
				{ value: '3', label: 'Option 3' },
				{ value: '4', label: 'Option 4' },
				{ value: '5', label: 'Option 5' },
			];
			expect(findNextEnabledIndex(options, 2, 1)).toBe(3);
			expect(findNextEnabledIndex(options, 2, -1)).toBe(1);
		});
	});

	describe('disabled options', () => {
		it('skips disabled options when moving forward', () => {
			const options: AutocompleteOption[] = [
				{ value: '1', label: 'Option 1' },
				{ value: '2', label: 'Option 2', disabled: true },
				{ value: '3', label: 'Option 3' },
			];
			expect(findNextEnabledIndex(options, 0, 1)).toBe(2);
		});

		it('skips disabled options when moving backward', () => {
			const options: AutocompleteOption[] = [
				{ value: '1', label: 'Option 1' },
				{ value: '2', label: 'Option 2', disabled: true },
				{ value: '3', label: 'Option 3' },
			];
			expect(findNextEnabledIndex(options, 2, -1)).toBe(0);
		});

		it('skips multiple disabled options when moving forward', () => {
			const options: AutocompleteOption[] = [
				{ value: '1', label: 'Option 1' },
				{ value: '2', label: 'Option 2', disabled: true },
				{ value: '3', label: 'Option 3', disabled: true },
				{ value: '4', label: 'Option 4' },
			];
			expect(findNextEnabledIndex(options, 0, 1)).toBe(3);
		});

		it('skips multiple disabled options when moving backward', () => {
			const options: AutocompleteOption[] = [
				{ value: '1', label: 'Option 1' },
				{ value: '2', label: 'Option 2', disabled: true },
				{ value: '3', label: 'Option 3', disabled: true },
				{ value: '4', label: 'Option 4' },
			];
			expect(findNextEnabledIndex(options, 3, -1)).toBe(0);
		});

		it('handles all options enabled except starting position', () => {
			const options: AutocompleteOption[] = [
				{ value: '1', label: 'Option 1', disabled: true },
				{ value: '2', label: 'Option 2' },
				{ value: '3', label: 'Option 3' },
			];
			expect(findNextEnabledIndex(options, 0, 1)).toBe(1);
			expect(findNextEnabledIndex(options, 0, -1)).toBe(2);
		});
	});

	describe('wrapping behavior', () => {
		it('wraps around to beginning when moving forward from end', () => {
			const options: AutocompleteOption[] = [
				{ value: '1', label: 'Option 1' },
				{ value: '2', label: 'Option 2' },
				{ value: '3', label: 'Option 3' },
			];
			expect(findNextEnabledIndex(options, 2, 1)).toBe(0);
		});

		it('wraps around to end when moving backward from start', () => {
			const options: AutocompleteOption[] = [
				{ value: '1', label: 'Option 1' },
				{ value: '2', label: 'Option 2' },
				{ value: '3', label: 'Option 3' },
			];
			expect(findNextEnabledIndex(options, 0, -1)).toBe(2);
		});

		it('wraps around and skips disabled options', () => {
			const options: AutocompleteOption[] = [
				{ value: '1', label: 'Option 1' },
				{ value: '2', label: 'Option 2', disabled: true },
				{ value: '3', label: 'Option 3' },
			];
			// From index 2, moving forward should wrap to 0
			expect(findNextEnabledIndex(options, 2, 1)).toBe(0);
			// From index 0, moving backward should wrap to 2 (skipping 1)
			expect(findNextEnabledIndex(options, 0, -1)).toBe(2);
		});

		it('handles consecutive disabled options at boundaries', () => {
			const options: AutocompleteOption[] = [
				{ value: '1', label: 'Option 1', disabled: true },
				{ value: '2', label: 'Option 2', disabled: true },
				{ value: '3', label: 'Option 3' },
				{ value: '4', label: 'Option 4', disabled: true },
				{ value: '5', label: 'Option 5', disabled: true },
			];
			// From index 2, forward should wrap to 2 (itself, since 3 and 4 are disabled)
			expect(findNextEnabledIndex(options, 2, 1)).toBe(2);
			// From index 2, backward should wrap to 2 (itself)
			expect(findNextEnabledIndex(options, 2, -1)).toBe(2);
		});
	});

	describe('edge cases', () => {
		it('returns -1 when all options are disabled', () => {
			const options: AutocompleteOption[] = [
				{ value: '1', label: 'Option 1', disabled: true },
				{ value: '2', label: 'Option 2', disabled: true },
				{ value: '3', label: 'Option 3', disabled: true },
			];
			expect(findNextEnabledIndex(options, 0, 1)).toBe(-1);
			expect(findNextEnabledIndex(options, 1, -1)).toBe(-1);
		});

		it('returns -1 for empty array', () => {
			const options: AutocompleteOption[] = [];
			expect(findNextEnabledIndex(options, 0, 1)).toBe(-1);
			expect(findNextEnabledIndex(options, 0, -1)).toBe(-1);
		});

		it('handles single enabled option', () => {
			const options: AutocompleteOption[] = [{ value: '1', label: 'Option 1' }];
			expect(findNextEnabledIndex(options, 0, 1)).toBe(0);
			expect(findNextEnabledIndex(options, 0, -1)).toBe(0);
		});

		it('handles single disabled option', () => {
			const options: AutocompleteOption[] = [{ value: '1', label: 'Option 1', disabled: true }];
			expect(findNextEnabledIndex(options, 0, 1)).toBe(-1);
			expect(findNextEnabledIndex(options, 0, -1)).toBe(-1);
		});
	});
});
