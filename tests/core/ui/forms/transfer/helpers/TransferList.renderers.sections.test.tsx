/**
 * TransferList.renderers.sections Tests
 *
 * Tests for TransferList section renderers including:
 * - Header section rendering
 * - Search section rendering
 * - List section rendering
 */

import {
	renderHeaderSection,
	renderListSection,
	renderSearchSection,
} from '@core/ui/forms/transfer/helpers/TransferList.renderers.sections';
import type {
	TransferListContentProps,
	TransferListSetup,
} from '@core/ui/forms/transfer/types/TransferList.types';
import type { TransferOption } from '@src-types/ui/data/transfer';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('renderHeaderSection', () => {
	const createSetup = (): TransferListSetup<unknown> => ({
		searchId: 'search-1',
		headerId: 'header-1',
		enabledOptions: [],
		allSelected: false,
		handleSelectAllToggle: vi.fn(),
		containerClasses: 'container',
		headerClasses: 'header',
		listContainerClasses: 'list-container',
	});

	const createProps = (
		overrides?: Partial<TransferListContentProps<unknown>>
	): TransferListContentProps<unknown> => ({
		type: 'source',
		options: [],
		selectedValues: new Set(),
		searchValue: '',
		onSearchChange: vi.fn(),
		onItemToggle: vi.fn(),
		title: 'Source List',
		searchPlaceholder: 'Search...',
		showSearch: true,
		size: 'md',
		disabled: false,
		renderItem: undefined,
		renderEmpty: undefined,
		maxHeight: 300,
		showSelectAll: true,
		labels: undefined,
		...overrides,
	});

	it('renders header with title', () => {
		const setup = createSetup();
		const props = createProps();
		renderWithProviders(renderHeaderSection(setup, props));

		expect(screen.getByText('Source List')).toBeInTheDocument();
	});

	it('renders select all button when showSelectAll is true and options exist', () => {
		const setup = {
			...createSetup(),
			enabledOptions: [{ value: '1', label: 'Option 1' }] as TransferOption[],
		};
		const props = createProps();
		renderWithProviders(renderHeaderSection(setup, props));

		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('does not render select all button when showSelectAll is false', () => {
		const setup = {
			...createSetup(),
			enabledOptions: [{ value: '1', label: 'Option 1' }] as TransferOption[],
		};
		const props = createProps({ showSelectAll: false });
		renderWithProviders(renderHeaderSection(setup, props));

		const selectAllButton = screen.queryByRole('button', { name: /select all|deselect all/i });
		expect(selectAllButton).not.toBeInTheDocument();
	});

	it('does not render select all button when no enabled options', () => {
		const setup = {
			...createSetup(),
			enabledOptions: [],
		};
		const props = createProps();
		renderWithProviders(renderHeaderSection(setup, props));

		const button = screen.queryByRole('button');
		expect(button).not.toBeInTheDocument();
	});

	it('sets correct header id', () => {
		const setup = {
			...createSetup(),
			headerId: 'custom-header-id',
		};
		const props = createProps();
		const { container } = renderWithProviders(renderHeaderSection(setup, props));

		const header = container.querySelector('#custom-header-id');
		expect(header).toBeInTheDocument();
	});
});

describe('renderSearchSection', () => {
	const createSetup = (): TransferListSetup<unknown> => ({
		searchId: 'search-1',
		headerId: 'header-1',
		enabledOptions: [],
		allSelected: false,
		handleSelectAllToggle: vi.fn(),
		containerClasses: 'container',
		headerClasses: 'header',
		listContainerClasses: 'list-container',
	});

	const createProps = (
		overrides?: Partial<TransferListContentProps<unknown>>
	): TransferListContentProps<unknown> => ({
		type: 'source',
		options: [],
		selectedValues: new Set(),
		searchValue: '',
		onSearchChange: vi.fn(),
		onItemToggle: vi.fn(),
		title: 'Source List',
		searchPlaceholder: 'Search...',
		showSearch: true,
		size: 'md',
		disabled: false,
		renderItem: undefined,
		renderEmpty: undefined,
		maxHeight: 300,
		showSelectAll: true,
		labels: undefined,
		...overrides,
	});

	it('renders search input when showSearch is true', () => {
		const setup = createSetup();
		const props = createProps();
		const result = renderSearchSection(setup, props);
		if (result) {
			renderWithProviders(result);
			expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
		}
	});

	it('does not render search when showSearch is false', () => {
		const setup = createSetup();
		const props = createProps({ showSearch: false });
		const result = renderSearchSection(setup, props);
		expect(result).toBeNull();
	});

	it('uses correct search id from setup', () => {
		const setup = {
			...createSetup(),
			searchId: 'custom-search-id',
		};
		const props = createProps();
		const result = renderSearchSection(setup, props);
		if (result) {
			renderWithProviders(result);
			const input = screen.getByPlaceholderText('Search...');
			expect(input).toHaveAttribute('id', 'custom-search-id');
		}
	});
});

describe('renderListSection', () => {
	const createSetup = (): TransferListSetup<unknown> => ({
		searchId: 'search-1',
		headerId: 'header-1',
		enabledOptions: [],
		allSelected: false,
		handleSelectAllToggle: vi.fn(),
		containerClasses: 'container',
		headerClasses: 'header',
		listContainerClasses: 'list-container',
	});

	const createProps = (
		overrides?: Partial<TransferListContentProps<unknown>>
	): TransferListContentProps<unknown> => ({
		type: 'source',
		options: [],
		selectedValues: new Set(),
		searchValue: '',
		onSearchChange: vi.fn(),
		onItemToggle: vi.fn(),
		title: 'Source List',
		searchPlaceholder: 'Search...',
		showSearch: true,
		size: 'md',
		disabled: false,
		renderItem: undefined,
		renderEmpty: undefined,
		maxHeight: 300,
		showSelectAll: true,
		labels: undefined,
		...overrides,
	});

	it('renders list with options', () => {
		const setup = createSetup();
		const props = createProps({
			options: [
				{ value: '1', label: 'Option 1' },
				{ value: '2', label: 'Option 2' },
			] as TransferOption[],
		});
		renderWithProviders(renderListSection(setup, props));

		// Options should be rendered - check for text content
		expect(screen.getByText(/option 1/i)).toBeInTheDocument();
		expect(screen.getByText(/option 2/i)).toBeInTheDocument();
	});

	it('renders empty state when no options', () => {
		const setup = createSetup();
		const props = createProps({ options: [] });
		renderWithProviders(renderListSection(setup, props));

		expect(screen.getByText('No items available')).toBeInTheDocument();
	});

	it('uses correct header id from setup', () => {
		const setup = {
			...createSetup(),
			headerId: 'custom-header-id',
		};
		const props = createProps();
		const { container } = renderWithProviders(renderListSection(setup, props));

		const listContainer = container.querySelector('.list-container');
		expect(listContainer).toHaveAttribute('aria-labelledby', 'custom-header-id');
	});

	it('uses correct list container classes from setup', () => {
		const setup = {
			...createSetup(),
			listContainerClasses: 'custom-list-container',
		};
		const props = createProps();
		const { container } = renderWithProviders(renderListSection(setup, props));

		const listContainer = container.querySelector('.custom-list-container');
		expect(listContainer).toBeInTheDocument();
	});
});
