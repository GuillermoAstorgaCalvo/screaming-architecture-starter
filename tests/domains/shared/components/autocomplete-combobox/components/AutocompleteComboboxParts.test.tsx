/**
 * AutocompleteComboboxParts Component Tests - Core Functionality
 *
 * Tests for the AutocompleteListbox component:
 * - Component rendering
 * - Loading state
 * - No options state
 * - Event handlers (onMouseDown, onClick)
 * - State management (selected, highlighted, disabled)
 */

import type { AutocompleteOption } from '@domains/shared/components/autocomplete-combobox/AutocompleteCombobox';
import AutocompleteListbox from '@domains/shared/components/autocomplete-combobox/components/AutocompleteComboboxParts';
import { fireEvent, screen } from '@testing-library/react';
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

describe('AutocompleteListbox - Basic rendering', () => {
	it('renders listbox with options', () => {
		const onSelect = vi.fn();

		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={mockOptions}
				selectedValue={undefined}
				highlightedIndex={-1}
				isLoading={false}
				loadingMessage="Loading..."
				noOptionsMessage="No options"
				onSelect={onSelect}
			/>
		);

		const listbox = screen.getByRole('listbox');
		expect(listbox).toBeInTheDocument();
		expect(listbox).toHaveAttribute('id', 'test-listbox');
	});

	it('renders all options in list', () => {
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

		expect(screen.getByText('Apple')).toBeInTheDocument();
		expect(screen.getByText('Banana')).toBeInTheDocument();
		expect(screen.getByText('Cherry')).toBeInTheDocument();
		expect(screen.getByText('Date')).toBeInTheDocument();
		expect(screen.getByText('Elderberry')).toBeInTheDocument();
	});
});

describe('AutocompleteListbox - Label ID handling', () => {
	it('renders listbox with labelId', () => {
		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				labelId="test-label"
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
		expect(listbox).toHaveAttribute('aria-labelledby', 'test-label');
	});

	it('renders listbox without labelId', () => {
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
		expect(listbox).not.toHaveAttribute('aria-labelledby');
	});
});

describe('AutocompleteListbox - Loading State', () => {
	it('renders loading message when isLoading is true', () => {
		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={mockOptions}
				selectedValue={undefined}
				highlightedIndex={-1}
				isLoading={true}
				loadingMessage="Loading options..."
				noOptionsMessage="No options"
				onSelect={vi.fn()}
			/>
		);

		expect(screen.getByText('Loading options...')).toBeInTheDocument();
		expect(screen.queryByText('Apple')).not.toBeInTheDocument();
	});

	it('renders loading message even with empty options array', () => {
		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={[]}
				selectedValue={undefined}
				highlightedIndex={-1}
				isLoading={true}
				loadingMessage="Fetching data..."
				noOptionsMessage="No options"
				onSelect={vi.fn()}
			/>
		);

		expect(screen.getByText('Fetching data...')).toBeInTheDocument();
	});
});

describe('AutocompleteListbox - No Options State', () => {
	it('renders no options message when options array is empty and not loading', () => {
		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={[]}
				selectedValue={undefined}
				highlightedIndex={-1}
				isLoading={false}
				loadingMessage="Loading..."
				noOptionsMessage="No matches found"
				onSelect={vi.fn()}
			/>
		);

		expect(screen.getByText('No matches found')).toBeInTheDocument();
		expect(screen.queryByRole('option')).not.toBeInTheDocument();
	});

	it('renders custom no options message', () => {
		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={[]}
				selectedValue={undefined}
				highlightedIndex={-1}
				isLoading={false}
				loadingMessage="Loading..."
				noOptionsMessage="Custom no options text"
				onSelect={vi.fn()}
			/>
		);

		expect(screen.getByText('Custom no options text')).toBeInTheDocument();
	});
});

describe('AutocompleteListbox - Click selection', () => {
	it('calls onSelect when option is clicked', () => {
		const onSelect = vi.fn();

		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={mockOptions}
				selectedValue={undefined}
				highlightedIndex={-1}
				isLoading={false}
				loadingMessage="Loading..."
				noOptionsMessage="No options"
				onSelect={onSelect}
			/>
		);

		const appleOption = screen.getByText('Apple');
		fireEvent.click(appleOption);

		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(onSelect).toHaveBeenCalledWith(mockOptions[0]);
	});

	it('calls onSelect with correct option for different options', () => {
		const onSelect = vi.fn();

		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={mockOptions}
				selectedValue={undefined}
				highlightedIndex={-1}
				isLoading={false}
				loadingMessage="Loading..."
				noOptionsMessage="No options"
				onSelect={onSelect}
			/>
		);

		const bananaOption = screen.getByText('Banana');
		fireEvent.click(bananaOption);

		expect(onSelect).toHaveBeenCalledWith(mockOptions[1]);
	});
});

