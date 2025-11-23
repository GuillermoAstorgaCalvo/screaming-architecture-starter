/**
 * Tests for CommandPaletteSearchInput component
 *
 * Tests the search input component:
 * - Rendering
 * - User interactions
 * - Props handling
 * - Accessibility
 */

import { CommandPaletteSearchInput } from '@core/ui/overlays/command-palette/components/CommandPaletteSearchInput';
import type { CommandPaletteSearchInputProps } from '@core/ui/overlays/command-palette/types/CommandPaletteParts.types';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

const createMockProps = (
	overrides?: Partial<CommandPaletteSearchInputProps>
): CommandPaletteSearchInputProps => ({
	searchQuery: '',
	onSearchChange: vi.fn(),
	searchInputRef: createRef<HTMLInputElement>(),
	placeholder: 'Search commands...',
	searchIcon: <span data-testid="search-icon">🔍</span>,
	...overrides,
});

describe('CommandPaletteSearchInput - Rendering', () => {
	it('renders search input element', () => {
		const props = createMockProps();
		renderWithProviders(<CommandPaletteSearchInput {...props} />);

		const input = screen.getByRole('textbox');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'text');
	});

	it('renders with placeholder', () => {
		const props = createMockProps({ placeholder: 'Type to search...' });
		renderWithProviders(<CommandPaletteSearchInput {...props} />);

		expect(screen.getByPlaceholderText('Type to search...')).toBeInTheDocument();
	});

	it('displays search query value', () => {
		const props = createMockProps({ searchQuery: 'test query' });
		renderWithProviders(<CommandPaletteSearchInput {...props} />);

		const input = screen.getByRole('textbox');
		expect(input).toHaveValue('test query');
	});

	it('renders search icon', () => {
		const props = createMockProps();
		renderWithProviders(<CommandPaletteSearchInput {...props} />);

		expect(screen.getByTestId('search-icon')).toBeInTheDocument();
	});

	it('renders without search icon when not provided', () => {
		const props = createMockProps({ searchIcon: undefined });
		const { container } = renderWithProviders(<CommandPaletteSearchInput {...props} />);

		const iconContainer = container.querySelector('.pointer-events-none.absolute');
		expect(iconContainer).toBeInTheDocument();
		expect(iconContainer?.textContent).toBe('');
	});

	it('applies correct CSS classes', () => {
		const props = createMockProps();
		renderWithProviders(<CommandPaletteSearchInput {...props} />);

		const input = screen.getByRole('textbox');
		expect(input).toHaveClass('w-full', 'rounded-md', 'border');
	});
});

describe('CommandPaletteSearchInput - Interactions', () => {
	it('calls onSearchChange when input value changes', () => {
		const onSearchChange = vi.fn();
		const props = createMockProps({ onSearchChange });
		renderWithProviders(<CommandPaletteSearchInput {...props} />);

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: 'new query' } });

		expect(onSearchChange).toHaveBeenCalledTimes(1);
		expect(onSearchChange).toHaveBeenCalledWith('new query');
	});

	it('calls onSearchChange with empty string when cleared', () => {
		const onSearchChange = vi.fn();
		const props = createMockProps({ searchQuery: 'test', onSearchChange });
		renderWithProviders(<CommandPaletteSearchInput {...props} />);

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: '' } });

		expect(onSearchChange).toHaveBeenCalledWith('');
	});

	it('updates input value when searchQuery prop changes', () => {
		const props = createMockProps({ searchQuery: 'initial' });
		const { rerender } = renderWithProviders(<CommandPaletteSearchInput {...props} />);

		let input = screen.getByRole('textbox');
		expect(input).toHaveValue('initial');

		rerender(<CommandPaletteSearchInput {...props} searchQuery="updated" />);

		input = screen.getByRole('textbox');
		expect(input).toHaveValue('updated');
	});

	it('handles special characters in input', () => {
		const onSearchChange = vi.fn();
		const props = createMockProps({ onSearchChange });
		renderWithProviders(<CommandPaletteSearchInput {...props} />);

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: 'test@#$%' } });

		expect(onSearchChange).toHaveBeenCalledWith('test@#$%');
	});

	it('handles long input values', () => {
		const onSearchChange = vi.fn();
		const longValue = 'a'.repeat(1000);
		const props = createMockProps({ onSearchChange });
		renderWithProviders(<CommandPaletteSearchInput {...props} />);

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: longValue } });

		expect(onSearchChange).toHaveBeenCalledWith(longValue);
	});
});

