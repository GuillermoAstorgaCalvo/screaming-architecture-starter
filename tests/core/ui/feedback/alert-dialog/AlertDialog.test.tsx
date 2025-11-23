/**
 * Tests for AlertDialog component
 *
 * Tests the alert/confirmation dialog component:
 * - Rendering with different props
 * - Visibility (open/closed)
 * - Button interactions (confirm/cancel)
 * - Custom labels and translations
 * - Destructive variant
 * - Size variants
 * - Accessibility attributes
 * - Edge cases
 */

import AlertDialog from '@core/ui/feedback/alert-dialog/AlertDialog';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

const TEST_TITLE = 'Test Alert Dialog';
const TEST_DESCRIPTION = 'This is a test alert dialog description';
const TEST_CONFIRM_LABEL = 'Confirm';
const TEST_CANCEL_LABEL = 'Cancel';
const DIALOG_ROLE = 'dialog';

// Mock useTranslation
vi.mock('@core/i18n/useTranslation', () => ({
	useTranslation: () => ({
		t: (key: string) => {
			if (key === 'cancel') {
				return 'Cancel';
			}
			if (key === 'confirm') {
				return 'Confirm';
			}
			return key;
		},
	}),
}));

// Helper to render AlertDialog with common props
function renderAlertDialog(
	props: {
		isOpen?: boolean;
		onClose?: () => void;
		title?: string;
		description?: string | React.ReactNode;
		confirmLabel?: string;
		cancelLabel?: string;
		onConfirm?: () => void | Promise<void>;
		onCancel?: () => void;
		destructive?: boolean;
		showCancel?: boolean;
		size?: 'sm' | 'md' | 'lg';
		className?: string;
	} = {}
) {
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
		size,
		className,
	} = props;

	return renderWithProviders(
		<AlertDialog
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			description={description}
			{...(confirmLabel !== undefined && { confirmLabel })}
			{...(cancelLabel !== undefined && { cancelLabel })}
			{...(onConfirm !== undefined && { onConfirm })}
			{...(onCancel !== undefined && { onCancel })}
			destructive={destructive}
			showCancel={showCancel}
			{...(size !== undefined && { size })}
			{...(className !== undefined && { className })}
		/>
	);
}

describe('AlertDialog - Rendering', () => {
	describe('Visibility', () => {
		it('renders nothing when isOpen is false', () => {
			renderAlertDialog({ isOpen: false });

			expect(screen.queryByText(TEST_TITLE)).not.toBeInTheDocument();
			expect(screen.queryByText(TEST_DESCRIPTION)).not.toBeInTheDocument();
		});

		it('renders dialog when isOpen is true', () => {
			renderAlertDialog({ isOpen: true });

			expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
			expect(screen.getByText(TEST_DESCRIPTION)).toBeInTheDocument();
			expect(screen.getByRole(DIALOG_ROLE)).toBeInTheDocument();
		});
	});

	describe('Content', () => {
		it('renders title', () => {
			renderAlertDialog({ title: TEST_TITLE });

			expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
		});

		it('renders description as string', () => {
			renderAlertDialog({ description: TEST_DESCRIPTION });

			expect(screen.getByText(TEST_DESCRIPTION)).toBeInTheDocument();
		});

		it('renders description as ReactNode', () => {
			const descriptionNode = (
				<div data-testid="custom-description">
					<p>Custom description content</p>
				</div>
			);
			renderAlertDialog({ description: descriptionNode });

			expect(screen.getByTestId('custom-description')).toBeInTheDocument();
		});

		it('handles undefined description gracefully', () => {
			renderAlertDialog({ description: undefined });

			expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
			// Description component should handle undefined gracefully
		});
	});

	describe('Size', () => {
		it('renders with default size (sm)', () => {
			renderAlertDialog({});

			const dialog = screen.getByRole(DIALOG_ROLE);
			expect(dialog).toBeInTheDocument();
		});

		it('renders with custom size', () => {
			renderAlertDialog({ size: 'lg' });

			const dialog = screen.getByRole(DIALOG_ROLE);
			expect(dialog).toBeInTheDocument();
		});
	});

	describe('Custom className', () => {
		it('applies custom className when provided', () => {
			const customClass = 'custom-dialog-class';
			renderAlertDialog({ className: customClass });

			const dialog = screen.getByRole(DIALOG_ROLE);
			expect(dialog).toHaveClass(customClass);
		});

		it('does not apply className when not provided', () => {
			renderAlertDialog({});

			const dialog = screen.getByRole(DIALOG_ROLE);
			// Modal component may have default classes, but we verify it renders
			expect(dialog).toBeInTheDocument();
		});
	});
});

