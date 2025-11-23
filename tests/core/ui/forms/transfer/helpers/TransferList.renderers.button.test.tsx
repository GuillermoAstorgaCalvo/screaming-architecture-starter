/**
 * TransferList.renderers.button Tests
 *
 * Tests for TransferList button renderer including:
 * - Select all button rendering
 * - Label selection
 * - ARIA label handling
 */

import { renderSelectAllButton } from '@core/ui/forms/transfer/helpers/TransferList.renderers.button';
import type { RenderSelectAllButtonProps } from '@core/ui/forms/transfer/types/TransferList.types';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('renderSelectAllButton', () => {
	const createProps = (
		overrides?: Partial<RenderSelectAllButtonProps>
	): RenderSelectAllButtonProps => ({
		allSelected: false,
		disabled: false,
		labels: undefined,
		onSelectAllToggle: vi.fn(),
		...overrides,
	});

	it('renders select all button when not all selected', () => {
		const props = createProps({ allSelected: false });
		renderWithProviders(renderSelectAllButton(props));

		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
		expect(button).not.toBeDisabled();
	});

	it('renders deselect all button when all selected', () => {
		const props = createProps({ allSelected: true });
		renderWithProviders(renderSelectAllButton(props));

		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('calls onSelectAllToggle when clicked', () => {
		const onSelectAllToggle = vi.fn();
		const props = createProps({ onSelectAllToggle });
		renderWithProviders(renderSelectAllButton(props));

		const button = screen.getByRole('button');
		fireEvent.click(button);

		expect(onSelectAllToggle).toHaveBeenCalledTimes(1);
	});

	it('disables button when disabled prop is true', () => {
		const props = createProps({ disabled: true });
		renderWithProviders(renderSelectAllButton(props));

		const button = screen.getByRole('button');
		expect(button).toBeDisabled();
	});

	it('uses custom selectAll label when provided', () => {
		const props = createProps({
			allSelected: false,
			labels: { selectAll: 'Custom Select All' },
		});
		renderWithProviders(renderSelectAllButton(props));

		const button = screen.getByRole('button');
		expect(button).toHaveTextContent('Custom Select All');
	});

	it('uses custom selectNone label when provided', () => {
		const props = createProps({
			allSelected: true,
			labels: { selectNone: 'Custom Deselect All' },
		});
		renderWithProviders(renderSelectAllButton(props));

		const button = screen.getByRole('button');
		expect(button).toHaveTextContent('Custom Deselect All');
	});

	it('sets aria-label from custom labels', () => {
		const props = createProps({
			allSelected: false,
			labels: { selectAll: 'Custom Select All' },
		});
		renderWithProviders(renderSelectAllButton(props));

		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('aria-label', 'Custom Select All');
	});

	it('applies disabled styling when disabled', () => {
		const props = createProps({ disabled: true });
		const { container } = renderWithProviders(renderSelectAllButton(props));

		const button = container.querySelector('button');
		expect(button).toHaveClass('opacity-disabled');
		expect(button).toHaveClass('cursor-not-allowed');
	});
});
