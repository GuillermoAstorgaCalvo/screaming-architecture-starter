/**
 * AutocompleteCombobox Component Tests
 *
 * Tests for the AutocompleteCombobox component:
 * - Rendering
 * - Value selection
 * - Input handling
 * - Options filtering
 * - Keyboard navigation
 * - Accessibility
 */

import AutocompleteCombobox, {
	type AutocompleteOption,
} from '@domains/shared/components/autocomplete-combobox/AutocompleteCombobox';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const mockOptions: AutocompleteOption[] = [
	{ value: '1', label: 'Apple' },
	{ value: '2', label: 'Banana' },
	{ value: '3', label: 'Cherry' },
	{ value: '4', label: 'Date', disabled: true },
	{ value: '5', label: 'Elderberry' },
];

// Helper functions
const getComboboxInput = () => screen.getByRole('combobox');

const openListbox = async (input: HTMLElement) => {
	fireEvent.focus(input);
	await waitFor(() => {
		expect(screen.getByRole('listbox')).toBeInTheDocument();
	});
};

const changeInputValue = (input: HTMLElement, value: string) => {
	fireEvent.change(input, { target: { value } });
};

describe('AutocompleteCombobox - Rendering', () => {
	it('renders with options', () => {
		renderWithProviders(<AutocompleteCombobox options={mockOptions} />);

		const input = getComboboxInput();
		expect(input).toBeInTheDocument();
	});

	it('renders with label', () => {
		renderWithProviders(<AutocompleteCombobox options={mockOptions} label="Fruit" />);

		expect(screen.getByText('Fruit')).toBeInTheDocument();
	});

	it('renders with placeholder', () => {
		renderWithProviders(
			<AutocompleteCombobox options={mockOptions} placeholder="Select a fruit" />
		);

		const input = getComboboxInput();
		expect(input).toHaveAttribute('placeholder', 'Select a fruit');
	});

	it('renders with helper text', () => {
		renderWithProviders(
			<AutocompleteCombobox options={mockOptions} helperText="Choose your favorite fruit" />
		);

		expect(screen.getByText('Choose your favorite fruit')).toBeInTheDocument();
	});

	it('renders with error', () => {
		renderWithProviders(<AutocompleteCombobox options={mockOptions} error="Required field" />);

		expect(screen.getByText('Required field')).toBeInTheDocument();
		const input = getComboboxInput();
		expect(input).toHaveAttribute('aria-invalid', 'true');
	});

	it('renders disabled state', () => {
		renderWithProviders(<AutocompleteCombobox options={mockOptions} disabled />);

		const input = getComboboxInput();
		expect(input).toBeDisabled();
	});

	it('renders required state', () => {
		renderWithProviders(<AutocompleteCombobox options={mockOptions} required />);

		const input = getComboboxInput();
		expect(input).toBeRequired();
	});

	it('renders with custom className', () => {
		renderWithProviders(<AutocompleteCombobox options={mockOptions} className="custom-class" />);

		const input = getComboboxInput();
		expect(input).toBeInTheDocument();
	});
});

describe('AutocompleteCombobox - Value Selection', () => {
	it('displays selected value', () => {
		renderWithProviders(<AutocompleteCombobox options={mockOptions} value="1" />);

		const input = getComboboxInput();
		expect(input).toHaveValue('Apple');
	});

	it('calls onValueChange when option is selected', async () => {
		const onValueChange = vi.fn();
		const onOptionSelect = vi.fn();

		renderWithProviders(
			<AutocompleteCombobox
				options={mockOptions}
				onValueChange={onValueChange}
				onOptionSelect={onOptionSelect}
			/>
		);

		const input = getComboboxInput();
		await openListbox(input);

		const option = screen.getByText('Apple');
		fireEvent.click(option);

		expect(onValueChange).toHaveBeenCalledWith('1');
		expect(onOptionSelect).toHaveBeenCalledWith(mockOptions[0]);
	});

	it('does not select disabled options', async () => {
		const onValueChange = vi.fn();

		renderWithProviders(
			<AutocompleteCombobox options={mockOptions} onValueChange={onValueChange} />
		);

		const input = getComboboxInput();
		await openListbox(input);

		const disabledOption = screen.getByText('Date');
		expect(disabledOption).toBeInTheDocument();

		fireEvent.click(disabledOption);
		expect(onValueChange).not.toHaveBeenCalled();
	});
});

