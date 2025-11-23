/**
 * ConfirmDialog Component Tests
 *
 * Tests for the ConfirmDialog component including:
 * - Rendering with different props
 * - Visibility (open/closed)
 * - Button interactions (confirm/cancel)
 * - Custom labels and translations
 * - Destructive variant
 * - Size variants
 * - Accessibility attributes
 * - Edge cases
 */

import ConfirmDialog from '@core/ui/overlays/confirm-dialog/ConfirmDialog';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

const TEST_TITLE = 'Test Confirm Dialog';
const TEST_DESCRIPTION = 'This is a test confirm dialog description';
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

// Helper to render ConfirmDialog with common props
function renderConfirmDialog(
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
		variant?: 'default' | 'centered' | 'fullscreen';
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
		variant,
		className,
	} = props;

	return renderWithProviders(
		<ConfirmDialog
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
			{...(variant !== undefined && { variant })}
			{...(className !== undefined && { className })}
		/>
	);
}

describe('ConfirmDialog - Rendering', () => {
	describe('Visibility', () => {
		it('renders nothing when isOpen is false', () => {
			renderConfirmDialog({ isOpen: false });

			expect(screen.queryByText(TEST_TITLE)).not.toBeInTheDocument();
			expect(screen.queryByText(TEST_DESCRIPTION)).not.toBeInTheDocument();
		});

		it('renders dialog when isOpen is true', () => {
			renderConfirmDialog({ isOpen: true });

			expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
			expect(screen.getByText(TEST_DESCRIPTION)).toBeInTheDocument();
			expect(screen.getByRole(DIALOG_ROLE)).toBeInTheDocument();
		});
	});

	describe('Content', () => {
		it('renders title', () => {
			renderConfirmDialog({ title: TEST_TITLE });

			expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
		});

		it('renders description as string', () => {
			renderConfirmDialog({ description: TEST_DESCRIPTION });

			expect(screen.getByText(TEST_DESCRIPTION)).toBeInTheDocument();
		});

		it('renders description as ReactNode', () => {
			const descriptionNode = (
				<div data-testid="custom-description">
					<p>Custom description content</p>
				</div>
			);
			renderConfirmDialog({ description: descriptionNode });

			expect(screen.getByTestId('custom-description')).toBeInTheDocument();
		});

		it('handles undefined description gracefully', () => {
			renderConfirmDialog({ description: undefined });

			expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
		});
	});

	describe('Size', () => {
		it('renders with default size (sm)', () => {
			renderConfirmDialog({});

			const dialog = screen.getByRole(DIALOG_ROLE);
			expect(dialog).toBeInTheDocument();
		});

		it('renders with custom size', () => {
			renderConfirmDialog({ size: 'lg' });

			const dialog = screen.getByRole(DIALOG_ROLE);
			expect(dialog).toBeInTheDocument();
		});
	});

	describe('Variant', () => {
		it('renders with default variant (centered)', () => {
			renderConfirmDialog({});

			const dialog = screen.getByRole(DIALOG_ROLE);
			expect(dialog).toBeInTheDocument();
		});

		it('renders with custom variant', () => {
			renderConfirmDialog({ variant: 'fullscreen' });

			const dialog = screen.getByRole(DIALOG_ROLE);
			expect(dialog).toBeInTheDocument();
		});
	});

	describe('Custom className', () => {
		it('applies custom className when provided', () => {
			const customClass = 'custom-dialog-class';
			renderConfirmDialog({ className: customClass });

			const dialog = screen.getByRole(DIALOG_ROLE);
			expect(dialog).toHaveClass(customClass);
		});
	});
});

