/**
 * TransferList Component Tests
 *
 * Tests for the TransferList component including:
 * - Rendering
 * - Props forwarding
 * - Search functionality
 * - Selection handling
 * - Custom renderers
 */

import { TransferList } from '@core/ui/forms/transfer/components/TransferList';
import type { TransferListProps } from '@core/ui/forms/transfer/types/TransferList.types';
import type { TransferOption } from '@src-types/ui/data/transfer';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const createTransferListProps = (
	overrides?: Partial<TransferListProps<unknown>>
): TransferListProps<unknown> => ({
	type: 'source',
	options: [
		{ value: '1', label: 'Option 1' },
		{ value: '2', label: 'Option 2' },
		{ value: '3', label: 'Option 3' },
	],
	selectedValues: new Set(['1']),
	searchValue: '',
	onSearchChange: vi.fn(),
	onItemToggle: vi.fn(),
	onSelectAll: vi.fn(),
	onSelectNone: vi.fn(),
	title: 'Source List',
	...overrides,
});

describe('TransferList - Rendering', () => {
	it('renders transfer list', () => {
		const props = createTransferListProps();
		renderWithProviders(<TransferList {...props} />);

		expect(screen.getByText('Source List')).toBeInTheDocument();
	});

	it('renders list items', () => {
		const props = createTransferListProps();
		renderWithProviders(<TransferList {...props} />);

		expect(screen.getByText('Option 1')).toBeInTheDocument();
		expect(screen.getByText('Option 2')).toBeInTheDocument();
		expect(screen.getByText('Option 3')).toBeInTheDocument();
	});

	it('renders search input by default', () => {
		const props = createTransferListProps();
		renderWithProviders(<TransferList {...props} />);

		const searchInput = screen.getByPlaceholderText(/search/i);
		expect(searchInput).toBeInTheDocument();
	});

	it('renders select all button by default', () => {
		const props = createTransferListProps();
		renderWithProviders(<TransferList {...props} />);

		const selectAllButton = screen.getByText(/select all|common\.selectall/i);
		expect(selectAllButton).toBeInTheDocument();
	});
});

describe('TransferList - Type Variants', () => {
	it('renders source type list', () => {
		const props = createTransferListProps({ type: 'source' });
		renderWithProviders(<TransferList {...props} />);

		expect(screen.getByText('Source List')).toBeInTheDocument();
	});

	it('renders target type list', () => {
		const props = createTransferListProps({
			type: 'target',
			title: 'Target List',
		});
		renderWithProviders(<TransferList {...props} />);

		expect(screen.getByText('Target List')).toBeInTheDocument();
	});
});

describe('TransferList - Search Functionality', () => {
	it('calls onSearchChange when search value changes', () => {
		const onSearchChange = vi.fn();
		const props = createTransferListProps({ onSearchChange });
		renderWithProviders(<TransferList {...props} />);

		const searchInput = screen.getByPlaceholderText(/search/i);
		fireEvent.change(searchInput, { target: { value: 'test' } });

		expect(onSearchChange).toHaveBeenCalledWith('test');
	});

	it('displays current search value', () => {
		const props = createTransferListProps({ searchValue: 'current search' });
		renderWithProviders(<TransferList {...props} />);

		const searchInput = screen.getByPlaceholderText(/search/i);
		expect(searchInput).toHaveValue('current search');
	});

	it('hides search when showSearch is false', () => {
		const props = createTransferListProps({ showSearch: false });
		renderWithProviders(<TransferList {...props} />);

		const searchInput = screen.queryByPlaceholderText(/search/i);
		expect(searchInput).not.toBeInTheDocument();
	});
});