describe('AutocompleteCombobox - Input Handling', () => {
	it('updates input value on change', async () => {
		const onInputValueChange = vi.fn();

		renderWithProviders(
			<AutocompleteCombobox options={mockOptions} onInputValueChange={onInputValueChange} />
		);

		const input = getComboboxInput();
		changeInputValue(input, 'App');

		expect(onInputValueChange).toHaveBeenCalledWith('App');
	});

	it('opens listbox on focus', async () => {
		renderWithProviders(<AutocompleteCombobox options={mockOptions} />);

		const input = getComboboxInput();
		await openListbox(input);
	});

	it('opens listbox on input change', async () => {
		renderWithProviders(<AutocompleteCombobox options={mockOptions} />);

		const input = getComboboxInput();
		changeInputValue(input, 'A');

		await waitFor(() => {
			expect(screen.getByRole('listbox')).toBeInTheDocument();
		});
	});
});

describe('AutocompleteCombobox - Options Filtering', () => {
	it('filters options based on input', async () => {
		renderWithProviders(<AutocompleteCombobox options={mockOptions} />);

		const input = getComboboxInput();
		changeInputValue(input, 'App');
		await openListbox(input);

		expect(screen.getByText('Apple')).toBeInTheDocument();
		expect(screen.queryByText('Banana')).not.toBeInTheDocument();
	});

	it('filters by label', async () => {
		renderWithProviders(<AutocompleteCombobox options={mockOptions} />);

		const input = getComboboxInput();
		changeInputValue(input, 'Ban');
		await openListbox(input);

		expect(screen.getByText('Banana')).toBeInTheDocument();
	});

	it('filters by keywords', async () => {
		const optionsWithKeywords: AutocompleteOption[] = [
			{ value: '1', label: 'Apple', keywords: ['red', 'fruit'] },
			{ value: '2', label: 'Banana', keywords: ['yellow', 'fruit'] },
		];

		renderWithProviders(<AutocompleteCombobox options={optionsWithKeywords} />);

		const input = getComboboxInput();
		changeInputValue(input, 'red');
		await openListbox(input);

		expect(screen.getByText('Apple')).toBeInTheDocument();
	});

	it('shows all options when input is empty', async () => {
		renderWithProviders(<AutocompleteCombobox options={mockOptions} />);

		const input = getComboboxInput();
		await openListbox(input);

		expect(screen.getByText('Apple')).toBeInTheDocument();
		expect(screen.getByText('Banana')).toBeInTheDocument();
		expect(screen.getByText('Cherry')).toBeInTheDocument();
	});
});

describe('AutocompleteCombobox - No Options Message', () => {
	it('shows no options message when no matches', async () => {
		renderWithProviders(<AutocompleteCombobox options={mockOptions} />);

		const input = getComboboxInput();
		changeInputValue(input, 'XYZ');
		await openListbox(input);

		expect(screen.getByText('No matches')).toBeInTheDocument();
	});

	it('shows custom no options message', async () => {
		renderWithProviders(
			<AutocompleteCombobox options={mockOptions} noOptionsMessage="No fruits found" />
		);

		const input = getComboboxInput();
		changeInputValue(input, 'XYZ');
		await openListbox(input);

		expect(screen.getByText('No fruits found')).toBeInTheDocument();
	});
});

describe('AutocompleteCombobox - Keyboard Navigation', () => {
	it('navigates down with ArrowDown', async () => {
		renderWithProviders(<AutocompleteCombobox options={mockOptions} />);

		const input = getComboboxInput();
		await openListbox(input);

		fireEvent.keyDown(input, { key: 'ArrowDown' });

		await waitFor(() => {
			const appleOption = screen.getByText('Apple');
			expect(appleOption).toBeInTheDocument();
		});
	});

	it('navigates up with ArrowUp', async () => {
		renderWithProviders(<AutocompleteCombobox options={mockOptions} />);

		const input = getComboboxInput();
		await openListbox(input);

		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'ArrowUp' });
	});

	it('selects option with Enter', async () => {
		const onValueChange = vi.fn();

		renderWithProviders(
			<AutocompleteCombobox options={mockOptions} onValueChange={onValueChange} />
		);

		const input = getComboboxInput();
		await openListbox(input);

		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'Enter' });

		await waitFor(() => {
			expect(onValueChange).toHaveBeenCalled();
		});
	});

	it('closes listbox with Escape', async () => {
		renderWithProviders(<AutocompleteCombobox options={mockOptions} />);

		const input = getComboboxInput();
		await openListbox(input);

		fireEvent.keyDown(input, { key: 'Escape' });

		await waitFor(() => {
			expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
		});
	});

	it('skips disabled options during navigation', async () => {
		renderWithProviders(<AutocompleteCombobox options={mockOptions} />);

		const input = getComboboxInput();
		await openListbox(input);

		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'ArrowDown' });

		await waitFor(() => {
			const listbox = screen.getByRole('listbox');
			expect(listbox).toBeInTheDocument();
		});
	});
});

