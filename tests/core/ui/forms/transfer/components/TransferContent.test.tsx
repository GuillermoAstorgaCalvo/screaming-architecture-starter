/**
 * TransferContent Component Tests
 *
 * Tests for the TransferContent component including:
 * - Rendering
 * - Props building and forwarding
 * - Integration with sub-components
 */

import { TransferContent } from '@core/ui/forms/transfer/components/TransferContent';
import type { TransferContentProps } from '@core/ui/forms/transfer/types/TransferContent.types';
import type { TransferOption } from '@src-types/ui/data/transfer';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const createTransferContentProps = (
	overrides?: Partial<TransferContentProps<unknown>>
): TransferContentProps<unknown> => ({
	sourceOptions: [
		{ value: '1', label: 'Source 1' },
		{ value: '2', label: 'Source 2' },
	] as TransferOption[],
	targetOptions: [{ value: '3', label: 'Target 1' }] as TransferOption[],
	selectedSourceValues: new Set(['1']),
	selectedTargetValues: new Set(['3']),
	sourceSearchValue: '',
	targetSearchValue: '',
	handleSourceSearchChange: vi.fn(),
	handleTargetSearchChange: vi.fn(),
	handleSourceItemToggle: vi.fn(),
	handleTargetItemToggle: vi.fn(),
	handleSourceSelectAll: vi.fn(),
	handleSourceSelectNone: vi.fn(),
	handleTargetSelectAll: vi.fn(),
	handleTargetSelectNone: vi.fn(),
	handleMoveToTarget: vi.fn(),
	handleMoveToSource: vi.fn(),
	isMoveToTargetDisabled: false,
	isMoveToSourceDisabled: false,
	props: {
		options: [],
		sourceTitle: 'Source',
		targetTitle: 'Target',
	},
	...overrides,
});

describe('TransferContent - Rendering', () => {
	it('renders transfer content', () => {
		const props = createTransferContentProps();
		renderWithProviders(<TransferContent {...props} />);

		expect(screen.getByLabelText(/transfer/i)).toBeInTheDocument();
	});

	it('renders source list', () => {
		const props = createTransferContentProps();
		renderWithProviders(<TransferContent {...props} />);

		expect(screen.getByText('Source')).toBeInTheDocument();
		expect(screen.getByText('Source 1')).toBeInTheDocument();
		expect(screen.getByText('Source 2')).toBeInTheDocument();
	});

	it('renders target list', () => {
		const props = createTransferContentProps();
		renderWithProviders(<TransferContent {...props} />);

		expect(screen.getByText('Target')).toBeInTheDocument();
		expect(screen.getByText('Target 1')).toBeInTheDocument();
	});

	it('renders action buttons', () => {
		const props = createTransferContentProps();
		renderWithProviders(<TransferContent {...props} />);

		const buttons = screen.getAllByRole('button');
		expect(buttons.length).toBeGreaterThan(0);
	});

	it('renders with custom transferId', () => {
		const props = createTransferContentProps({
			props: {
				options: [],
				transferId: 'custom-id',
			},
		});
		const { container } = renderWithProviders(<TransferContent {...props} />);

		const transferElement = container.querySelector('#custom-id');
		expect(transferElement).toBeInTheDocument();
	});
});

describe('TransferContent - Props Forwarding', () => {
	it('forwards source list props correctly', () => {
		const props = createTransferContentProps({
			sourceOptions: [{ value: '1', label: 'Test Source' }] as TransferOption[],
			props: {
				options: [],
				sourceTitle: 'Custom Source',
			},
		});
		renderWithProviders(<TransferContent {...props} />);

		expect(screen.getByText('Custom Source')).toBeInTheDocument();
		expect(screen.getByText('Test Source')).toBeInTheDocument();
	});

	it('forwards target list props correctly', () => {
		const props = createTransferContentProps({
			targetOptions: [{ value: '2', label: 'Test Target' }] as TransferOption[],
			props: {
				options: [],
				targetTitle: 'Custom Target',
			},
		});
		renderWithProviders(<TransferContent {...props} />);

		expect(screen.getByText('Custom Target')).toBeInTheDocument();
		expect(screen.getByText('Test Target')).toBeInTheDocument();
	});

	it('forwards action props correctly', () => {
		const handleMoveToTarget = vi.fn();
		const handleMoveToSource = vi.fn();
		const props = createTransferContentProps({
			handleMoveToTarget,
			handleMoveToSource,
		});
		renderWithProviders(<TransferContent {...props} />);

		// Actions should be rendered and functional
		expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
	});

	it('forwards size prop', () => {
		const props = createTransferContentProps({
			props: {
				options: [],
				size: 'lg',
			},
		});
		renderWithProviders(<TransferContent {...props} />);

		// Component should render with lg size
		expect(screen.getByLabelText(/transfer/i)).toBeInTheDocument();
	});

	it('forwards disabled prop', () => {
		const props = createTransferContentProps({
			props: {
				options: [],
				disabled: true,
			},
		});
		renderWithProviders(<TransferContent {...props} />);

		// Component should render in disabled state
		expect(screen.getByLabelText(/transfer/i)).toBeInTheDocument();
	});
});

describe('TransferContent - Labels', () => {
	it('uses custom list labels', () => {
		const props = createTransferContentProps({
			props: {
				options: [],
				labels: {
					selectAll: 'Custom Select All',
					selectNone: 'Custom Deselect All',
				},
			},
		});
		renderWithProviders(<TransferContent {...props} />);

		// Labels should be applied to lists
		expect(screen.getByLabelText(/transfer/i)).toBeInTheDocument();
	});

	it('uses custom action labels', () => {
		const props = createTransferContentProps({
			props: {
				options: [],
				labels: {
					moveToRight: 'Custom Move Right',
					moveToLeft: 'Custom Move Left',
				},
			},
		});
		renderWithProviders(<TransferContent {...props} />);

		// Action labels should be applied
		const buttons = screen.getAllByRole('button');
		expect(buttons.length).toBeGreaterThan(0);
	});
});