describe('TransferList - Selection', () => {
	it('renders selected items with checked checkboxes', () => {
		const props = createTransferListProps({
			selectedValues: new Set(['1', '3']),
		});
		renderWithProviders(<TransferList {...props} />);

		const checkboxes = screen.getAllByRole('checkbox');
		expect(checkboxes[0]).toBeChecked();
		expect(checkboxes[1]).not.toBeChecked();
		expect(checkboxes[2]).toBeChecked();
	});

	it('calls onItemToggle when item is clicked', () => {
		const onItemToggle = vi.fn();
		const props = createTransferListProps({ onItemToggle });
		renderWithProviders(<TransferList {...props} />);

		const checkboxes = screen.getAllByRole('checkbox');
		expect(checkboxes[0]).toBeDefined();
		fireEvent.click(checkboxes[0]!);

		expect(onItemToggle).toHaveBeenCalledWith('1');
	});

	it('calls onSelectAll when select all button is clicked', () => {
		const onSelectAll = vi.fn();
		const props = createTransferListProps({
			selectedValues: new Set(),
			onSelectAll,
		});
		renderWithProviders(<TransferList {...props} />);

		const selectAllButton = screen.getByText(/select all|common\.selectall/i);
		fireEvent.click(selectAllButton);

		expect(onSelectAll).toHaveBeenCalled();
	});

	it('calls onSelectNone when deselect all button is clicked', () => {
		const onSelectNone = vi.fn();
		const props = createTransferListProps({
			selectedValues: new Set(['1', '2', '3']),
			onSelectNone,
		});
		renderWithProviders(<TransferList {...props} />);

		const deselectButton = screen.getByText(/deselect all|common\.deselectall/i);
		fireEvent.click(deselectButton);

		expect(onSelectNone).toHaveBeenCalled();
	});
});

describe('TransferList - Custom Renderers', () => {
	it('uses custom renderItem when provided', () => {
		const renderItem = (option: TransferOption) => (
			<div data-testid={`custom-${option.value}`}>Custom: {option.label}</div>
		);
		const props = createTransferListProps({ renderItem });
		renderWithProviders(<TransferList {...props} />);

		expect(screen.getByTestId('custom-1')).toBeInTheDocument();
		expect(screen.getByText(/Custom: Option 1/)).toBeInTheDocument();
	});

	it('uses custom renderEmpty when provided', () => {
		const renderEmpty = () => <div data-testid="custom-empty">No items</div>;
		const props = createTransferListProps({
			options: [],
			renderEmpty,
		});
		renderWithProviders(<TransferList {...props} />);

		expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
	});
});

describe('TransferList - Disabled State', () => {
	it('disables interactions when disabled is true', () => {
		const onItemToggle = vi.fn();
		const props = createTransferListProps({
			disabled: true,
			onItemToggle,
		});
		renderWithProviders(<TransferList {...props} />);

		const listItems = screen.getAllByRole('listitem');
		expect(listItems[0]).toBeDefined();
		fireEvent.click(listItems[0]!);

		expect(onItemToggle).not.toHaveBeenCalled();
	});

	it('disables checkboxes when disabled is true', () => {
		const props = createTransferListProps({ disabled: true });
		renderWithProviders(<TransferList {...props} />);

		const checkboxes = screen.getAllByRole('checkbox');
		for (const checkbox of checkboxes) {
			expect(checkbox).toBeDisabled();
		}
	});

	it('disables search input when disabled is true', () => {
		const props = createTransferListProps({ disabled: true });
		renderWithProviders(<TransferList {...props} />);

		const searchInput = screen.getByPlaceholderText(/search/i);
		expect(searchInput).toBeDisabled();
	});
});

describe('TransferList - Size Variants', () => {
	it('renders with sm size', () => {
		const props = createTransferListProps({ size: 'sm' });
		renderWithProviders(<TransferList {...props} />);

		expect(screen.getByText('Source List')).toBeInTheDocument();
	});

	it('renders with md size', () => {
		const props = createTransferListProps({ size: 'md' });
		renderWithProviders(<TransferList {...props} />);

		expect(screen.getByText('Source List')).toBeInTheDocument();
	});

	it('renders with lg size', () => {
		const props = createTransferListProps({ size: 'lg' });
		renderWithProviders(<TransferList {...props} />);

		expect(screen.getByText('Source List')).toBeInTheDocument();
	});
});

describe('TransferList - Custom Labels', () => {
	it('uses custom selectAll label', () => {
		const props = createTransferListProps({
			labels: { selectAll: 'Custom Select All' },
		});
		renderWithProviders(<TransferList {...props} />);

		expect(screen.getByText('Custom Select All')).toBeInTheDocument();
	});

	it('uses custom selectNone label', () => {
		const props = createTransferListProps({
			selectedValues: new Set(['1', '2', '3']),
			labels: { selectNone: 'Custom Deselect All' },
		});
		renderWithProviders(<TransferList {...props} />);

		expect(screen.getByText('Custom Deselect All')).toBeInTheDocument();
	});
});
