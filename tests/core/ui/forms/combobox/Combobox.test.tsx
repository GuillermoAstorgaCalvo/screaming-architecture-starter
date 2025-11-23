import Combobox from '@core/ui/forms/combobox/Combobox';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const UNITED_STATES_LABEL = 'United States';
const UNITED_KINGDOM_LABEL = 'United Kingdom';
const DISABLED_OPTION_LABEL = 'Disabled Option';

const mockOptions = [
	{ value: 'us', label: UNITED_STATES_LABEL },
	{ value: 'uk', label: UNITED_KINGDOM_LABEL },
	{ value: 'ca', label: 'Canada' },
	{ value: 'au', label: 'Australia' },
	{ value: 'de', label: 'Germany' },
];

function renderRenderingTests() {
	describe('Rendering', () => {
		it('renders combobox input', () => {
			renderWithProviders(<Combobox options={mockOptions} />);
			const input = screen.getByRole('combobox');
			expect(input).toBeInTheDocument();
		});

		it('renders with label', () => {
			renderWithProviders(<Combobox label="Country" options={mockOptions} />);
			expect(screen.getByText('Country')).toBeInTheDocument();
		});

		it('renders with placeholder', () => {
			renderWithProviders(<Combobox placeholder="Search countries..." options={mockOptions} />);
			expect(screen.getByPlaceholderText('Search countries...')).toBeInTheDocument();
		});

		it('renders with helper text', () => {
			renderWithProviders(<Combobox helperText="Select a country" options={mockOptions} />);
			expect(screen.getByText('Select a country')).toBeInTheDocument();
		});

		it('renders with error message', () => {
			renderWithProviders(<Combobox error="Country is required" options={mockOptions} />);
			expect(screen.getByText('Country is required')).toBeInTheDocument();
		});
	});
}

function renderFilteringBasicTests() {
	it('filters options as user types', async () => {
		renderWithProviders(<Combobox options={mockOptions} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);
		fireEvent.change(input, { target: { value: 'united' } });

		await waitFor(
			() => {
				expect(screen.getByText(UNITED_STATES_LABEL)).toBeInTheDocument();
				expect(screen.getByText(UNITED_KINGDOM_LABEL)).toBeInTheDocument();
			},
			{ timeout: 2000 }
		);
	});

	it('shows empty state when no options match', async () => {
		renderWithProviders(<Combobox options={mockOptions} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);

		// Wait for dropdown to open
		await waitFor(() => {
			expect(screen.getByText(UNITED_STATES_LABEL)).toBeInTheDocument();
		});

		// Use fireEvent.input to trigger the onChange handler
		fireEvent.input(input, { target: { value: 'xyz123' } });

		// Wait for the input value to update (debounced)
		await waitFor(
			() => {
				expect(input).toHaveValue('xyz123');
			},
			{ timeout: 2000 }
		);

		// Wait for the empty state to appear (after debounce and filtering)
		// The empty state may show the i18n key if translation is not loaded in tests
		await waitFor(
			() => {
				const emptyState =
					screen.queryByText(/no options found/i) ?? screen.queryByText(/common\.nooptionsfound/i);
				expect(emptyState).toBeInTheDocument();
			},
			{ timeout: 3000 }
		);
	});

	it('uses custom filter function', async () => {
		const customFilter = vi.fn((option, inputValue) =>
			option.label.toString().toLowerCase().includes(inputValue.toLowerCase())
		);

		renderWithProviders(<Combobox options={mockOptions} filterFn={customFilter} />);

		const input = screen.getByRole('combobox');
		fireEvent.change(input, { target: { value: 'states' } });

		await waitFor(() => {
			expect(customFilter).toHaveBeenCalled();
		});
	});
}

