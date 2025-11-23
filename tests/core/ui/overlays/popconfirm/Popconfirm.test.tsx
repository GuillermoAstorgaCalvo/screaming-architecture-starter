/**
 * Tests for Popconfirm component
 *
 * Tests the Popconfirm component:
 * - Rendering with different props
 * - Open/close behavior
 * - Confirm and cancel actions
 * - Destructive styling
 * - Position and close behavior
 * - Accessibility
 */

import Popconfirm from '@core/ui/overlays/popconfirm/Popconfirm';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

const TEST_TITLE = 'Delete Item';
const TEST_DESCRIPTION = 'Are you sure you want to delete this item?';
const TRIGGER_TEXT = 'Delete';

const renderPopconfirm = (props: {
	isOpen?: boolean;
	onClose?: () => void;
	title?: string;
	description?: ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
	onConfirm?: () => void | Promise<void>;
	onCancel?: () => void;
	destructive?: boolean;
	showCancel?: boolean;
	position?: 'top' | 'bottom' | 'left' | 'right';
	closeOnOutsideClick?: boolean;
	closeOnEscape?: boolean;
	trigger?: ReactNode;
}) => {
	const {
		isOpen = true,
		onClose = vi.fn(),
		title = TEST_TITLE,
		description = TEST_DESCRIPTION,
		confirmLabel,
		cancelLabel,
		onConfirm,
		onCancel,
		destructive = false,
		showCancel = true,
		position = 'top',
		closeOnOutsideClick = true,
		closeOnEscape = true,
		trigger = <button>{TRIGGER_TEXT}</button>,
	} = props;

	return renderWithProviders(
		<Popconfirm
			isOpen={isOpen}
			onClose={onClose}
			trigger={trigger}
			title={title}
			description={description}
			{...(confirmLabel !== undefined && { confirmLabel })}
			{...(cancelLabel !== undefined && { cancelLabel })}
			{...(onConfirm !== undefined && { onConfirm })}
			{...(onCancel !== undefined && { onCancel })}
			destructive={destructive}
			showCancel={showCancel}
			position={position}
			closeOnOutsideClick={closeOnOutsideClick}
			closeOnEscape={closeOnEscape}
		/>
	);
};

describe('Popconfirm - Rendering', () => {
	describe('Visibility', () => {
		it('renders trigger when popconfirm is closed', () => {
			renderPopconfirm({ isOpen: false });

			expect(screen.getByText(TRIGGER_TEXT)).toBeInTheDocument();
			expect(screen.queryByText(TEST_TITLE)).not.toBeInTheDocument();
		});

		it('renders popconfirm content when isOpen is true', () => {
			renderPopconfirm({ isOpen: true });

			expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
			expect(screen.getByText(TEST_DESCRIPTION)).toBeInTheDocument();
		});
	});

	describe('Labels', () => {
		it('renders with default confirm and cancel labels', () => {
			renderPopconfirm({ isOpen: true });

			expect(screen.getByText('Confirm')).toBeInTheDocument();
			expect(screen.getByText('Cancel')).toBeInTheDocument();
		});

		it('renders with custom confirm and cancel labels', () => {
			renderPopconfirm({
				isOpen: true,
				confirmLabel: 'Delete',
				cancelLabel: 'Keep',
			});

			// Use getAllByText since "Delete" appears in both trigger and confirm button
			const deleteButtons = screen.getAllByText('Delete');
			expect(deleteButtons.length).toBeGreaterThan(0);
			expect(screen.getByText('Keep')).toBeInTheDocument();
		});
	});

	describe('Cancel Button', () => {
		it('renders cancel button when showCancel is true', () => {
			renderPopconfirm({ isOpen: true, showCancel: true });

			expect(screen.getByText('Cancel')).toBeInTheDocument();
		});

		it('does not render cancel button when showCancel is false', () => {
			renderPopconfirm({ isOpen: true, showCancel: false });

			expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
			expect(screen.getByText('Confirm')).toBeInTheDocument();
		});
	});

	describe('Destructive Styling', () => {
		it('applies destructive styling when destructive is true', () => {
			renderPopconfirm({ isOpen: true, destructive: true });

			const confirmButton = screen.getByText('Confirm');
			expect(confirmButton).toHaveClass('bg-destructive');
		});

		it('does not apply destructive styling when destructive is false', () => {
			renderPopconfirm({ isOpen: true, destructive: false });

			const confirmButton = screen.getByText('Confirm');
			expect(confirmButton).not.toHaveClass('bg-destructive');
		});
	});
});