describe('AutocompleteCombobox - Loading State', () => {
	it('shows loading message when isLoading is true', async () => {
		renderWithProviders(
			<AutocompleteCombobox options={mockOptions} isLoading loadingMessage="Loading..." />
		);

		const input = getComboboxInput();
		await openListbox(input);

		expect(screen.getByText('Loading...')).toBeInTheDocument();
	});

	it('shows custom loading message', async () => {
		renderWithProviders(
			<AutocompleteCombobox options={mockOptions} isLoading loadingMessage="Fetching fruits..." />
		);

		const input = getComboboxInput();
		await openListbox(input);

		expect(screen.getByText('Fetching fruits...')).toBeInTheDocument();
	});
});

describe('AutocompleteCombobox - Accessibility', () => {
	it('has correct ARIA attributes', () => {
		renderWithProviders(<AutocompleteCombobox options={mockOptions} id="test-combobox" />);

		const input = getComboboxInput();
		expect(input).toHaveAttribute('aria-controls');
		expect(input).toHaveAttribute('aria-expanded', 'false');
		expect(input).toHaveAttribute('aria-autocomplete', 'list');
	});

	it('updates aria-expanded when listbox is open', async () => {
		renderWithProviders(<AutocompleteCombobox options={mockOptions} />);

		const input = getComboboxInput();
		await openListbox(input);

		expect(input).toHaveAttribute('aria-expanded', 'true');
	});

	it('associates label with input', () => {
		renderWithProviders(<AutocompleteCombobox options={mockOptions} label="Fruit" id="fruit" />);

		const label = screen.getByText('Fruit');
		const input = getComboboxInput();

		expect(label).toHaveAttribute('for', 'fruit');
		expect(input).toHaveAttribute('id', 'fruit');
	});

	it('associates helper text with input', () => {
		renderWithProviders(
			<AutocompleteCombobox options={mockOptions} helperText="Helper text" id="fruit" />
		);

		const input = getComboboxInput();
		const helperId = input.getAttribute('aria-describedby');
		expect(helperId).toBeTruthy();
	});

	it('associates error with input', () => {
		renderWithProviders(
			<AutocompleteCombobox options={mockOptions} error="Error message" id="fruit" />
		);

		const input = getComboboxInput();
		expect(input).toHaveAttribute('aria-invalid', 'true');
		const errorId = input.getAttribute('aria-describedby');
		expect(errorId).toBeTruthy();
	});
});

describe('AutocompleteCombobox - Controlled Input', () => {
	it('uses controlled inputValue', () => {
		renderWithProviders(<AutocompleteCombobox options={mockOptions} inputValue="Controlled" />);

		const input = getComboboxInput();
		expect(input).toHaveValue('Controlled');
	});

	it('calls onInputValueChange for controlled input', () => {
		const onInputValueChange = vi.fn();

		renderWithProviders(
			<AutocompleteCombobox
				options={mockOptions}
				inputValue=""
				onInputValueChange={onInputValueChange}
			/>
		);

		const input = getComboboxInput();
		changeInputValue(input, 'New value');

		expect(onInputValueChange).toHaveBeenCalledWith('New value');
	});
});

describe('AutocompleteCombobox - Option Display', () => {
	it('displays option with icon', async () => {
		const optionsWithIcon: AutocompleteOption[] = [
			{ value: '1', label: 'Apple', icon: <span>🍎</span> },
		];

		renderWithProviders(<AutocompleteCombobox options={optionsWithIcon} />);

		const input = getComboboxInput();
		await openListbox(input);

		expect(screen.getByText('🍎')).toBeInTheDocument();
	});

	it('displays option with description', async () => {
		const optionsWithDescription: AutocompleteOption[] = [
			{ value: '1', label: 'Apple', description: 'Red fruit' },
		];

		renderWithProviders(<AutocompleteCombobox options={optionsWithDescription} />);

		const input = getComboboxInput();
		await openListbox(input);

		expect(screen.getByText('Red fruit')).toBeInTheDocument();
	});

	it('highlights selected option', async () => {
		renderWithProviders(<AutocompleteCombobox options={mockOptions} value="1" />);

		const input = getComboboxInput();
		await openListbox(input);

		const appleOption = screen.getByText('Apple');
		expect(appleOption).toBeInTheDocument();
	});
});