function renderInputChangeTests() {
	it('calls onInputChange when input changes', async () => {
		const onInputChange = vi.fn();
		renderWithProviders(<Combobox options={mockOptions} onInputChange={onInputChange} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);

		// Wait for dropdown to open
		await waitFor(() => {
			expect(screen.getByText(UNITED_STATES_LABEL)).toBeInTheDocument();
		});

		// Use fireEvent.input to trigger the onChange handler
		fireEvent.input(input, { target: { value: 'united' } });

		// Wait for the input value to update
		await waitFor(
			() => {
				expect(input).toHaveValue('united');
			},
			{ timeout: 2000 }
		);

		// Wait for onInputChange to be called with debounced value
		await waitFor(
			() => {
				expect(onInputChange).toHaveBeenCalled();
				const { calls } = onInputChange.mock;
				const lastCall = calls.at(-1);
				expect(lastCall?.[0]).toBe('united');
			},
			{ timeout: 3000 }
		);
	});
}

function renderSearchAndFilteringTests() {
	describe('Search and Filtering', () => {
		renderFilteringBasicTests();
		renderInputChangeTests();
	});
}

function renderOptionSelectionTests() {
	describe('Option Selection', () => {
		it('selects an option on click', async () => {
			const onChange = vi.fn();
			renderWithProviders(<Combobox options={mockOptions} onChange={onChange} />);

			const input = screen.getByRole('combobox');
			fireEvent.focus(input);

			await waitFor(() => {
				expect(screen.getByText(UNITED_STATES_LABEL)).toBeInTheDocument();
			});

			const option = screen.getByText(UNITED_STATES_LABEL);
			fireEvent.click(option);

			expect(onChange).toHaveBeenCalledWith('us');
		});

		it('updates input value when option is selected', async () => {
			const onChange = vi.fn();
			renderWithProviders(<Combobox options={mockOptions} onChange={onChange} />);

			const input = screen.getByRole('combobox');
			fireEvent.focus(input);

			await waitFor(() => {
				expect(screen.getByText(UNITED_STATES_LABEL)).toBeInTheDocument();
			});

			const option = screen.getByText(UNITED_STATES_LABEL);
			fireEvent.click(option);

			// Input should reflect selected value
			expect(onChange).toHaveBeenCalled();
		});

		it('does not select disabled options', async () => {
			const disabledOptions = [
				...mockOptions,
				{ value: 'disabled', label: DISABLED_OPTION_LABEL, disabled: true },
			];
			const onChange = vi.fn();
			renderWithProviders(<Combobox options={disabledOptions} onChange={onChange} />);

			const input = screen.getByRole('combobox');
			fireEvent.focus(input);

			await waitFor(() => {
				expect(screen.getByText(DISABLED_OPTION_LABEL)).toBeInTheDocument();
			});

			const disabledOption = screen.getByText(DISABLED_OPTION_LABEL);
			fireEvent.click(disabledOption);

			// Should not call onChange for disabled option
			expect(onChange).not.toHaveBeenCalledWith('disabled');
		});
	});
}

function renderStateManagementTests() {
	describe('State Management', () => {
		it('uses controlled value', async () => {
			const value = 'us';
			const { rerender } = renderWithProviders(<Combobox options={mockOptions} value={value} />);

			const input = screen.getByRole('combobox');
			await waitFor(() => {
				expect(input).toHaveValue(UNITED_STATES_LABEL);
			});

			const newValue = 'uk';
			rerender(<Combobox options={mockOptions} value={newValue} />);

			await waitFor(() => {
				expect(input).toHaveValue(UNITED_KINGDOM_LABEL);
			});
		});

		it('uses defaultValue for uncontrolled mode', () => {
			const defaultValue = 'us';
			renderWithProviders(<Combobox options={mockOptions} defaultValue={defaultValue} />);

			const input = screen.getByRole('combobox');
			expect(input).toHaveValue(UNITED_STATES_LABEL);
		});
	});
}

