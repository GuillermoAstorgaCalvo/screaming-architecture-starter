/**
 * SearchInputField Component Tests
 *
 * Tests for the SearchInputField component including:
 * - Rendering
 * - Input attributes
 * - Search icon display
 * - Clear button functionality
 * - User interactions
 * - Accessibility
 * - Disabled states
 * - Error states
 */

import { SearchInputField } from '@core/ui/forms/search-input/components/SearchInputField';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const INPUT_ID = 'search-input-test';
const INPUT_CLASSNAME = 'test-input-class';
const ARIA_DESCRIBEDBY = 'aria-describedby';

function createSearchInputFieldProps(overrides?: Partial<Parameters<typeof SearchInputField>[0]>) {
	return {
		id: INPUT_ID,
		className: INPUT_CLASSNAME,
		hasError: false,
		ariaDescribedBy: undefined,
		value: '',
		onClear: vi.fn(),
		showClearButton: true,
		props: {},
		...overrides,
	};
}

describe('SearchInputField - Rendering', () => {
	it('renders search input element', () => {
		const { container } = renderWithProviders(
			<SearchInputField {...createSearchInputFieldProps()} />
		);
		const input = container.querySelector('input[type="search"]') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input.tagName).toBe('INPUT');
		expect(input).toHaveAttribute('type', 'search');
	});

	it('applies id attribute', () => {
		const { container } = renderWithProviders(
			<SearchInputField {...createSearchInputFieldProps()} />
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toHaveAttribute('id', INPUT_ID);
	});

	it('applies className to input', () => {
		const { container } = renderWithProviders(
			<SearchInputField {...createSearchInputFieldProps()} />
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toHaveClass(INPUT_CLASSNAME);
	});

	it('renders search icon', () => {
		const { container } = renderWithProviders(
			<SearchInputField {...createSearchInputFieldProps()} />
		);
		// Search icon is in a div with pointer-events-none and absolute positioning
		const iconContainer = container.querySelector('.pointer-events-none.absolute');
		expect(iconContainer).toBeInTheDocument();
	});

	it('renders clear button when showClearButton is true and value is present', () => {
		renderWithProviders(<SearchInputField {...createSearchInputFieldProps({ value: 'test' })} />);
		const clearButton = screen.getByLabelText(/clear.*search/i);
		expect(clearButton).toBeInTheDocument();
	});

	it('does not render clear button when showClearButton is false', () => {
		renderWithProviders(
			<SearchInputField
				{...createSearchInputFieldProps({ value: 'test', showClearButton: false })}
			/>
		);
		const clearButton = screen.queryByLabelText(/clear.*search/i);
		expect(clearButton).not.toBeInTheDocument();
	});

	it('does not render clear button when value is empty', () => {
		renderWithProviders(<SearchInputField {...createSearchInputFieldProps({ value: '' })} />);
		const clearButton = screen.queryByLabelText(/clear.*search/i);
		expect(clearButton).not.toBeInTheDocument();
	});
});

describe('SearchInputField - Input Attributes', () => {
	it('applies disabled attribute when disabled', () => {
		const { container } = renderWithProviders(
			<SearchInputField {...createSearchInputFieldProps({ disabled: true })} />
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toBeDisabled();
	});

	it('applies required attribute when required', () => {
		const { container } = renderWithProviders(
			<SearchInputField {...createSearchInputFieldProps({ required: true })} />
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toBeRequired();
	});

	it('applies aria-invalid when hasError is true', () => {
		const { container } = renderWithProviders(
			<SearchInputField {...createSearchInputFieldProps({ hasError: true })} />
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toHaveAttribute('aria-invalid', 'true');
	});

	it('applies aria-describedby when provided', () => {
		const { container } = renderWithProviders(
			<SearchInputField {...createSearchInputFieldProps({ ariaDescribedBy: ARIA_DESCRIBEDBY })} />
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toHaveAttribute('aria-describedby', ARIA_DESCRIBEDBY);
	});

	it('displays value in input', () => {
		renderWithProviders(
			<SearchInputField {...createSearchInputFieldProps({ value: 'test query' })} />
		);
		const input = screen.getByRole('searchbox');
		expect(input).toHaveValue('test query');
	});

	it('forwards input props to input element', () => {
		renderWithProviders(
			<SearchInputField
				{...createSearchInputFieldProps({
					props: { placeholder: 'Search...' },
				})}
			/>
		);
		const input = screen.getByPlaceholderText('Search...');
		expect(input).toBeInTheDocument();
	});
});

describe('SearchInputField - Clear Button', () => {
	it('calls onClear when clear button is clicked', () => {
		const onClear = vi.fn();

		renderWithProviders(
			<SearchInputField {...createSearchInputFieldProps({ value: 'test', onClear })} />
		);

		const clearButton = screen.getByLabelText(/clear.*search/i);
		fireEvent.click(clearButton);

		expect(onClear).toHaveBeenCalledTimes(1);
	});

	it('disables clear button when disabled', () => {
		renderWithProviders(
			<SearchInputField {...createSearchInputFieldProps({ value: 'test', disabled: true })} />
		);

		const clearButton = screen.getByLabelText(/clear.*search/i);
		expect(clearButton).toBeDisabled();
	});

	it('does not call onClear when disabled', () => {
		const onClear = vi.fn();

		renderWithProviders(
			<SearchInputField
				{...createSearchInputFieldProps({ value: 'test', disabled: true, onClear })}
			/>
		);

		const clearButton = screen.getByLabelText(/clear.*search/i);
		fireEvent.click(clearButton);

		expect(onClear).not.toHaveBeenCalled();
	});

	it('has accessible label on clear button', () => {
		renderWithProviders(<SearchInputField {...createSearchInputFieldProps({ value: 'test' })} />);

		const clearButton = screen.getByLabelText(/clear.*search/i);
		expect(clearButton).toBeInTheDocument();
	});
});

describe('SearchInputField - User Interactions', () => {
	it('handles input change events', () => {
		const onChange = vi.fn();

		renderWithProviders(
			<SearchInputField
				{...createSearchInputFieldProps({
					props: { onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value) },
				})}
			/>
		);

		const input = screen.getByRole('searchbox');
		fireEvent.change(input, { target: { value: 'new query' } });

		expect(onChange).toHaveBeenCalled();
	});

	it('handles focus events', () => {
		const onFocus = vi.fn();

		renderWithProviders(
			<SearchInputField
				{...createSearchInputFieldProps({
					props: { onFocus },
				})}
			/>
		);

		const input = screen.getByRole('searchbox');
		fireEvent.focus(input);

		expect(onFocus).toHaveBeenCalled();
	});

	it('handles blur events', () => {
		const onBlur = vi.fn();

		renderWithProviders(
			<SearchInputField
				{...createSearchInputFieldProps({
					props: { onBlur },
				})}
			/>
		);

		const input = screen.getByRole('searchbox');
		fireEvent.blur(input);

		expect(onBlur).toHaveBeenCalled();
	});
});

describe('SearchInputField - Accessibility', () => {
	it('has correct ARIA attributes', () => {
		const { container } = renderWithProviders(
			<SearchInputField
				{...createSearchInputFieldProps({
					hasError: true,
					ariaDescribedBy: ARIA_DESCRIBEDBY,
				})}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input).toHaveAttribute('aria-describedby', ARIA_DESCRIBEDBY);
	});

	it('has role="searchbox"', () => {
		renderWithProviders(<SearchInputField {...createSearchInputFieldProps()} />);
		const input = screen.getByRole('searchbox');
		expect(input).toBeInTheDocument();
	});
});

describe('SearchInputField - Layout', () => {
	it('has relative positioning for icon and button', () => {
		const { container } = renderWithProviders(
			<SearchInputField {...createSearchInputFieldProps()} />
		);
		const wrapper = container.querySelector('.relative');
		expect(wrapper).toBeInTheDocument();
	});

	it('positions search icon on the left', () => {
		const { container } = renderWithProviders(
			<SearchInputField {...createSearchInputFieldProps()} />
		);
		const iconContainer = container.querySelector('[class*="left-0"]');
		expect(iconContainer).toBeInTheDocument();
	});

	it('positions clear button on the right', () => {
		renderWithProviders(<SearchInputField {...createSearchInputFieldProps({ value: 'test' })} />);
		const clearButton = screen.getByLabelText(/clear.*search/i);
		expect(clearButton).toBeInTheDocument();
	});
});

describe('SearchInputField - Edge Cases', () => {
	it('handles empty value', () => {
		renderWithProviders(<SearchInputField {...createSearchInputFieldProps({ value: '' })} />);
		const input = screen.getByRole('searchbox');
		expect(input).toHaveValue('');
	});

	it('handles undefined value', () => {
		renderWithProviders(
			<SearchInputField {...createSearchInputFieldProps({ value: undefined })} />
		);
		const input = screen.getByRole('searchbox');
		expect(input).toHaveValue('');
	});

	it('handles long value', () => {
		const longValue = 'a'.repeat(1000);
		renderWithProviders(
			<SearchInputField {...createSearchInputFieldProps({ value: longValue })} />
		);
		const input = screen.getByRole('searchbox');
		expect(input).toHaveValue(longValue);
	});

	it('handles special characters in value', () => {
		const specialValue = 'test@#$%^&*()';
		renderWithProviders(
			<SearchInputField {...createSearchInputFieldProps({ value: specialValue })} />
		);
		const input = screen.getByRole('searchbox');
		expect(input).toHaveValue(specialValue);
	});

	it('handles rapid clear button clicks', () => {
		const onClear = vi.fn();

		renderWithProviders(
			<SearchInputField {...createSearchInputFieldProps({ value: 'test', onClear })} />
		);

		const clearButton = screen.getByLabelText(/clear.*search/i);
		fireEvent.click(clearButton);
		fireEvent.click(clearButton);
		fireEvent.click(clearButton);

		expect(onClear).toHaveBeenCalledTimes(3);
	});
});
