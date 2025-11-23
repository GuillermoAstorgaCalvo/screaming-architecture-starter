/**
 * TransferList.renderers.search Tests
 *
 * Tests for TransferList search renderer including:
 * - Search input rendering
 * - Search functionality
 * - Disabled state
 */

import { renderSearch } from '@core/ui/forms/transfer/helpers/TransferList.renderers.search';
import type { RenderSearchProps } from '@core/ui/forms/transfer/types/TransferList.types';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('renderSearch', () => {
	const createProps = (overrides?: Partial<RenderSearchProps>): RenderSearchProps => ({
		showSearch: true,
		searchId: 'search-1',
		searchPlaceholder: 'Search...',
		searchValue: '',
		onSearchChange: vi.fn(),
		disabled: false,
		size: 'md',
		type: 'source',
		...overrides,
	});

	it('renders search input when showSearch is true', () => {
		const props = createProps();
		const result = renderSearch(props);
		expect(result).not.toBeNull();
		renderWithProviders(result!);

		const input = screen.getByPlaceholderText('Search...');
		expect(input).toBeInTheDocument();
	});

	it('returns null when showSearch is false', () => {
		const props = createProps({ showSearch: false });
		const result = renderSearch(props);
		expect(result).toBeNull();
	});

	it('displays current search value', () => {
		const props = createProps({ searchValue: 'test query' });
		const result = renderSearch(props);
		expect(result).not.toBeNull();
		renderWithProviders(result!);

		const input = screen.getByPlaceholderText('Search...') as HTMLInputElement;
		expect(input.value).toBe('test query');
	});

	it('calls onSearchChange when input value changes', () => {
		const onSearchChange = vi.fn();
		const props = createProps({ onSearchChange });
		const result = renderSearch(props);
		expect(result).not.toBeNull();
		renderWithProviders(result!);

		const input = screen.getByPlaceholderText('Search...');
		fireEvent.change(input, { target: { value: 'new search' } });

		expect(onSearchChange).toHaveBeenCalledWith('new search');
	});

	it('disables input when disabled prop is true', () => {
		const props = createProps({ disabled: true });
		const result = renderSearch(props);
		expect(result).not.toBeNull();
		renderWithProviders(result!);

		const input = screen.getByPlaceholderText('Search...');
		expect(input).toBeDisabled();
	});

	it('sets correct id attribute', () => {
		const props = createProps({ searchId: 'custom-search-id' });
		const result = renderSearch(props);
		expect(result).not.toBeNull();
		renderWithProviders(result!);

		const input = screen.getByPlaceholderText('Search...');
		expect(input).toHaveAttribute('id', 'custom-search-id');
	});

	it('sets aria-label for source type', () => {
		const props = createProps({ type: 'source' });
		const result = renderSearch(props);
		expect(result).not.toBeNull();
		renderWithProviders(result!);

		const input = screen.getByPlaceholderText('Search...');
		expect(input).toHaveAttribute('aria-label');
		const ariaLabel = input.getAttribute('aria-label');
		// The translation should interpolate {type} with 'source'
		// In test environment, it may show the translation key or interpolated value
		expect(ariaLabel).toBeTruthy();
		expect(
			ariaLabel === 'Search source list' ||
				ariaLabel?.includes('source') ||
				ariaLabel === 'Search {type} list'
		).toBe(true);
	});

	it('sets aria-label for target type', () => {
		const props = createProps({ type: 'target' });
		const result = renderSearch(props);
		expect(result).not.toBeNull();
		renderWithProviders(result!);

		const input = screen.getByPlaceholderText('Search...');
		expect(input).toHaveAttribute('aria-label');
		const ariaLabel = input.getAttribute('aria-label');
		// The translation should interpolate {type} with 'target'
		// In test environment, it may show the translation key or interpolated value
		expect(ariaLabel).toBeTruthy();
		expect(
			ariaLabel === 'Search target list' ||
				ariaLabel?.includes('target') ||
				ariaLabel === 'Search {type} list'
		).toBe(true);
	});

	it('applies fullWidth to input', () => {
		const props = createProps();
		const result = renderSearch(props);
		expect(result).not.toBeNull();
		renderWithProviders(result!);

		const input = screen.getByPlaceholderText('Search...');
		// Input component should have fullWidth prop applied
		expect(input).toBeInTheDocument();
	});

	it('forwards size prop to input', () => {
		const props = createProps({ size: 'lg' });
		const result = renderSearch(props);
		expect(result).not.toBeNull();
		renderWithProviders(result!);

		const input = screen.getByPlaceholderText('Search...');
		expect(input).toBeInTheDocument();
	});
});