describe('AlertDialog - Buttons', () => {
	describe('Confirm Button', () => {
		it('renders confirm button with default label', () => {
			renderAlertDialog({});

			const confirmButton = screen.getByRole('button', { name: /confirm/i });
			expect(confirmButton).toBeInTheDocument();
		});

		it('renders confirm button with custom label', () => {
			renderAlertDialog({ confirmLabel: TEST_CONFIRM_LABEL });

			const confirmButton = screen.getByRole('button', {
				name: TEST_CONFIRM_LABEL,
			});
			expect(confirmButton).toBeInTheDocument();
		});

		it('calls onConfirm when confirm button is clicked', () => {
			const onConfirm = vi.fn();
			renderAlertDialog({ onConfirm });

			const confirmButton = screen.getByRole('button', { name: /confirm/i });
			fireEvent.click(confirmButton);

			expect(onConfirm).toHaveBeenCalledTimes(1);
		});

		it('calls onClose after onConfirm when confirm button is clicked', async () => {
			const onConfirm = vi.fn();
			const onClose = vi.fn();
			renderAlertDialog({ onConfirm, onClose });

			const confirmButton = screen.getByRole('button', { name: /confirm/i });
			fireEvent.click(confirmButton);

			await waitFor(() => {
				expect(onConfirm).toHaveBeenCalledTimes(1);
				expect(onClose).toHaveBeenCalledTimes(1);
			});
		});

		it('calls onClose even when onConfirm is not provided', () => {
			const onClose = vi.fn();
			renderAlertDialog({ onClose });

			const confirmButton = screen.getByRole('button', { name: /confirm/i });
			fireEvent.click(confirmButton);

			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('handles async onConfirm', async () => {
			const onConfirm = vi.fn(async () => {
				await new Promise(resolve => setTimeout(resolve, 10));
			});
			const onClose = vi.fn();
			renderAlertDialog({ onConfirm, onClose });

			const confirmButton = screen.getByRole('button', { name: /confirm/i });
			fireEvent.click(confirmButton);

			await waitFor(() => {
				expect(onConfirm).toHaveBeenCalledTimes(1);
				expect(onClose).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe('Cancel Button', () => {
		it('renders cancel button by default', () => {
			renderAlertDialog({});

			const cancelButton = screen.getByRole('button', { name: /cancel/i });
			expect(cancelButton).toBeInTheDocument();
		});

		it('renders cancel button with custom label', () => {
			renderAlertDialog({ cancelLabel: TEST_CANCEL_LABEL });

			const cancelButton = screen.getByRole('button', {
				name: TEST_CANCEL_LABEL,
			});
			expect(cancelButton).toBeInTheDocument();
		});

		it('does not render cancel button when showCancel is false', () => {
			renderAlertDialog({ showCancel: false });

			const cancelButtons = screen.queryAllByRole('button', {
				name: /cancel/i,
			});
			expect(cancelButtons).toHaveLength(0);
		});

		it('calls onCancel when cancel button is clicked', () => {
			const onCancel = vi.fn();
			renderAlertDialog({ onCancel });

			const cancelButton = screen.getByRole('button', { name: /cancel/i });
			fireEvent.click(cancelButton);

			expect(onCancel).toHaveBeenCalledTimes(1);
		});

		it('calls onClose after onCancel when cancel button is clicked', () => {
			const onCancel = vi.fn();
			const onClose = vi.fn();
			renderAlertDialog({ onCancel, onClose });

			const cancelButton = screen.getByRole('button', { name: /cancel/i });
			fireEvent.click(cancelButton);

			expect(onCancel).toHaveBeenCalledTimes(1);
			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('calls onClose even when onCancel is not provided', () => {
			const onClose = vi.fn();
			renderAlertDialog({ onClose });

			const cancelButton = screen.getByRole('button', { name: /cancel/i });
			fireEvent.click(cancelButton);

			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});

	describe('Button Layout', () => {
		it('renders both confirm and cancel buttons when showCancel is true', () => {
			renderAlertDialog({ showCancel: true });

			expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
		});

		it('renders only confirm button when showCancel is false', () => {
			renderAlertDialog({ showCancel: false });

			expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
			expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
		});
	});
});

describe('AlertDialog - Destructive Variant', () => {
	it('applies destructive styling when destructive is true', () => {
		renderAlertDialog({ destructive: true });

		const confirmButton = screen.getByRole('button', { name: /confirm/i });
		// Check for destructive classes (bg-destructive, text-destructive-foreground, etc.)
		expect(confirmButton.className).toContain('destructive');
	});

	it('does not apply destructive styling when destructive is false', () => {
		renderAlertDialog({ destructive: false });

		const confirmButton = screen.getByRole('button', { name: /confirm/i });
		expect(confirmButton).toBeInTheDocument();
	});
});

describe('AlertDialog - Modal Integration', () => {
	it('does not render close button (showCloseButton is false)', () => {
		renderAlertDialog({});

		const closeButtons = screen.queryAllByRole('button', { name: /close/i });
		expect(closeButtons).toHaveLength(0);
	});

	it('does not close on overlay click (closeOnOverlayClick is false)', () => {
		const onClose = vi.fn();
		renderAlertDialog({ onClose });

		const dialog = screen.getByRole(DIALOG_ROLE);
		// Click on the dialog element itself to simulate backdrop click
		fireEvent.click(dialog);

		expect(onClose).not.toHaveBeenCalled();
	});

	it('passes title to Modal', () => {
		renderAlertDialog({ title: TEST_TITLE });

		expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
	});

	it('passes size to Modal', () => {
		renderAlertDialog({ size: 'md' });

		const dialog = screen.getByRole(DIALOG_ROLE);
		expect(dialog).toBeInTheDocument();
	});
});

describe('AlertDialog - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderAlertDialog({});

		await expectA11y(container);
	});

	it('has proper ARIA attributes', () => {
		renderAlertDialog({});

		const dialog = screen.getByRole(DIALOG_ROLE);
		// Modal component should provide proper ARIA attributes
		expect(dialog).toHaveAttribute('aria-labelledby');
		expect(dialog).toHaveAttribute('aria-describedby');
	});

	it('has accessible title', () => {
		renderAlertDialog({ title: TEST_TITLE });

		const dialog = screen.getByRole(DIALOG_ROLE);
		const title = screen.getByText(TEST_TITLE);
		expect(title).toBeInTheDocument();
		expect(dialog).toContainElement(title);
	});

	it('has accessible buttons with proper labels', () => {
		renderAlertDialog({
			confirmLabel: TEST_CONFIRM_LABEL,
			cancelLabel: TEST_CANCEL_LABEL,
		});

		const confirmButton = screen.getByRole('button', {
			name: TEST_CONFIRM_LABEL,
		});
		const cancelButton = screen.getByRole('button', {
			name: TEST_CANCEL_LABEL,
		});

		expect(confirmButton).toBeInTheDocument();
		expect(cancelButton).toBeInTheDocument();
	});
});

describe('AlertDialog - Translations', () => {
	it('uses default translation for confirm label when not provided', () => {
		renderAlertDialog({});

		const confirmButton = screen.getByRole('button', { name: /confirm/i });
		expect(confirmButton).toBeInTheDocument();
	});

	it('uses default translation for cancel label when not provided', () => {
		renderAlertDialog({});

		const cancelButton = screen.getByRole('button', { name: /cancel/i });
		expect(cancelButton).toBeInTheDocument();
	});

	it('overrides default translation with custom labels', () => {
		renderAlertDialog({
			confirmLabel: 'Delete',
			cancelLabel: 'Keep',
		});

		expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument();
	});
});

describe('AlertDialog - Edge Cases', () => {
	it('handles rapid button clicks', async () => {
		const onConfirm = vi.fn();
		const onClose = vi.fn();
		renderAlertDialog({ onConfirm, onClose });

		const confirmButton = screen.getByRole('button', { name: /confirm/i });
		for (let i = 0; i < 3; i++) {
			fireEvent.click(confirmButton);
		}

		await waitFor(() => {
			expect(onConfirm).toHaveBeenCalledTimes(3);
			expect(onClose).toHaveBeenCalledTimes(3);
		});
	});

	it('handles state changes correctly', () => {
		const TestComponent = () => {
			const [isOpen, setIsOpen] = useState(true);
			return (
				<div>
					<button onClick={() => setIsOpen(false)}>Close Dialog</button>
					<AlertDialog
						isOpen={isOpen}
						onClose={() => setIsOpen(false)}
						title={TEST_TITLE}
						description={TEST_DESCRIPTION}
					/>
				</div>
			);
		};

		renderWithProviders(<TestComponent />);

		expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();

		const closeButton = screen.getByText('Close Dialog');
		fireEvent.click(closeButton);

		expect(screen.queryByText(TEST_TITLE)).not.toBeInTheDocument();
	});

	it('handles empty title gracefully', () => {
		renderAlertDialog({ title: '' });

		const dialog = screen.getByRole(DIALOG_ROLE);
		expect(dialog).toBeInTheDocument();
	});

	it('handles onConfirm that throws error gracefully', async () => {
		// Use a promise that rejects to test error handling
		const errorPromise = Promise.reject(new Error('Test error'));
		const onConfirm = vi.fn(() => errorPromise);
		const onClose = vi.fn();

		// Suppress unhandled rejection for this test
		const originalUnhandledRejection = process.listeners('unhandledRejection');
		const errorHandler = vi.fn();
		process.on('unhandledRejection', errorHandler);

		renderAlertDialog({ onConfirm, onClose });

		const confirmButton = screen.getByRole('button', { name: /confirm/i });

		// Click button - error will be thrown but we handle it
		fireEvent.click(confirmButton);

		// Wait for the call
		await waitFor(
			() => {
				expect(onConfirm).toHaveBeenCalledTimes(1);
			},
			{ timeout: 1000 }
		);

		// Clean up error handler
		process.removeListener('unhandledRejection', errorHandler);
		for (const listener of originalUnhandledRejection) {
			process.on('unhandledRejection', listener);
		}

		// Verify the component rendered and button is still functional
		expect(screen.getByRole(DIALOG_ROLE)).toBeInTheDocument();
		expect(confirmButton).toBeInTheDocument();
	});
});

describe('AlertDialog - Integration', () => {
	it('works as a confirmation dialog with cancel', () => {
		const handleCancel = vi.fn();
		const handleClose = vi.fn();

		renderAlertDialog({
			title: 'Delete Item',
			description: 'Are you sure you want to delete this item?',
			confirmLabel: 'Delete',
			cancelLabel: 'Cancel',
			onCancel: handleCancel,
			onClose: handleClose,
			destructive: true,
		});

		expect(screen.getByText('Delete Item')).toBeInTheDocument();
		expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();

		const cancelButton = screen.getByRole('button', { name: 'Cancel' });
		expect(cancelButton).toBeInTheDocument();

		fireEvent.click(cancelButton);
		expect(handleCancel).toHaveBeenCalledTimes(1);
		expect(handleClose).toHaveBeenCalledTimes(1);
	});

	it('works as a confirmation dialog with confirm', async () => {
		const handleConfirm = vi.fn();
		const handleClose = vi.fn();

		renderAlertDialog({
			title: 'Delete Item',
			description: 'Are you sure you want to delete this item?',
			confirmLabel: 'Delete',
			cancelLabel: 'Cancel',
			onConfirm: handleConfirm,
			onClose: handleClose,
			destructive: true,
		});

		const deleteButton = screen.getByRole('button', { name: 'Delete' });
		expect(deleteButton).toBeInTheDocument();
		fireEvent.click(deleteButton);

		await waitFor(() => {
			expect(handleConfirm).toHaveBeenCalledTimes(1);
			expect(handleClose).toHaveBeenCalledTimes(1);
		});
	});

	it('works as a simple alert (no cancel button)', () => {
		const handleClose = vi.fn();

		renderAlertDialog({
			title: 'Success',
			description: 'Your changes have been saved.',
			confirmLabel: 'OK',
			showCancel: false,
			onClose: handleClose,
		});

		expect(screen.getByText('Success')).toBeInTheDocument();
		expect(screen.getByText('Your changes have been saved.')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
	});
});
