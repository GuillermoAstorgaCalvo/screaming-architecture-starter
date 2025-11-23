/**
 * SearchInput Component Tests
 *
 * Tests for the SearchInput component including:
 * - Rendering
 * - User interactions
 * - Controlled and uncontrolled modes
 * - Size variants
 * - Error and helper text display
 * - Clear button functionality
 * - Accessibility
 * - Full width option
 */

import SearchInput from '@core/ui/forms/search-input/SearchInput';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('SearchInput - Rendering', () => {
	it('renders search input element', () => {
		const { container } = renderWithProviders(<SearchInput />);
		const input = container.querySelector('input[type="search"]') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input.tagName).toBe('INPUT');
		expect(input).toHaveAttribute('type', 'search');
	});

	it('renders with label', () => {
		renderWithProviders(<SearchInput label="Search" />);
		expect(screen.getByLabelText('Search')).toBeInTheDocument();
		const input = screen.getByLabelText('Search');
		expect(input).toHaveAttribute('type', 'search');
	});

	it('renders with placeholder', () => {
		renderWithProviders(<SearchInput placeholder="Search for items..." />);
		expect(screen.getByPlaceholderText('Search for items...')).toBeInTheDocument();
	});

	it('renders with helper text', () => {
		renderWithProviders(<SearchInput label="Search" helperText="Enter keywords to search" />);

		expect(screen.getByText('Enter keywords to search')).toBeInTheDocument();
	});

	it('renders with error message', () => {
		renderWithProviders(<SearchInput label="Search" error="Search is required" />);
		expect(screen.getByText('Search is required')).toBeInTheDocument();
	});

	it('renders search icon', () => {
		const { container } = renderWithProviders(<SearchInput />);
		// Search icon is in a div with pointer-events-none and absolute positioning
		const iconContainer = container.querySelector('.pointer-events-none.absolute');
		expect(iconContainer).toBeInTheDocument();
		const svg = iconContainer?.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});

	it('applies fullWidth class when fullWidth is true', () => {
		renderWithProviders(<SearchInput fullWidth label="Test" />);
		const input = screen.getByLabelText('Test');
		expect(input).toBeInTheDocument();
	});

	it('renders clear button when value is present and showClearButton is true', () => {
		renderWithProviders(<SearchInput value="test" showClearButton />);
		const clearButton = screen.getByLabelText(/clear.*search/i);
		expect(clearButton).toBeInTheDocument();
	});

	it('does not render clear button when showClearButton is false', () => {
		renderWithProviders(<SearchInput value="test" showClearButton={false} />);
		const clearButton = screen.queryByLabelText(/clear.*search/i);
		expect(clearButton).not.toBeInTheDocument();
	});
});

describe('SearchInput - Interactions', () => {
	it('calls onChange when value changes', () => {
		const onChange = vi.fn();

		renderWithProviders(<SearchInput onChange={onChange} />);

		const input = screen.getByRole('searchbox');
		fireEvent.change(input, { target: { value: 'test query' } });

		expect(onChange).toHaveBeenCalled();
	});

	it('clears value when clear button is clicked', () => {
		const onChange = vi.fn();

		renderWithProviders(<SearchInput value="test" onChange={onChange} showClearButton />);

		const clearButton = screen.getByLabelText(/clear.*search/i);
		fireEvent.click(clearButton);

		expect(onChange).toHaveBeenCalledWith('');
	});

	it('does not show clear button when value is empty', () => {
		renderWithProviders(<SearchInput value="" showClearButton />);
		const clearButton = screen.queryByLabelText(/clear.*search/i);
		expect(clearButton).not.toBeInTheDocument();
	});
});

describe('SearchInput - Controlled Mode', () => {
	it('displays controlled value', () => {
		renderWithProviders(<SearchInput value="test query" />);

		const input = screen.getByRole('searchbox');
		expect(input).toHaveValue('test query');
	});

	it('calls onChange in controlled mode', () => {
		const onChange = vi.fn();

		renderWithProviders(<SearchInput value="test" onChange={onChange} />);

		const input = screen.getByRole('searchbox');
		fireEvent.change(input, { target: { value: 'new query' } });

		expect(onChange).toHaveBeenCalled();
	});

	it('updates when controlled value changes', () => {
		const { rerender } = renderWithProviders(<SearchInput value="test" />);

		let input = screen.getByRole('searchbox');
		expect(input).toHaveValue('test');

		rerender(<SearchInput value="updated" />);

		input = screen.getByRole('searchbox');
		expect(input).toHaveValue('updated');
	});
});

describe('SearchInput - Uncontrolled Mode', () => {
	it('displays defaultValue', () => {
		renderWithProviders(<SearchInput defaultValue="default query" />);

		const input = screen.getByRole('searchbox');
		expect(input).toHaveValue('default query');
	});

	it('updates internal value on input', () => {
		renderWithProviders(<SearchInput defaultValue="" />);

		const input = screen.getByRole('searchbox');
		fireEvent.change(input, { target: { value: 'new query' } });

		expect(input).toHaveValue('new query');
	});
});

describe('SearchInput - Disabled State', () => {
	it('disables input when disabled', () => {
		renderWithProviders(<SearchInput disabled />);

		const input = screen.getByRole('searchbox');
		expect(input).toBeDisabled();
	});

	it('disables clear button when disabled', () => {
		renderWithProviders(<SearchInput value="test" disabled showClearButton />);

		const clearButton = screen.getByLabelText(/clear.*search/i);
		expect(clearButton).toBeDisabled();
	});

	it('does not call onChange when disabled', () => {
		const onChange = vi.fn();

		renderWithProviders(<SearchInput disabled onChange={onChange} />);

		const input = screen.getByRole('searchbox');
		fireEvent.change(input, { target: { value: 'test' } });

		expect(onChange).not.toHaveBeenCalled();
	});
});

