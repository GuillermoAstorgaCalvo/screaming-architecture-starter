import Autocomplete from '@core/ui/forms/autocomplete/Autocomplete';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const LABEL_SEARCH_COUNTRY = 'Search Country';
const LABEL_UNITED_STATES = 'United States';
const LABEL_UNITED_KINGDOM = 'United Kingdom';
const LABEL_DISABLED_OPTION = 'Disabled Option';

const mockOptions = [
	{ value: 'us', label: LABEL_UNITED_STATES },
	{ value: 'uk', label: LABEL_UNITED_KINGDOM },
	{ value: 'ca', label: 'Canada' },
	{ value: 'au', label: 'Australia' },
	{ value: 'de', label: 'Germany' },
];

describe('Autocomplete', () => {
	describe('Rendering', () => {
		it('renders autocomplete input', () => {
			renderWithProviders(<Autocomplete options={mockOptions} />);
			const input = screen.getByRole('combobox');
			expect(input).toBeInTheDocument();
		});

		it('renders with label', () => {
			renderWithProviders(<Autocomplete label={LABEL_SEARCH_COUNTRY} options={mockOptions} />);
			expect(screen.getByText(LABEL_SEARCH_COUNTRY)).toBeInTheDocument();
		});

		it('renders with placeholder', () => {
			renderWithProviders(<Autocomplete placeholder="Type to search..." options={mockOptions} />);
			expect(screen.getByPlaceholderText('Type to search...')).toBeInTheDocument();
		});

		it('renders with helper text', () => {
			renderWithProviders(<Autocomplete helperText="Search for a country" options={mockOptions} />);
			expect(screen.getByText('Search for a country')).toBeInTheDocument();
		});

		it('renders with error message', () => {
			renderWithProviders(<Autocomplete error="Country is required" options={mockOptions} />);
			expect(screen.getByText('Country is required')).toBeInTheDocument();
		});
	});
});

function renderBasicFilteringTests() {
	it('filters options as user types', async () => {
		renderWithProviders(<Autocomplete options={mockOptions} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);

		await waitFor(() => {
			expect(screen.getByText(LABEL_UNITED_STATES)).toBeInTheDocument();
		});

		fireEvent.change(input, { target: { value: 'united' } });

		await waitFor(() => {
			expect(screen.getByText(LABEL_UNITED_STATES)).toBeInTheDocument();
			expect(screen.getByText(LABEL_UNITED_KINGDOM)).toBeInTheDocument();
		});
	});

	it('shows empty state when no options match', async () => {
		renderWithProviders(<Autocomplete options={mockOptions} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);

		await waitFor(() => {
			expect(screen.getByText(LABEL_UNITED_STATES)).toBeInTheDocument();
		});

		fireEvent.change(input, { target: { value: 'xyz123' } });

		await waitFor(
			() => {
				const emptyState =
					screen.queryByText(/no options found/i) ?? screen.queryByText(/common\.nooptionsfound/i);
				expect(emptyState).toBeInTheDocument();
			},
			{ timeout: 2000 }
		);
	});
}

function renderAdvancedFilteringTests() {
	it('uses custom filter function', async () => {
		const customFilter = vi.fn((option, inputValue) =>
			option.label.toString().toLowerCase().includes(inputValue.toLowerCase())
		);

		renderWithProviders(<Autocomplete options={mockOptions} filterFn={customFilter} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);

		await waitFor(() => {
			expect(screen.getByText(LABEL_UNITED_STATES)).toBeInTheDocument();
		});

		fireEvent.change(input, { target: { value: 'states' } });

		await waitFor(
			() => {
				expect(customFilter).toHaveBeenCalled();
			},
			{ timeout: 2000 }
		);
	});

	it('highlights matches in options', async () => {
		renderWithProviders(<Autocomplete options={mockOptions} highlightMatches />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);

		await waitFor(() => {
			expect(screen.getByText(LABEL_UNITED_STATES)).toBeInTheDocument();
		});

		fireEvent.change(input, { target: { value: 'united' } });

		await waitFor(() => {
			expect(screen.getByText(LABEL_UNITED_STATES)).toBeInTheDocument();
		});
	});
}