describe('AutocompleteListbox - MouseDown event handling', () => {
	it('prevents default on mouseDown event', () => {
		const onSelect = vi.fn();

		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={mockOptions}
				selectedValue={undefined}
				highlightedIndex={-1}
				isLoading={false}
				loadingMessage="Loading..."
				noOptionsMessage="No options"
				onSelect={onSelect}
			/>
		);

		const appleOption = screen.getByRole('option', { name: 'Apple' });
		expect(appleOption).toBeInTheDocument();

		// Create a real MouseEvent to test preventDefault
		const mouseDownEvent = new MouseEvent('mousedown', {
			bubbles: true,
			cancelable: true,
		});

		// Spy on preventDefault before it's called
		const preventDefaultSpy = vi.spyOn(mouseDownEvent, 'preventDefault');

		// Dispatch the event directly to the element
		// This will trigger React's event handler which calls preventDefault
		appleOption.dispatchEvent(mouseDownEvent);

		// Verify preventDefault was called
		// Note: React's synthetic event system may wrap this, but the handler
		// in the component (line 94) calls preventDefault on the event
		expect(preventDefaultSpy).toHaveBeenCalled();
	});
});

describe('AutocompleteListbox - Selected state', () => {
	it('marks option as selected when selectedValue matches', () => {
		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={mockOptions}
				selectedValue="1"
				highlightedIndex={-1}
				isLoading={false}
				loadingMessage="Loading..."
				noOptionsMessage="No options"
				onSelect={vi.fn()}
			/>
		);

		const appleOption = screen.getByRole('option', { name: 'Apple' });
		expect(appleOption).toHaveAttribute(ARIA_SELECTED, 'true');
		expect(appleOption).toHaveClass('font-semibold');
	});

	it('does not mark option as selected when selectedValue does not match', () => {
		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={mockOptions}
				selectedValue="2"
				highlightedIndex={-1}
				isLoading={false}
				loadingMessage="Loading..."
				noOptionsMessage="No options"
				onSelect={vi.fn()}
			/>
		);

		const appleOption = screen.getByRole('option', { name: 'Apple' });
		expect(appleOption).toHaveAttribute(ARIA_SELECTED, 'false');
		expect(appleOption).not.toHaveClass('font-semibold');
	});
});

describe('AutocompleteListbox - Highlighted state', () => {
	it('highlights option at highlightedIndex', () => {
		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={mockOptions}
				selectedValue={undefined}
				highlightedIndex={1}
				isLoading={false}
				loadingMessage="Loading..."
				noOptionsMessage="No options"
				onSelect={vi.fn()}
			/>
		);

		const bananaOption = screen.getByRole('option', { name: 'Banana' });
		expect(bananaOption).toHaveClass('bg-muted', 'text-foreground');
	});

	it('does not highlight option when highlightedIndex does not match', () => {
		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={mockOptions}
				selectedValue={undefined}
				highlightedIndex={0}
				isLoading={false}
				loadingMessage="Loading..."
				noOptionsMessage="No options"
				onSelect={vi.fn()}
			/>
		);

		const bananaOption = screen.getByRole('option', { name: 'Banana' });
		expect(bananaOption).not.toHaveClass('bg-muted');
	});
});

describe('AutocompleteListbox - Disabled state', () => {
	it('renders disabled option correctly', () => {
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

		const dateOption = screen.getByRole('option', { name: 'Date' });
		expect(dateOption).toBeDisabled();
		expect(dateOption).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-60');
	});

	it('does not call onSelect when disabled option is clicked', () => {
		const onSelect = vi.fn();

		renderWithProviders(
			<AutocompleteListbox
				id="test-listbox"
				options={mockOptions}
				selectedValue={undefined}
				highlightedIndex={-1}
				isLoading={false}
				loadingMessage="Loading..."
				noOptionsMessage="No options"
				onSelect={onSelect}
			/>
		);

		const dateOption = screen.getByText('Date');
		fireEvent.click(dateOption);

		expect(onSelect).not.toHaveBeenCalled();
	});
});