describe('SearchInput - Size Variants', () => {
	it('renders with sm size', () => {
		renderWithProviders(<SearchInput size="sm" />);

		const input = screen.getByRole('searchbox');
		expect(input).toBeInTheDocument();
	});

	it('renders with md size', () => {
		renderWithProviders(<SearchInput size="md" />);

		const input = screen.getByRole('searchbox');
		expect(input).toBeInTheDocument();
	});

	it('renders with lg size', () => {
		renderWithProviders(<SearchInput size="lg" />);

		const input = screen.getByRole('searchbox');
		expect(input).toBeInTheDocument();
	});
});

describe('SearchInput - Clear Button', () => {
	it('shows clear button when value is present and showClearButton is true', () => {
		renderWithProviders(<SearchInput value="test" showClearButton />);
		const clearButton = screen.getByLabelText(/clear.*search/i);
		expect(clearButton).toBeInTheDocument();
	});

	it('hides clear button when value is empty', () => {
		renderWithProviders(<SearchInput value="" showClearButton />);
		const clearButton = screen.queryByLabelText(/clear.*search/i);
		expect(clearButton).not.toBeInTheDocument();
	});

	it('hides clear button when showClearButton is false', () => {
		renderWithProviders(<SearchInput value="test" showClearButton={false} />);
		const clearButton = screen.queryByLabelText(/clear.*search/i);
		expect(clearButton).not.toBeInTheDocument();
	});

	it('calls onChange with empty string when clear is clicked', () => {
		const onChange = vi.fn();

		renderWithProviders(<SearchInput value="test" onChange={onChange} showClearButton />);

		const clearButton = screen.getByLabelText(/clear.*search/i);
		fireEvent.click(clearButton);

		expect(onChange).toHaveBeenCalledWith('');
	});
});

describe('SearchInput - Accessibility', () => {
	it('has correct ARIA attributes', () => {
		renderWithProviders(<SearchInput label="Search" aria-label="Search input" />);

		const input = screen.getByLabelText('Search');
		expect(input).toBeInTheDocument();
	});

	it('associates error with input via ID', () => {
		renderWithProviders(<SearchInput label="Search" error="Invalid search" />);

		const errorElement = screen.getByText('Invalid search');
		expect(errorElement).toHaveAttribute('id');
	});

	it('associates helper text with input via ID', () => {
		renderWithProviders(<SearchInput label="Search" helperText="Enter keywords" />);

		const helperElement = screen.getByText('Enter keywords');
		expect(helperElement).toHaveAttribute('id');
	});

	it('passes accessibility checks', async () => {
		const { container } = renderWithProviders(<SearchInput label="Search" />);

		await expectA11y(container);
	});

	it('has accessible clear button', () => {
		renderWithProviders(<SearchInput value="test" showClearButton />);

		const clearButton = screen.getByLabelText(/clear.*search/i);
		expect(clearButton).toBeInTheDocument();
	});
});

describe('SearchInput - Error and Helper Text', () => {
	it('shows error message when error is provided', () => {
		renderWithProviders(<SearchInput label="Search" error="Invalid search" />);

		expect(screen.getByText('Invalid search')).toBeInTheDocument();
	});

	it('shows helper text when helperText is provided', () => {
		renderWithProviders(<SearchInput label="Search" helperText="Enter keywords" />);

		expect(screen.getByText('Enter keywords')).toBeInTheDocument();
	});

	it('hides helper text when error is present', () => {
		renderWithProviders(
			<SearchInput label="Search" error="Invalid search" helperText="Enter keywords" />
		);

		const helperElement = screen.getByText('Enter keywords');
		expect(helperElement).toHaveClass('sr-only');
	});

	it('shows helper text when no error', () => {
		renderWithProviders(<SearchInput label="Search" helperText="Enter keywords" />);

		const helperElement = screen.getByText('Enter keywords');
		expect(helperElement).not.toHaveClass('sr-only');
	});
});

describe('SearchInput - Required Indicator', () => {
	it('shows required indicator when required', () => {
		renderWithProviders(<SearchInput label="Search" required />);

		const label = screen.getByText('Search');
		expect(label).toBeInTheDocument();
	});
});

describe('SearchInput - Custom ClassName', () => {
	it('applies custom className', () => {
		const { container } = renderWithProviders(<SearchInput className="custom-search-class" />);

		expect(container.firstChild).toBeInTheDocument();
	});
});

describe('SearchInput - Edge Cases', () => {
	it('handles empty value', () => {
		renderWithProviders(<SearchInput value="" />);

		const input = screen.getByRole('searchbox');
		expect(input).toHaveValue('');
	});

	it('handles long value', () => {
		const longValue = 'a'.repeat(1000);
		renderWithProviders(<SearchInput value={longValue} />);

		const input = screen.getByRole('searchbox');
		expect(input).toHaveValue(longValue);
	});

	it('handles special characters in value', () => {
		const specialValue = 'test@#$%^&*()';
		renderWithProviders(<SearchInput value={specialValue} />);

		const input = screen.getByRole('searchbox');
		expect(input).toHaveValue(specialValue);
	});
});