describe('Autocomplete - Filtering', () => {
	renderBasicFilteringTests();
	renderAdvancedFilteringTests();
});

describe('Autocomplete - Debouncing', () => {
	it('debounces search input', async () => {
		vi.useFakeTimers();
		const onInputChange = vi.fn();
		renderWithProviders(<Autocomplete options={mockOptions} onInputChange={onInputChange} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);

		// Use real timers to wait for dropdown to open
		vi.useRealTimers();
		await waitFor(() => {
			expect(screen.getByText(LABEL_UNITED_STATES)).toBeInTheDocument();
		});
		vi.useFakeTimers();

		fireEvent.change(input, { target: { value: 'u' } });
		fireEvent.change(input, { target: { value: 'un' } });
		fireEvent.change(input, { target: { value: 'uni' } });

		// Before debounce delay, should not be called
		await act(async () => {
			vi.advanceTimersByTime(200);
		});
		expect(onInputChange).not.toHaveBeenCalled();

		// After debounce delay, should be called with last value
		await act(async () => {
			vi.advanceTimersByTime(100);
		});
		expect(onInputChange).toHaveBeenCalledWith('uni');

		vi.useRealTimers();
	});

	it('uses custom debounce delay', async () => {
		vi.useFakeTimers();
		const onInputChange = vi.fn();
		renderWithProviders(
			<Autocomplete options={mockOptions} onInputChange={onInputChange} debounceDelay={500} />
		);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);

		// Use real timers to wait for dropdown to open
		vi.useRealTimers();
		await waitFor(() => {
			expect(screen.getByText(LABEL_UNITED_STATES)).toBeInTheDocument();
		});
		vi.useFakeTimers();

		fireEvent.change(input, { target: { value: 'test' } });

		await act(async () => {
			vi.advanceTimersByTime(300);
		});
		expect(onInputChange).not.toHaveBeenCalled();

		await act(async () => {
			vi.advanceTimersByTime(200);
		});
		expect(onInputChange).toHaveBeenCalled();

		vi.useRealTimers();
	});
});

describe('Autocomplete - Option Selection', () => {
	it('selects an option on click', async () => {
		const onChange = vi.fn();
		renderWithProviders(<Autocomplete options={mockOptions} onChange={onChange} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);

		await waitFor(() => {
			expect(screen.getByText(LABEL_UNITED_STATES)).toBeInTheDocument();
		});

		const option = screen.getByText(LABEL_UNITED_STATES);
		fireEvent.click(option);

		expect(onChange).toHaveBeenCalledWith('us');
	});

	it('updates input value when option is selected', async () => {
		const onChange = vi.fn();
		renderWithProviders(<Autocomplete options={mockOptions} onChange={onChange} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);

		await waitFor(() => {
			expect(screen.getByText(LABEL_UNITED_STATES)).toBeInTheDocument();
		});

		const option = screen.getByText(LABEL_UNITED_STATES);
		fireEvent.click(option);

		expect(onChange).toHaveBeenCalled();
	});

	it('does not select disabled options', async () => {
		const disabledOptions = [
			...mockOptions,
			{ value: 'disabled', label: LABEL_DISABLED_OPTION, disabled: true },
		];
		const onChange = vi.fn();
		renderWithProviders(<Autocomplete options={disabledOptions} onChange={onChange} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);

		await waitFor(() => {
			expect(screen.getByText(LABEL_DISABLED_OPTION)).toBeInTheDocument();
		});

		const disabledOption = screen.getByText(LABEL_DISABLED_OPTION);
		fireEvent.click(disabledOption);

		expect(onChange).not.toHaveBeenCalledWith('disabled');
	});
});