describe('CommandPaletteSearchInput - Refs', () => {
	it('assigns ref to input element', () => {
		const searchInputRef = createRef<HTMLInputElement>();
		const props = createMockProps({ searchInputRef });
		renderWithProviders(<CommandPaletteSearchInput {...props} />);

		expect(searchInputRef.current).toBeInstanceOf(HTMLInputElement);
		expect(searchInputRef.current).toBe(screen.getByRole('textbox'));
	});

	it('updates ref when input element changes', () => {
		const searchInputRef = createRef<HTMLInputElement>();
		const props = createMockProps({ searchInputRef });
		const { rerender } = renderWithProviders(<CommandPaletteSearchInput {...props} />);

		expect(searchInputRef.current).toBeInstanceOf(HTMLInputElement);

		rerender(<CommandPaletteSearchInput {...props} searchQuery="updated" />);

		expect(searchInputRef.current).toBeInstanceOf(HTMLInputElement);
	});
});

describe('CommandPaletteSearchInput - Accessibility', () => {
	it('has correct ARIA label', () => {
		const props = createMockProps();
		renderWithProviders(<CommandPaletteSearchInput {...props} />);

		const input = screen.getByLabelText(/search.*commands/i);
		expect(input).toBeInTheDocument();
	});

	it('has accessible input element', () => {
		const props = createMockProps();
		renderWithProviders(<CommandPaletteSearchInput {...props} />);

		const input = screen.getByRole('textbox');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'text');
	});

	it('passes accessibility checks', async () => {
		const props = createMockProps();
		const { container } = renderWithProviders(<CommandPaletteSearchInput {...props} />);

		await expectA11y(container);
	});

	it('has proper input attributes', () => {
		const props = createMockProps({ placeholder: 'Search...' });
		renderWithProviders(<CommandPaletteSearchInput {...props} />);

		const input = screen.getByRole('textbox');
		expect(input).toHaveAttribute('placeholder', 'Search...');
		expect(input).toHaveAttribute('type', 'text');
	});
});

describe('CommandPaletteSearchInput - Edge Cases', () => {
	it('handles empty search query', () => {
		const props = createMockProps({ searchQuery: '' });
		renderWithProviders(<CommandPaletteSearchInput {...props} />);

		const input = screen.getByRole('textbox');
		expect(input).toHaveValue('');
	});

	it('handles undefined placeholder gracefully', () => {
		const props = createMockProps({});
		renderWithProviders(<CommandPaletteSearchInput {...props} />);

		const input = screen.getByRole('textbox');
		expect(input).toBeInTheDocument();
	});

	it('handles rapid input changes', () => {
		const onSearchChange = vi.fn();
		const props = createMockProps({ onSearchChange });
		renderWithProviders(<CommandPaletteSearchInput {...props} />);

		const input = screen.getByRole('textbox');
		for (let i = 0; i < 10; i++) {
			fireEvent.change(input, { target: { value: `query${i}` } });
		}

		expect(onSearchChange).toHaveBeenCalledTimes(10);
	});

	it('handles whitespace-only input', () => {
		const onSearchChange = vi.fn();
		const props = createMockProps({ onSearchChange });
		renderWithProviders(<CommandPaletteSearchInput {...props} />);

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: '   ' } });

		expect(onSearchChange).toHaveBeenCalledWith('   ');
	});
});