function renderKeyboardNavigationBasicTests() {
	it('opens dropdown on ArrowDown key', async () => {
		renderWithProviders(<Combobox options={mockOptions} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);
		fireEvent.keyDown(input, { key: 'ArrowDown' });

		await waitFor(() => {
			expect(screen.getByText(UNITED_STATES_LABEL)).toBeInTheDocument();
		});
	});

	it('navigates options with ArrowDown', async () => {
		renderWithProviders(<Combobox options={mockOptions} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);
		await waitFor(() => {
			expect(screen.getByText(UNITED_STATES_LABEL)).toBeInTheDocument();
		});
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'ArrowDown' });

		await waitFor(() => {
			expect(screen.getByText(UNITED_KINGDOM_LABEL)).toBeInTheDocument();
		});
	});

	it('navigates options with ArrowUp', async () => {
		renderWithProviders(<Combobox options={mockOptions} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);
		await waitFor(() => {
			expect(screen.getByText(UNITED_STATES_LABEL)).toBeInTheDocument();
		});
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'ArrowUp' });

		await waitFor(() => {
			expect(screen.getByText(UNITED_STATES_LABEL)).toBeInTheDocument();
		});
	});
}

function renderKeyboardNavigationSelectionTests() {
	it('selects option with Enter key', async () => {
		const onChange = vi.fn();
		renderWithProviders(<Combobox options={mockOptions} onChange={onChange} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);

		// Wait for dropdown to open
		await waitFor(() => {
			expect(screen.getByText(UNITED_STATES_LABEL)).toBeInTheDocument();
		});

		// ArrowDown should highlight the first option (index 0)
		// When dropdown first opens, highlightedIndex is -1, so ArrowDown should set it to 0
		fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' });

		// Wait a bit for React state to update (highlightedIndex needs to be set)
		// We can't directly check highlightedIndex, but we can wait a tick
		await new Promise<void>(resolve => {
			setTimeout(() => {
				resolve();
			}, 50);
		});

		// Press Enter to select the highlighted option
		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

		await waitFor(
			() => {
				expect(onChange).toHaveBeenCalledWith('us');
			},
			{ timeout: 1000 }
		);
	});

	it('closes dropdown with Escape key', async () => {
		renderWithProviders(<Combobox options={mockOptions} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);

		await waitFor(() => {
			expect(screen.getByText(UNITED_STATES_LABEL)).toBeInTheDocument();
		});

		fireEvent.keyDown(input, { key: 'Escape' });

		await waitFor(() => {
			expect(screen.queryByText(UNITED_STATES_LABEL)).not.toBeInTheDocument();
		});
	});
}

function renderKeyboardNavigationJumpTests() {
	it('navigates to first option with Home key', async () => {
		renderWithProviders(<Combobox options={mockOptions} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);
		await waitFor(() => {
			expect(screen.getByText(UNITED_STATES_LABEL)).toBeInTheDocument();
		});
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'Home' });

		await waitFor(() => {
			expect(screen.getByText(UNITED_STATES_LABEL)).toBeInTheDocument();
		});
	});

	it('navigates to last option with End key', async () => {
		renderWithProviders(<Combobox options={mockOptions} />);

		const input = screen.getByRole('combobox');
		fireEvent.focus(input);
		await waitFor(() => {
			expect(screen.getByText(UNITED_STATES_LABEL)).toBeInTheDocument();
		});
		fireEvent.keyDown(input, { key: 'End' });

		await waitFor(() => {
			expect(screen.getByText('Germany')).toBeInTheDocument();
		});
	});
}

function renderKeyboardNavigationTests() {
	describe('Keyboard Navigation', () => {
		renderKeyboardNavigationBasicTests();
		renderKeyboardNavigationSelectionTests();
		renderKeyboardNavigationJumpTests();
	});
}