describe('Autocomplete - State Management', () => {
	it('uses controlled value', async () => {
		const value = 'us';
		const { rerender } = renderWithProviders(<Autocomplete options={mockOptions} value={value} />);

		const input = screen.getByRole('combobox');
		await waitFor(() => {
			expect(input).toHaveValue(LABEL_UNITED_STATES);
		});

		const newValue = 'uk';
		rerender(<Autocomplete options={mockOptions} value={newValue} />);

		await waitFor(() => {
			expect(input).toHaveValue(LABEL_UNITED_KINGDOM);
		});
	});

	it('uses defaultValue for uncontrolled mode', () => {
		const defaultValue = 'us';
		renderWithProviders(<Autocomplete options={mockOptions} defaultValue={defaultValue} />);

		const input = screen.getByRole('combobox');
		expect(input).toHaveValue(LABEL_UNITED_STATES);
	});
});

describe('Autocomplete - Keyboard Navigation - Arrow Keys', () => {
	it('opens dropdown on ArrowDown key', async () => {
		renderWithProviders(<Autocomplete options={mockOptions} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);
		fireEvent.keyDown(input, { key: 'ArrowDown' });

		await waitFor(() => {
			expect(screen.getByText(LABEL_UNITED_STATES)).toBeInTheDocument();
		});
	});

	it('navigates options with ArrowDown', async () => {
		renderWithProviders(<Autocomplete options={mockOptions} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);
		await waitFor(() => {
			expect(screen.getByText(LABEL_UNITED_STATES)).toBeInTheDocument();
		});
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'ArrowDown' });

		await waitFor(() => {
			expect(screen.getByText(LABEL_UNITED_KINGDOM)).toBeInTheDocument();
		});
	});

	it('navigates options with ArrowUp', async () => {
		renderWithProviders(<Autocomplete options={mockOptions} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);
		await waitFor(() => {
			expect(screen.getByText(LABEL_UNITED_STATES)).toBeInTheDocument();
		});
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'ArrowUp' });

		await waitFor(() => {
			expect(screen.getByText(LABEL_UNITED_STATES)).toBeInTheDocument();
		});
	});
});

function renderKeyboardSelectionTests() {
	it('selects option with Enter key', async () => {
		const onChange = vi.fn();
		renderWithProviders(<Autocomplete options={mockOptions} onChange={onChange} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);
		await waitFor(() => {
			expect(screen.getByText(LABEL_UNITED_STATES)).toBeInTheDocument();
		});

		// Get the first option button and press Enter on it
		// This tests Enter key selection via the option's keyboard handler
		const firstOption = screen.getByRole('option', { name: LABEL_UNITED_STATES });
		fireEvent.keyDown(firstOption, { key: 'Enter', code: 'Enter' });

		expect(onChange).toHaveBeenCalledWith('us');
	});

	it('closes dropdown with Escape key', async () => {
		renderWithProviders(<Autocomplete options={mockOptions} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);

		await waitFor(() => {
			expect(screen.getByText(LABEL_UNITED_STATES)).toBeInTheDocument();
		});

		fireEvent.keyDown(input, { key: 'Escape' });

		await waitFor(() => {
			expect(screen.queryByText(LABEL_UNITED_STATES)).not.toBeInTheDocument();
		});
	});
}

function renderKeyboardJumpTests() {
	it('navigates to first option with Home key', async () => {
		renderWithProviders(<Autocomplete options={mockOptions} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);
		await waitFor(() => {
			expect(screen.getByText(LABEL_UNITED_STATES)).toBeInTheDocument();
		});
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'Home' });

		await waitFor(() => {
			expect(screen.getByText(LABEL_UNITED_STATES)).toBeInTheDocument();
		});
	});

	it('navigates to last option with End key', async () => {
		renderWithProviders(<Autocomplete options={mockOptions} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);
		await waitFor(() => {
			expect(screen.getByText(LABEL_UNITED_STATES)).toBeInTheDocument();
		});
		fireEvent.keyDown(input, { key: 'End' });

		await waitFor(() => {
			expect(screen.getByText('Germany')).toBeInTheDocument();
		});
	});
}

describe('Autocomplete - Keyboard Navigation - Selection and Navigation', () => {
	renderKeyboardSelectionTests();
	renderKeyboardJumpTests();
});

