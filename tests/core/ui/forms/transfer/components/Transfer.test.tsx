/**
 * Transfer Component Tests
 *
 * Tests for the Transfer component including:
 * - Rendering
 * - Props forwarding
 * - Integration with useTransfer hook
 */

import Transfer from '@core/ui/forms/transfer/Transfer';
import type { TransferProps } from '@src-types/ui/data/transfer';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import React from 'react';
import { describe, expect, it } from 'vitest';

const createTransferProps = (overrides?: Partial<TransferProps>): TransferProps => ({
	options: [
		{ value: '1', label: 'Option 1' },
		{ value: '2', label: 'Option 2' },
		{ value: '3', label: 'Option 3' },
	],
	...overrides,
});

describe('Transfer - Rendering', () => {
	it('renders transfer component', () => {
		const props = createTransferProps();
		renderWithProviders(<Transfer {...props} />);

		// Should render the transfer content
		const container = screen.getByLabelText(/transfer/i);
		expect(container).toBeInTheDocument();
	});

	it('renders with default props', () => {
		const props = createTransferProps();
		renderWithProviders(<Transfer {...props} />);

		// Should render source and target lists
		const sourceTitle = screen.getByText('Available');
		expect(sourceTitle).toBeInTheDocument();
		const targetTitle = screen.getByText('Selected');
		expect(targetTitle).toBeInTheDocument();
	});

	it('renders with custom source and target titles', () => {
		const props = createTransferProps({
			sourceTitle: 'Available Items',
			targetTitle: 'Selected Items',
		});
		renderWithProviders(<Transfer {...props} />);

		expect(screen.getByText('Available Items')).toBeInTheDocument();
		expect(screen.getByText('Selected Items')).toBeInTheDocument();
	});

	it('renders with custom transferId', () => {
		const props = createTransferProps({
			transferId: 'custom-transfer-id',
		});
		const { container } = renderWithProviders(<Transfer {...props} />);

		const transferElement = container.querySelector('#custom-transfer-id');
		expect(transferElement).toBeInTheDocument();
	});

	it('forwards className prop', () => {
		const props = createTransferProps({
			className: 'custom-transfer-class',
		});
		const { container } = renderWithProviders(<Transfer {...props} />);

		const transferElement = container.querySelector('.custom-transfer-class');
		expect(transferElement).toBeInTheDocument();
	});

	it('forwards data attributes', () => {
		const props = createTransferProps({
			'data-testid': 'transfer-component',
		} as Partial<TransferProps>);
		renderWithProviders(<Transfer {...props} />);

		expect(screen.getByTestId('transfer-component')).toBeInTheDocument();
	});
});

describe('Transfer - Controlled Mode', () => {
	it('renders with controlled value', () => {
		const props = createTransferProps({
			value: ['1', '2'],
		});
		renderWithProviders(<Transfer {...props} />);

		// Options 1 and 2 should be in target list
		// Option 3 should be in source list
		expect(screen.getByText('Option 3')).toBeInTheDocument();
	});

	it('updates when controlled value changes', () => {
		const props = createTransferProps({
			value: ['1'],
		});
		const { rerender } = renderWithProviders(<Transfer {...props} />);

		// Update value
		rerender(<Transfer {...props} value={['1', '2']} />);

		// Should reflect the change
		expect(screen.getByText('Option 3')).toBeInTheDocument();
	});
});

describe('Transfer - Uncontrolled Mode', () => {
	it('renders with defaultValue', () => {
		const props = createTransferProps({
			defaultValue: ['1'],
		});
		renderWithProviders(<Transfer {...props} />);

		// Should render with initial default value
		expect(screen.getByText('Option 2')).toBeInTheDocument();
		expect(screen.getByText('Option 3')).toBeInTheDocument();
	});
});

describe('Transfer - Customization', () => {
	it('renders with custom renderItem', () => {
		const renderItem = (option: { value: string; label: React.ReactNode }, isSelected: boolean) => (
			<div data-testid={`custom-item-${option.value}`}>
				Custom: {typeof option.label === 'string' ? option.label : 'item'}
			</div>
		);
		const props = createTransferProps({
			renderItem,
		});
		renderWithProviders(<Transfer {...props} />);

		expect(screen.getByTestId('custom-item-1')).toBeInTheDocument();
		expect(screen.getByText(/Custom: Option 1/)).toBeInTheDocument();
	});

	it('renders with custom renderEmpty', () => {
		const renderEmpty = (listType: 'source' | 'target') => (
			<div data-testid={`empty-${listType}`}>No {listType} items</div>
		);
		const props = createTransferProps({
			options: [],
			renderEmpty,
		});
		renderWithProviders(<Transfer {...props} />);

		expect(screen.getByTestId('empty-source')).toBeInTheDocument();
		expect(screen.getByTestId('empty-target')).toBeInTheDocument();
	});

	it('renders with showSearch false', () => {
		const props = createTransferProps({
			showSearch: false,
		});
		renderWithProviders(<Transfer {...props} />);

		// Search inputs should not be visible
		const searchInputs = screen.queryAllByPlaceholderText(/search/i);
		expect(searchInputs).toHaveLength(0);
	});

	it('renders with showSelectAll false', () => {
		const props = createTransferProps({
			showSelectAll: false,
		});
		renderWithProviders(<Transfer {...props} />);

		// Select all buttons should not be visible
		const selectAllButtons = screen.queryAllByText(/select all|deselect all/i);
		expect(selectAllButtons).toHaveLength(0);
	});
});

describe('Transfer - Size Variants', () => {
	it('renders with sm size', () => {
		const props = createTransferProps({
			size: 'sm',
		});
		renderWithProviders(<Transfer {...props} />);

		// Component should render with sm size
		expect(screen.getByLabelText(/transfer/i)).toBeInTheDocument();
	});

	it('renders with md size by default', () => {
		const props = createTransferProps();
		renderWithProviders(<Transfer {...props} />);

		// Component should render with default md size
		expect(screen.getByLabelText(/transfer/i)).toBeInTheDocument();
	});

	it('renders with lg size', () => {
		const props = createTransferProps({
			size: 'lg',
		});
		renderWithProviders(<Transfer {...props} />);

		// Component should render with lg size
		expect(screen.getByLabelText(/transfer/i)).toBeInTheDocument();
	});
});

describe('Transfer - Disabled State', () => {
	it('renders in disabled state', () => {
		const props = createTransferProps({
			disabled: true,
		});
		renderWithProviders(<Transfer {...props} />);

		// Component should render in disabled state
		expect(screen.getByLabelText(/transfer/i)).toBeInTheDocument();
	});
});
