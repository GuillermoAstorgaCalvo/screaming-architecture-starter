/**
 * AutocompleteComboboxParts Component Tests - Edge Cases
 *
 * Tests for edge cases, boundary conditions, and component structure
 */

import type { AutocompleteOption } from '@domains/shared/components/autocomplete-combobox/AutocompleteCombobox';
import AutocompleteListbox from '@domains/shared/components/autocomplete-combobox/components/AutocompleteComboboxParts';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const mockOptions: AutocompleteOption[] = [
	{ value: '1', label: 'Apple' },
	{ value: '2', label: 'Banana' },
	{ value: '3', label: 'Cherry' },
	{ value: '4', label: 'Date', disabled: true },
	{ value: '5', label: 'Elderberry' },
];

const ARIA_SELECTED = 'aria-selected';
const ONLY_OPTION_LABEL = 'Only Option';

describe('AutocompleteListbox - Option IDs', () => {
	it('generates correct option IDs', () => {
		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={mockOptions}
				selectedValue={undefined}
				highlightedIndex={-1}
				isLoading={false}
				loadingMessage="Loading..."
				noOptionsMessage="No options"
				onSelect={vi.fn()}
			/>
		);

		const appleOption = screen.getByRole('option', { name: 'Apple' });
		expect(appleOption).toHaveAttribute('id', 'test-listbox-option-1');

		const bananaOption = screen.getByRole('option', { name: 'Banana' });
		expect(bananaOption).toHaveAttribute('id', 'test-listbox-option-2');
	});
});

describe('AutocompleteListbox - Component Composition', () => {
	it('renders options in ul with correct structure', () => {
		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={mockOptions}
				selectedValue={undefined}
				highlightedIndex={-1}
				isLoading={false}
				loadingMessage="Loading..."
				noOptionsMessage="No options"
				onSelect={vi.fn()}
			/>
		);

		const listbox = screen.getByRole('listbox');
		expect(listbox).toBeInTheDocument();

		// Check that list items are rendered (confirms ul structure exists)
		const listItems = screen.getAllByRole('none');
		expect(listItems).toHaveLength(mockOptions.length);

		// Verify that options are accessible (indirectly confirms ul structure)
		for (const option of mockOptions) {
			expect(screen.getByRole('option', { name: option.label })).toBeInTheDocument();
		}
	});

	it('renders each option in a list item', () => {
		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={mockOptions}
				selectedValue={undefined}
				highlightedIndex={-1}
				isLoading={false}
				loadingMessage="Loading..."
				noOptionsMessage="No options"
				onSelect={vi.fn()}
			/>
		);

		const listItems = screen.getAllByRole('none');
		expect(listItems).toHaveLength(mockOptions.length);

		for (const item of listItems) {
			expect(item).toHaveAttribute('role', 'none');
		}
	});
});

describe('AutocompleteListbox - Option keys', () => {
	it('uses option value as key for list items', () => {
		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={mockOptions}
				selectedValue={undefined}
				highlightedIndex={-1}
				isLoading={false}
				loadingMessage="Loading..."
				noOptionsMessage="No options"
				onSelect={vi.fn()}
			/>
		);

		// Verify that each option is rendered with its correct value
		for (const option of mockOptions) {
			const optionButton = screen.getByRole('option', { name: option.label });
			expect(optionButton).toHaveAttribute('id', `test-listbox-option-${option.value}`);
		}
	});
});

describe('AutocompleteListbox - Invalid values', () => {
	it('handles selectedValue that does not match any option', () => {
		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={mockOptions}
				selectedValue="non-existent"
				highlightedIndex={-1}
				isLoading={false}
				loadingMessage="Loading..."
				noOptionsMessage="No options"
				onSelect={vi.fn()}
			/>
		);

		// All options should have aria-selected="false"
		const options = screen.getAllByRole('option');
		for (const option of options) {
			expect(option).toHaveAttribute(ARIA_SELECTED, 'false');
		}
	});
});

describe('AutocompleteListbox - Boundary conditions', () => {
	it('handles highlightedIndex out of bounds', () => {
		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={mockOptions}
				selectedValue={undefined}
				highlightedIndex={100}
				isLoading={false}
				loadingMessage="Loading..."
				noOptionsMessage="No options"
				onSelect={vi.fn()}
			/>
		);

		// No option should be highlighted
		const options = screen.getAllByRole('option');
		for (const option of options) {
			expect(option).not.toHaveClass('bg-muted');
		}
	});

	it('handles negative highlightedIndex', () => {
		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={mockOptions}
				selectedValue={undefined}
				highlightedIndex={-1}
				isLoading={false}
				loadingMessage="Loading..."
				noOptionsMessage="No options"
				onSelect={vi.fn()}
			/>
		);

		// No option should be highlighted
		const options = screen.getAllByRole('option');
		for (const option of options) {
			expect(option).not.toHaveClass('bg-muted');
		}
	});
});

describe('AutocompleteListbox - Single option', () => {
	it('handles single option', () => {
		const singleOption: AutocompleteOption[] = [{ value: '1', label: ONLY_OPTION_LABEL }];

		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={singleOption}
				selectedValue={undefined}
				highlightedIndex={0}
				isLoading={false}
				loadingMessage="Loading..."
				noOptionsMessage="No options"
				onSelect={vi.fn()}
			/>
		);

		expect(screen.getByText(ONLY_OPTION_LABEL)).toBeInTheDocument();
		const option = screen.getByRole('option', { name: ONLY_OPTION_LABEL });
		expect(option).toHaveClass('bg-muted', 'text-foreground');
	});
});