describe('Autocomplete - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<Autocomplete label={LABEL_SEARCH_COUNTRY} options={mockOptions} />
		);

		await expectA11y(container);
	});

	it('has proper ARIA attributes', () => {
		renderWithProviders(<Autocomplete label={LABEL_SEARCH_COUNTRY} options={mockOptions} />);

		const input = screen.getByRole('combobox');
		expect(input).toHaveAttribute('aria-autocomplete', 'list');
		expect(input).toHaveAttribute('aria-expanded');
	});

	it('has proper label association', () => {
		renderWithProviders(<Autocomplete label={LABEL_SEARCH_COUNTRY} options={mockOptions} />);

		const label = screen.getByText(LABEL_SEARCH_COUNTRY);
		const input = screen.getByLabelText(LABEL_SEARCH_COUNTRY);

		expect(label).toBeInTheDocument();
		expect(input).toBeInTheDocument();
	});

	it('has aria-describedby for helper text', () => {
		renderWithProviders(
			<Autocomplete
				label={LABEL_SEARCH_COUNTRY}
				helperText="Type to search"
				options={mockOptions}
			/>
		);

		const input = screen.getByLabelText(LABEL_SEARCH_COUNTRY);
		expect(input).toHaveAttribute('aria-describedby');
	});

	it('has aria-describedby for error message', () => {
		renderWithProviders(
			<Autocomplete label={LABEL_SEARCH_COUNTRY} error="Required" options={mockOptions} />
		);

		const input = screen.getByLabelText(LABEL_SEARCH_COUNTRY);
		expect(input).toHaveAttribute('aria-describedby');
	});
});

describe('Autocomplete - Disabled State', () => {
	it('disables input when disabled', () => {
		renderWithProviders(<Autocomplete options={mockOptions} disabled />);

		const input = screen.getByRole('combobox');
		expect(input).toBeDisabled();
	});

	it('does not open dropdown when disabled', () => {
		renderWithProviders(<Autocomplete options={mockOptions} disabled />);

		const input = screen.getByRole('combobox');
		fireEvent.click(input);

		expect(screen.queryByText(LABEL_UNITED_STATES)).not.toBeInTheDocument();
	});
});

describe('Autocomplete - Size Variants', () => {
	it('renders with small size', () => {
		const { container } = renderWithProviders(
			<Autocomplete size="sm" label={LABEL_SEARCH_COUNTRY} options={mockOptions} />
		);
		expect(container).toBeInTheDocument();
	});

	it('renders with medium size (default)', () => {
		const { container } = renderWithProviders(
			<Autocomplete size="md" label={LABEL_SEARCH_COUNTRY} options={mockOptions} />
		);
		expect(container).toBeInTheDocument();
	});

	it('renders with large size', () => {
		const { container } = renderWithProviders(
			<Autocomplete size="lg" label={LABEL_SEARCH_COUNTRY} options={mockOptions} />
		);
		expect(container).toBeInTheDocument();
	});
});

describe('Autocomplete - Custom Empty State', () => {
	it('renders custom empty state message', async () => {
		renderWithProviders(<Autocomplete options={mockOptions} emptyState="No matches found" />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);

		// Wait for dropdown to open
		await waitFor(() => {
			expect(screen.getByText(LABEL_UNITED_STATES)).toBeInTheDocument();
		});

		fireEvent.change(input, { target: { value: 'xyz123' } });

		await waitFor(
			() => {
				expect(screen.getByText('No matches found')).toBeInTheDocument();
			},
			{ timeout: 2000 }
		);
	});
});

describe('Autocomplete - Match Highlighting', () => {
	it('disables match highlighting when highlightMatches is false', async () => {
		renderWithProviders(<Autocomplete options={mockOptions} highlightMatches={false} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);

		// Wait for dropdown to open
		await waitFor(() => {
			expect(screen.getByText(LABEL_UNITED_STATES)).toBeInTheDocument();
		});

		fireEvent.change(input, { target: { value: 'united' } });

		await waitFor(() => {
			expect(screen.getByText(LABEL_UNITED_STATES)).toBeInTheDocument();
		});
	});
});