describe('Popconfirm - Actions', () => {
	describe('Confirm Action', () => {
		it('calls onConfirm and then onClose when confirm button is clicked', async () => {
			const onConfirm = vi.fn();
			const onClose = vi.fn();
			renderPopconfirm({ isOpen: true, onConfirm, onClose });

			const confirmButton = screen.getByText('Confirm');
			fireEvent.click(confirmButton);

			await waitFor(() => {
				expect(onConfirm).toHaveBeenCalledTimes(1);
				expect(onClose).toHaveBeenCalledTimes(1);
			});
		});

		it('calls onClose when confirm button is clicked without onConfirm', async () => {
			const onClose = vi.fn();
			renderPopconfirm({ isOpen: true, onClose });

			const confirmButton = screen.getByText('Confirm');
			fireEvent.click(confirmButton);

			await waitFor(() => {
				expect(onClose).toHaveBeenCalledTimes(1);
			});
		});

		it('handles async onConfirm callback', async () => {
			const asyncConfirm = async () => {
				await new Promise(resolve => setTimeout(resolve, 10));
			};
			const onConfirm = vi.fn(asyncConfirm);
			const onClose = vi.fn();
			renderPopconfirm({ isOpen: true, onConfirm, onClose });

			const confirmButton = screen.getByText('Confirm');
			fireEvent.click(confirmButton);

			await waitFor(
				() => {
					expect(onConfirm).toHaveBeenCalledTimes(1);
					expect(onClose).toHaveBeenCalledTimes(1);
				},
				{ timeout: 100 }
			);
		});
	});

	describe('Cancel Action', () => {
		it('calls onCancel and then onClose when cancel button is clicked', () => {
			const onCancel = vi.fn();
			const onClose = vi.fn();
			renderPopconfirm({ isOpen: true, onCancel, onClose });

			const cancelButton = screen.getByText('Cancel');
			fireEvent.click(cancelButton);

			expect(onCancel).toHaveBeenCalledTimes(1);
			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('calls onClose when cancel button is clicked without onCancel', () => {
			const onClose = vi.fn();
			renderPopconfirm({ isOpen: true, onClose });

			const cancelButton = screen.getByText('Cancel');
			fireEvent.click(cancelButton);

			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});
});

describe('Popconfirm - Close Behavior', () => {
	describe('Escape Key', () => {
		it('calls onClose when escape key is pressed and closeOnEscape is true', () => {
			const onClose = vi.fn();
			renderPopconfirm({ isOpen: true, onClose, closeOnEscape: true });

			fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('does not call onClose when escape key is pressed and closeOnEscape is false', () => {
			const onClose = vi.fn();
			renderPopconfirm({ isOpen: true, onClose, closeOnEscape: false });

			fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

			expect(onClose).not.toHaveBeenCalled();
		});
	});

	describe('Outside Click', () => {
		it('calls onClose when clicking outside and closeOnOutsideClick is true', async () => {
			const onClose = vi.fn();
			renderWithProviders(
				<div>
					<Popconfirm
						isOpen={true}
						onClose={onClose}
						trigger={<button>{TRIGGER_TEXT}</button>}
						title={TEST_TITLE}
						closeOnOutsideClick={true}
					/>
					<button>Outside Button</button>
				</div>
			);

			const outsideButton = screen.getByText('Outside Button');
			fireEvent.mouseDown(outsideButton);
			fireEvent.click(outsideButton);

			await waitFor(
				() => {
					expect(onClose).toHaveBeenCalled();
				},
				{ timeout: 1000 }
			);
		});

		it('does not call onClose when clicking outside and closeOnOutsideClick is false', () => {
			const onClose = vi.fn();
			renderWithProviders(
				<div>
					<Popconfirm
						isOpen={true}
						onClose={onClose}
						trigger={<button>{TRIGGER_TEXT}</button>}
						title={TEST_TITLE}
						closeOnOutsideClick={false}
					/>
					<button>Outside Button</button>
				</div>
			);

			const outsideButton = screen.getByText('Outside Button');
			fireEvent.click(outsideButton);

			expect(onClose).not.toHaveBeenCalled();
		});
	});
});

describe('Popconfirm - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderPopconfirm({ isOpen: true });

		await expectA11y(container);
	});
});
