/**
 * AutocompleteComboboxParts Component Tests - Content Rendering
 *
 * Tests for icon and description rendering in options
 */

import type { AutocompleteOption } from '@domains/shared/components/autocomplete-combobox/AutocompleteCombobox';
import AutocompleteListbox from '@domains/shared/components/autocomplete-combobox/components/AutocompleteComboboxParts';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const APPLE_ICON_TEST_ID = 'apple-icon';

describe('AutocompleteListbox - Icon rendering', () => {
	it('renders option with icon', () => {
		const optionsWithIcon: AutocompleteOption[] = [
			{ value: '1', label: 'Apple', icon: <span data-testid={APPLE_ICON_TEST_ID}>🍎</span> },
		];

		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={optionsWithIcon}
				selectedValue={undefined}
				highlightedIndex={-1}
				isLoading={false}
				loadingMessage="Loading..."
				noOptionsMessage="No options"
				onSelect={vi.fn()}
			/>
		);

		const icon = screen.getByTestId(APPLE_ICON_TEST_ID);
		expect(icon).toBeInTheDocument();
		// Verify the option renders correctly with the icon
		// The icon wrapper with aria-hidden is tested indirectly through correct rendering
		const appleOption = screen.getByRole('option', { name: 'Apple' });
		expect(appleOption).toBeInTheDocument();
		expect(appleOption).toContainElement(icon);
	});

	it('renders option without icon when icon is not provided', () => {
		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={[{ value: '1', label: 'Apple' }]}
				selectedValue={undefined}
				highlightedIndex={-1}
				isLoading={false}
				loadingMessage="Loading..."
				noOptionsMessage="No options"
				onSelect={vi.fn()}
			/>
		);

		const appleOption = screen.getByRole('option', { name: 'Apple' });
		expect(appleOption).toBeInTheDocument();
		// Icon should not be present - verify by checking that test ID is not found
		expect(screen.queryByTestId(APPLE_ICON_TEST_ID)).not.toBeInTheDocument();
	});
});

describe('AutocompleteListbox - Description rendering', () => {
	it('renders option with description', () => {
		const optionsWithDescription: AutocompleteOption[] = [
			{ value: '1', label: 'Apple', description: 'Red fruit' },
		];

		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={optionsWithDescription}
				selectedValue={undefined}
				highlightedIndex={-1}
				isLoading={false}
				loadingMessage="Loading..."
				noOptionsMessage="No options"
				onSelect={vi.fn()}
			/>
		);

		expect(screen.getByText('Red fruit')).toBeInTheDocument();
		const description = screen.getByText('Red fruit');
		expect(description).toHaveClass('text-xs', 'text-muted-foreground');
	});

	it('renders option without description when description is not provided', () => {
		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={[{ value: '1', label: 'Apple' }]}
				selectedValue={undefined}
				highlightedIndex={-1}
				isLoading={false}
				loadingMessage="Loading..."
				noOptionsMessage="No options"
				onSelect={vi.fn()}
			/>
		);

		const appleOption = screen.getByRole('option', { name: 'Apple' });
		expect(appleOption).toBeInTheDocument();
		// Description should not be present
		expect(screen.queryByText(/red fruit/i)).not.toBeInTheDocument();
	});
});

describe('AutocompleteListbox - Combined content', () => {
	it('renders option with both icon and description', () => {
		const optionsWithBoth: AutocompleteOption[] = [
			{
				value: '1',
				label: 'Apple',
				icon: <span data-testid={APPLE_ICON_TEST_ID}>🍎</span>,
				description: 'Red fruit',
			},
		];

		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={optionsWithBoth}
				selectedValue={undefined}
				highlightedIndex={-1}
				isLoading={false}
				loadingMessage="Loading..."
				noOptionsMessage="No options"
				onSelect={vi.fn()}
			/>
		);

		expect(screen.getByTestId(APPLE_ICON_TEST_ID)).toBeInTheDocument();
		expect(screen.getByText('Red fruit')).toBeInTheDocument();
		expect(screen.getByText('Apple')).toBeInTheDocument();
	});
});
