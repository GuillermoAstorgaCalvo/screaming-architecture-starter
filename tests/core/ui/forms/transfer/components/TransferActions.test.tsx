/**
 * TransferActions Component Tests
 *
 * Tests for the TransferActions component including:
 * - Rendering
 * - Button interactions
 * - Disabled states
 * - Size variants
 * - Custom labels
 */

import { TransferActions } from '@core/ui/forms/transfer/components/TransferActions';
import type { TransferActionsProps } from '@core/ui/forms/transfer/types/TransferActions.types';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const createProps = (overrides?: Partial<TransferActionsProps>): TransferActionsProps => ({
	onMoveToTarget: vi.fn(),
	onMoveToSource: vi.fn(),
	isMoveToTargetDisabled: false,
	isMoveToSourceDisabled: false,
	size: 'md',
	disabled: false,
	labels: undefined,
	...overrides,
});

describe('TransferActions - Rendering', () => {
	it('renders action buttons', () => {
		const props = createProps();
		renderWithProviders(<TransferActions {...props} />);

		const buttons = screen.getAllByRole('button');
		expect(buttons).toHaveLength(2);
	});

	it('renders move to target button', () => {
		const props = createProps();
		renderWithProviders(<TransferActions {...props} />);

		const buttons = screen.getAllByRole('button');
		expect(buttons[0]).toBeInTheDocument();
	});

	it('renders move to source button', () => {
		const props = createProps();
		renderWithProviders(<TransferActions {...props} />);

		const buttons = screen.getAllByRole('button');
		expect(buttons[1]).toBeInTheDocument();
	});
});

describe('TransferActions - Interactions', () => {
	it('calls onMoveToTarget when move to target button is clicked', () => {
		const onMoveToTarget = vi.fn();
		const props = createProps({ onMoveToTarget });
		renderWithProviders(<TransferActions {...props} />);

		const buttons = screen.getAllByRole('button');
		expect(buttons[0]).toBeDefined();
		if (buttons[0]) {
			fireEvent.click(buttons[0]);
		}

		expect(onMoveToTarget).toHaveBeenCalledTimes(1);
	});

	it('calls onMoveToSource when move to source button is clicked', () => {
		const onMoveToSource = vi.fn();
		const props = createProps({ onMoveToSource });
		renderWithProviders(<TransferActions {...props} />);

		const buttons = screen.getAllByRole('button');
		expect(buttons[1]).toBeDefined();
		if (buttons[1]) {
			fireEvent.click(buttons[1]);
		}

		expect(onMoveToSource).toHaveBeenCalledTimes(1);
	});
});

describe('TransferActions - Disabled States', () => {
	it('disables move to target button when isMoveToTargetDisabled is true', () => {
		const props = createProps({ isMoveToTargetDisabled: true });
		renderWithProviders(<TransferActions {...props} />);

		const buttons = screen.getAllByRole('button');
		expect(buttons[0]).toBeDisabled();
		expect(buttons[1]).not.toBeDisabled();
	});

	it('disables move to source button when isMoveToSourceDisabled is true', () => {
		const props = createProps({ isMoveToSourceDisabled: true });
		renderWithProviders(<TransferActions {...props} />);

		const buttons = screen.getAllByRole('button');
		expect(buttons[0]).not.toBeDisabled();
		expect(buttons[1]).toBeDisabled();
	});

	it('disables both buttons when disabled prop is true', () => {
		const props = createProps({ disabled: true });
		renderWithProviders(<TransferActions {...props} />);

		const buttons = screen.getAllByRole('button');
		expect(buttons[0]).toBeDisabled();
		expect(buttons[1]).toBeDisabled();
	});

	it('disables move to target button when both disabled and isMoveToTargetDisabled are true', () => {
		const props = createProps({
			disabled: true,
			isMoveToTargetDisabled: true,
		});
		renderWithProviders(<TransferActions {...props} />);

		const buttons = screen.getAllByRole('button');
		expect(buttons[0]).toBeDisabled();
		expect(buttons[1]).toBeDisabled();
	});
});

describe('TransferActions - Size Variants', () => {
	it('renders with sm size', () => {
		const props = createProps({ size: 'sm' });
		renderWithProviders(<TransferActions {...props} />);

		const buttons = screen.getAllByRole('button');
		expect(buttons).toHaveLength(2);
	});

	it('renders with md size', () => {
		const props = createProps({ size: 'md' });
		renderWithProviders(<TransferActions {...props} />);

		const buttons = screen.getAllByRole('button');
		expect(buttons).toHaveLength(2);
	});

	it('renders with lg size', () => {
		const props = createProps({ size: 'lg' });
		renderWithProviders(<TransferActions {...props} />);

		const buttons = screen.getAllByRole('button');
		expect(buttons).toHaveLength(2);
	});
});

describe('TransferActions - Custom Labels', () => {
	it('uses custom moveToRight label', () => {
		const props = createProps({
			labels: { moveToRight: 'Custom Move Right' },
		});
		renderWithProviders(<TransferActions {...props} />);

		const buttons = screen.getAllByRole('button');
		expect(buttons[0]).toHaveAttribute('aria-label', 'Custom Move Right');
	});

	it('uses custom moveToLeft label', () => {
		const props = createProps({
			labels: { moveToLeft: 'Custom Move Left' },
		});
		renderWithProviders(<TransferActions {...props} />);

		const buttons = screen.getAllByRole('button');
		expect(buttons[1]).toHaveAttribute('aria-label', 'Custom Move Left');
	});

	it('uses default labels when custom labels are not provided', () => {
		const props = createProps();
		renderWithProviders(<TransferActions {...props} />);

		const buttons = screen.getAllByRole('button');
		expect(buttons[0]).toHaveAttribute('aria-label');
		expect(buttons[1]).toHaveAttribute('aria-label');
	});
});