describe('ConfirmDialog - Buttons', () => {
	describe('Confirm Button', () => {
		it('renders confirm button with default label', () => {
			renderConfirmDialog({});

			const confirmButton = screen.getByRole('button', { name: /confirm/i });
			expect(confirmButton).toBeInTheDocument();
		});

		it('renders confirm button with custom label', () => {
			renderConfirmDialog({ confirmLabel: TEST_CONFIRM_LABEL });

			const confirmButton = screen.getByRole('button', {
				name: TEST_CONFIRM_LABEL,
			});
			expect(confirmButton).toBeInTheDocument();
		});

		it('calls onConfirm when confirm button is clicked', () => {
			const onConfirm = vi.fn();
			renderConfirmDialog({ onConfirm });

			const confirmButton = screen.getByRole('button', { name: /confirm/i });
			fireEvent.click(confirmButton);

			expect(onConfirm).toHaveBeenCalledTimes(1);
		});

		it('calls onClose after onConfirm when confirm button is clicked', async () => {
			const onConfirm = vi.fn();
			const onClose = vi.fn();
			renderConfirmDialog({ onConfirm, onClose });

			const confirmButton = screen.getByRole('button', { name: /confirm/i });
			fireEvent.click(confirmButton);

			await waitFor(() => {
				expect(onConfirm).toHaveBeenCalledTimes(1);
				expect(onClose).toHaveBeenCalledTimes(1);
			});
		});

		it('calls onClose even when onConfirm is not provided', () => {
			const onClose = vi.fn();
			renderConfirmDialog({ onClose });

			const confirmButton = screen.getByRole('button', { name: /confirm/i });
			fireEvent.click(confirmButton);

			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('handles async onConfirm', async () => {
			const onConfirm = vi.fn(async () => {
				await new Promise(resolve => setTimeout(resolve, 10));
			});
			const onClose = vi.fn();
			renderConfirmDialog({ onConfirm, onClose });

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
			renderConfirmDialog({});

			const cancelButton = screen.getByRole('button', { name: /cancel/i });
			expect(cancelButton).toBeInTheDocument();
		});

		it('renders cancel button with custom label', () => {
			renderConfirmDialog({ cancelLabel: TEST_CANCEL_LABEL });

			const cancelButton = screen.getByRole('button', {
				name: TEST_CANCEL_LABEL,
			});
			expect(cancelButton).toBeInTheDocument();
		});

		it('does not render cancel button when showCancel is false', () => {
			renderConfirmDialog({ showCancel: false });

			const cancelButtons = screen.queryAllByRole('button', {
				name: /cancel/i,
			});
			expect(cancelButtons).toHaveLength(0);
		});

		it('calls onCancel when cancel button is clicked', () => {
			const onCancel = vi.fn();
			renderConfirmDialog({ onCancel });

			const cancelButton = screen.getByRole('button', { name: /cancel/i });
			fireEvent.click(cancelButton);

			expect(onCancel).toHaveBeenCalledTimes(1);
		});

		it('calls onClose after onCancel when cancel button is clicked', () => {
			const onCancel = vi.fn();
			const onClose = vi.fn();
			renderConfirmDialog({ onCancel, onClose });

			const cancelButton = screen.getByRole('button', { name: /cancel/i });
			fireEvent.click(cancelButton);

			expect(onCancel).toHaveBeenCalledTimes(1);
			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('calls onClose even when onCancel is not provided', () => {
			const onClose = vi.fn();
			renderConfirmDialog({ onClose });

			const cancelButton = screen.getByRole('button', { name: /cancel/i });
			fireEvent.click(cancelButton);

			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});

	describe('Button Layout', () => {
		it('renders both confirm and cancel buttons when showCancel is true', () => {
			renderConfirmDialog({ showCancel: true });

			expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
		});

		it('renders only confirm button when showCancel is false', () => {
			renderConfirmDialog({ showCancel: false });

			expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
			expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
		});
	});
});

describe('ConfirmDialog - Destructive Variant', () => {
	it('applies destructive styling when destructive is true', () => {
		renderConfirmDialog({ destructive: true });

		const confirmButton = screen.getByRole('button', { name: /confirm/i });
		expect(confirmButton.className).toContain('destructive');
	});

	it('does not apply destructive styling when destructive is false', () => {
		renderConfirmDialog({ destructive: false });

		const confirmButton = screen.getByRole('button', { name: /confirm/i });
		expect(confirmButton).toBeInTheDocument();
	});
});

describe('ConfirmDialog - Dialog Integration', () => {
	it('does not render close button (showCloseButton is false)', () => {
		renderConfirmDialog({});

		const closeButtons = screen.queryAllByRole('button', { name: /close/i });
		expect(closeButtons).toHaveLength(0);
	});

	it('does not close on overlay click (closeOnOverlayClick is false)', () => {
		const onClose = vi.fn();
		renderConfirmDialog({ onClose });

		const dialog = screen.getByRole(DIALOG_ROLE);
		fireEvent.click(dialog);

		expect(onClose).not.toHaveBeenCalled();
	});
});

describe('ConfirmDialog - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderConfirmDialog({});

		await expectA11y(container);
	});

	it('has proper ARIA attributes', () => {
		renderConfirmDialog({});

		const dialog = screen.getByRole(DIALOG_ROLE);
		expect(dialog).toHaveAttribute('aria-labelledby');
		expect(dialog).toHaveAttribute('aria-describedby');
	});
});

describe('ConfirmDialog - Translations', () => {
	it('uses default translation for confirm label when not provided', () => {
		renderConfirmDialog({});

		const confirmButton = screen.getByRole('button', { name: /confirm/i });
		expect(confirmButton).toBeInTheDocument();
	});

	it('uses default translation for cancel label when not provided', () => {
		renderConfirmDialog({});

		const cancelButton = screen.getByRole('button', { name: /cancel/i });
		expect(cancelButton).toBeInTheDocument();
	});

	it('overrides default translation with custom labels', () => {
		renderConfirmDialog({
			confirmLabel: 'Delete',
			cancelLabel: 'Keep',
		});

		expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument();
	});
});

describe('ConfirmDialog - Edge Cases', () => {
	it('handles rapid button clicks', async () => {
		const onConfirm = vi.fn();
		const onClose = vi.fn();
		renderConfirmDialog({ onConfirm, onClose });

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
					<ConfirmDialog
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
});