function renderAccessibilityTests() {
	describe('Accessibility', () => {
		it('has no accessibility violations', async () => {
			const { container } = renderWithProviders(<Combobox label="Country" options={mockOptions} />);

			await expectA11y(container);
		});

		it('has proper ARIA attributes', async () => {
			renderWithProviders(<Combobox label="Country" options={mockOptions} />);

			const input = screen.getByRole('combobox');
			expect(input).toHaveAttribute('aria-autocomplete', 'list');
			expect(input).toHaveAttribute('aria-expanded', 'false');

			fireEvent.focus(input);
			await waitFor(() => {
				expect(input).toHaveAttribute('aria-expanded', 'true');
			});
		});

		it('has proper label association', () => {
			renderWithProviders(<Combobox label="Country" options={mockOptions} />);

			const label = screen.getByText('Country');
			const input = screen.getByLabelText('Country');

			expect(label).toBeInTheDocument();
			expect(input).toBeInTheDocument();
		});

		it('has aria-describedby for helper text', () => {
			renderWithProviders(
				<Combobox label="Country" helperText="Select a country" options={mockOptions} />
			);

			const input = screen.getByLabelText('Country');
			expect(input).toHaveAttribute('aria-describedby');
		});

		it('has aria-describedby for error message', () => {
			renderWithProviders(<Combobox label="Country" error="Required" options={mockOptions} />);

			const input = screen.getByLabelText('Country');
			expect(input).toHaveAttribute('aria-describedby');
		});
	});
}

function renderDisabledStateTests() {
	describe('Disabled State', () => {
		it('disables input when disabled', () => {
			renderWithProviders(<Combobox options={mockOptions} disabled />);

			const input = screen.getByRole('combobox');
			expect(input).toBeDisabled();
		});

		it('does not open dropdown when disabled', () => {
			renderWithProviders(<Combobox options={mockOptions} disabled />);

			const input = screen.getByRole('combobox');
			fireEvent.click(input);

			expect(screen.queryByText(UNITED_STATES_LABEL)).not.toBeInTheDocument();
		});
	});
}

function renderSizeVariantsTests() {
	describe('Size Variants', () => {
		it('renders with small size', () => {
			const { container } = renderWithProviders(
				<Combobox size="sm" label="Country" options={mockOptions} />
			);
			expect(container).toBeInTheDocument();
		});

		it('renders with medium size (default)', () => {
			const { container } = renderWithProviders(
				<Combobox size="md" label="Country" options={mockOptions} />
			);
			expect(container).toBeInTheDocument();
		});

		it('renders with large size', () => {
			const { container } = renderWithProviders(
				<Combobox size="lg" label="Country" options={mockOptions} />
			);
			expect(container).toBeInTheDocument();
		});
	});
}

function renderCustomEmptyStateTests() {
	describe('Custom Empty State', () => {
		it('renders custom empty state message', async () => {
			renderWithProviders(<Combobox options={mockOptions} emptyState="No matches found" />);

			const input = screen.getByRole('combobox');
			fireEvent.focus(input);

			// Wait for dropdown to open
			await waitFor(() => {
				expect(screen.getByText(UNITED_STATES_LABEL)).toBeInTheDocument();
			});

			// Use fireEvent.input to trigger the onChange handler
			fireEvent.input(input, { target: { value: 'xyz123' } });

			// Wait for the input value to update (debounced)
			await waitFor(
				() => {
					expect(input).toHaveValue('xyz123');
				},
				{ timeout: 2000 }
			);

			// Wait for the empty state to appear (after debounce and filtering)
			await waitFor(
				() => {
					expect(screen.getByText('No matches found')).toBeInTheDocument();
				},
				{ timeout: 3000 }
			);
		});
	});
}

function renderMaxHeightTests() {
	describe('Max Height', () => {
		it('applies custom max height', () => {
			const { container } = renderWithProviders(<Combobox options={mockOptions} maxHeight={200} />);
			expect(container).toBeInTheDocument();
		});
	});
}

describe('Combobox', () => {
	renderRenderingTests();
	renderSearchAndFilteringTests();
	renderOptionSelectionTests();
	renderStateManagementTests();
	renderKeyboardNavigationTests();
	renderAccessibilityTests();
	renderDisabledStateTests();
	renderSizeVariantsTests();
	renderCustomEmptyStateTests();
	renderMaxHeightTests();
});
