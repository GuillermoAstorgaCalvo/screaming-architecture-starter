/**
 * Tests for AlertDialog.helpers
 *
 * Tests the createAlertDialogFooter helper function:
 * - Renders AlertDialogFooter component correctly
 * - Passes props correctly to AlertDialogFooter
 * - Creates handlers that call onConfirm, onCancel, and onClose appropriately
 * - Handles different prop combinations (showCancel, destructive, etc.)
 * - Handles async onConfirm callbacks
 * - Handles undefined callbacks
 */

import { createAlertDialogFooter } from '@core/ui/feedback/alert-dialog/helpers/AlertDialog.helpers';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const DEFAULT_PROPS = {
	showCancel: true,
	cancelLabel: 'Cancel',
	confirmLabel: 'Confirm',
	destructive: false,
	onConfirm: undefined,
	onCancel: undefined,
	onClose: vi.fn(),
};

describe('createAlertDialogFooter', () => {
	describe('Rendering', () => {
		it('renders AlertDialogFooter component', () => {
			const footer = createAlertDialogFooter(DEFAULT_PROPS);
			renderWithProviders(footer);

			expect(screen.getByText('Confirm')).toBeInTheDocument();
			expect(screen.getByText('Cancel')).toBeInTheDocument();
		});

		it('renders with custom labels', () => {
			const footer = createAlertDialogFooter({
				...DEFAULT_PROPS,
				cancelLabel: 'No',
				confirmLabel: 'Yes',
			});
			renderWithProviders(footer);

			expect(screen.getByText('Yes')).toBeInTheDocument();
			expect(screen.getByText('No')).toBeInTheDocument();
		});

		it('hides cancel button when showCancel is false', () => {
			const footer = createAlertDialogFooter({
				...DEFAULT_PROPS,
				showCancel: false,
			});
			renderWithProviders(footer);

			expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
			expect(screen.getByText('Confirm')).toBeInTheDocument();
		});

		it('shows cancel button when showCancel is true', () => {
			const footer = createAlertDialogFooter({
				...DEFAULT_PROPS,
				showCancel: true,
			});
			renderWithProviders(footer);

			expect(screen.getByText('Cancel')).toBeInTheDocument();
			expect(screen.getByText('Confirm')).toBeInTheDocument();
		});
	});

	describe('Handler Creation - onClose', () => {
		it('calls onClose when confirm button is clicked without onConfirm', async () => {
			const onClose = vi.fn();
			const footer = createAlertDialogFooter({
				...DEFAULT_PROPS,
				onClose,
				onConfirm: undefined,
			});
			renderWithProviders(footer);

			const confirmButton = screen.getByText('Confirm');
			fireEvent.click(confirmButton);

			await waitFor(() => {
				expect(onClose).toHaveBeenCalledTimes(1);
			});
		});

		it('calls onClose when cancel button is clicked without onCancel', () => {
			const onClose = vi.fn();
			const footer = createAlertDialogFooter({
				...DEFAULT_PROPS,
				onClose,
				onCancel: undefined,
			});
			renderWithProviders(footer);

			const cancelButton = screen.getByText('Cancel');
			fireEvent.click(cancelButton);

			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});

	describe('Handler Creation - onConfirm', () => {
		it('calls onConfirm and then onClose when confirm button is clicked', async () => {
			const onConfirm = vi.fn();
			const onClose = vi.fn();
			const footer = createAlertDialogFooter({
				...DEFAULT_PROPS,
				onConfirm,
				onClose,
			});
			renderWithProviders(footer);

			const confirmButton = screen.getByText('Confirm');
			fireEvent.click(confirmButton);

			await waitFor(() => {
				expect(onConfirm).toHaveBeenCalledTimes(1);
				expect(onClose).toHaveBeenCalledTimes(1);
			});

			// Verify onClose is called after onConfirm
			expect(onConfirm).toHaveBeenCalledBefore(onClose);
		});

		it('handles async onConfirm callback', async () => {
			const asyncConfirm = async () => {
				await new Promise(resolve => setTimeout(resolve, 10));
			};
			const onConfirm = vi.fn(asyncConfirm);
			const onClose = vi.fn();
			const footer = createAlertDialogFooter({
				...DEFAULT_PROPS,
				onConfirm,
				onClose,
			});
			renderWithProviders(footer);

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

		it('does not call onClose if onConfirm throws an error', async () => {
			const throwingConfirm = async () => {
				throw new Error('Test error');
			};
			const onConfirm = vi.fn(throwingConfirm);
			const onClose = vi.fn();
			const footer = createAlertDialogFooter({
				...DEFAULT_PROPS,
				onConfirm,
				onClose,
			});
			renderWithProviders(footer);

			const confirmButton = screen.getByText('Confirm');

			// Suppress unhandled rejection for this test
			const originalUnhandledRejection = process.listeners('unhandledRejection');
			const errorHandler = vi.fn();
			process.on('unhandledRejection', errorHandler);

			// Click button - error will be thrown asynchronously
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

			// onConfirm should have been called
			expect(onConfirm).toHaveBeenCalledTimes(1);
			// onClose should not be called when onConfirm throws
			expect(onClose).not.toHaveBeenCalled();
		});
	});

	describe('Handler Creation - onCancel', () => {
		it('calls onCancel and then onClose when cancel button is clicked', () => {
			const onCancel = vi.fn();
			const onClose = vi.fn();
			const footer = createAlertDialogFooter({
				...DEFAULT_PROPS,
				onCancel,
				onClose,
			});
			renderWithProviders(footer);

			const cancelButton = screen.getByText('Cancel');
			fireEvent.click(cancelButton);

			expect(onCancel).toHaveBeenCalledTimes(1);
			expect(onClose).toHaveBeenCalledTimes(1);

			// Verify onClose is called after onCancel
			expect(onCancel).toHaveBeenCalledBefore(onClose);
		});

		it('does not call onClose if onCancel throws an error', () => {
			const throwingCancel = () => {
				throw new Error('Test error');
			};
			const onCancel = vi.fn(throwingCancel);
			const onClose = vi.fn();
			const footer = createAlertDialogFooter({
				...DEFAULT_PROPS,
				onCancel,
				onClose,
			});
			renderWithProviders(footer);

			const cancelButton = screen.getByText('Cancel');

			// Suppress uncaught exception for this test
			const originalUncaughtException = process.listeners('uncaughtException');
			const errorHandler = vi.fn();
			process.on('uncaughtException', errorHandler);

			// Click button - error will be thrown but not caught
			fireEvent.click(cancelButton);

			// Clean up error handler
			process.removeListener('uncaughtException', errorHandler);
			for (const listener of originalUncaughtException) {
				process.on('uncaughtException', listener);
			}

			expect(onCancel).toHaveBeenCalledTimes(1);
			// onClose should not be called when onCancel throws
			expect(onClose).not.toHaveBeenCalled();
		});
	});

	describe('Props Passing', () => {
		it('passes showCancel prop correctly', () => {
			const footerWithCancel = createAlertDialogFooter({
				...DEFAULT_PROPS,
				showCancel: true,
			});
			const { container: containerWithCancel } = renderWithProviders(footerWithCancel);
			expect(containerWithCancel.querySelectorAll('button')).toHaveLength(2);

			const footerWithoutCancel = createAlertDialogFooter({
				...DEFAULT_PROPS,
				showCancel: false,
			});
			const { container: containerWithoutCancel } = renderWithProviders(footerWithoutCancel);
			expect(containerWithoutCancel.querySelectorAll('button')).toHaveLength(1);
		});

		it('passes cancelLabel prop correctly', () => {
			const footer = createAlertDialogFooter({
				...DEFAULT_PROPS,
				cancelLabel: 'Abort',
			});
			renderWithProviders(footer);

			expect(screen.getByText('Abort')).toBeInTheDocument();
		});

		it('passes confirmLabel prop correctly', () => {
			const footer = createAlertDialogFooter({
				...DEFAULT_PROPS,
				confirmLabel: 'Delete',
			});
			renderWithProviders(footer);

			expect(screen.getByText('Delete')).toBeInTheDocument();
		});

		it('passes destructive prop correctly', () => {
			const footer = createAlertDialogFooter({
				...DEFAULT_PROPS,
				destructive: true,
			});
			renderWithProviders(footer);

			const confirmButton = screen.getByText('Confirm');
			// Check that destructive styling is applied (button should have destructive classes)
			expect(confirmButton).toHaveClass('bg-destructive');
		});

		it('does not apply destructive styling when destructive is false', () => {
			const footer = createAlertDialogFooter({
				...DEFAULT_PROPS,
				destructive: false,
			});
			renderWithProviders(footer);

			const confirmButton = screen.getByText('Confirm');
			// Button should not have destructive classes
			expect(confirmButton).not.toHaveClass('bg-destructive');
		});
	});

	describe('Edge Cases', () => {
		it('handles all callbacks being undefined', async () => {
			const onClose = vi.fn();
			const footer = createAlertDialogFooter({
				...DEFAULT_PROPS,
				onConfirm: undefined,
				onCancel: undefined,
				onClose,
			});
			renderWithProviders(footer);

			const confirmButton = screen.getByText('Confirm');
			fireEvent.click(confirmButton);

			await waitFor(() => {
				expect(onClose).toHaveBeenCalledTimes(1);
			});

			const cancelButton = screen.getByText('Cancel');
			fireEvent.click(cancelButton);

			expect(onClose).toHaveBeenCalledTimes(2);
		});

		it('handles multiple confirm clicks', async () => {
			const onConfirm = vi.fn();
			const onClose = vi.fn();
			const footer = createAlertDialogFooter({
				...DEFAULT_PROPS,
				onConfirm,
				onClose,
			});
			renderWithProviders(footer);

			const confirmButton = screen.getByText('Confirm');
			fireEvent.click(confirmButton);
			fireEvent.click(confirmButton);

			await waitFor(() => {
				expect(onConfirm).toHaveBeenCalledTimes(2);
				expect(onClose).toHaveBeenCalledTimes(2);
			});
		});

		it('handles multiple cancel clicks', () => {
			const onCancel = vi.fn();
			const onClose = vi.fn();
			const footer = createAlertDialogFooter({
				...DEFAULT_PROPS,
				onCancel,
				onClose,
			});
			renderWithProviders(footer);

			const cancelButton = screen.getByText('Cancel');
			fireEvent.click(cancelButton);
			fireEvent.click(cancelButton);

			expect(onCancel).toHaveBeenCalledTimes(2);
			expect(onClose).toHaveBeenCalledTimes(2);
		});
	});
});
