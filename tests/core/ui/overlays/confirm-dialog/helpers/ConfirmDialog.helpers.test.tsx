/**
 * ConfirmDialog.helpers Tests
 *
 * Tests for the ConfirmDialog helper functions including:
 * - createConfirmHandler
 * - createCancelHandler
 * - renderFooter
 * - renderDescription
 * - prepareHandlers
 * - prepareDialogProps
 */

import {
	createCancelHandler,
	createConfirmHandler,
	prepareDialogProps,
	prepareHandlers,
	renderDescription,
	renderFooter,
} from '@core/ui/overlays/confirm-dialog/helpers/ConfirmDialog.helpers';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('createConfirmHandler', () => {
	it('calls onConfirm and then onClose when onConfirm is provided', async () => {
		const onConfirm = vi.fn();
		const onClose = vi.fn();
		const handler = createConfirmHandler(onConfirm, onClose);

		await handler();

		expect(onConfirm).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onConfirm).toHaveBeenCalledBefore(onClose);
	});

	it('calls onClose even when onConfirm is not provided', async () => {
		const onClose = vi.fn();
		const handler = createConfirmHandler(undefined, onClose);

		await handler();

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('handles async onConfirm', async () => {
		const onConfirm = vi.fn(async () => {
			await new Promise(resolve => setTimeout(resolve, 10));
		});
		const onClose = vi.fn();
		const handler = createConfirmHandler(onConfirm, onClose);

		await handler();

		await waitFor(() => {
			expect(onConfirm).toHaveBeenCalledTimes(1);
			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});
});

describe('createCancelHandler', () => {
	it('calls onCancel and then onClose when onCancel is provided', () => {
		const onCancel = vi.fn();
		const onClose = vi.fn();
		const handler = createCancelHandler(onCancel, onClose);

		handler();

		expect(onCancel).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onCancel).toHaveBeenCalledBefore(onClose);
	});

	it('calls onClose even when onCancel is not provided', () => {
		const onClose = vi.fn();
		const handler = createCancelHandler(undefined, onClose);

		handler();

		expect(onClose).toHaveBeenCalledTimes(1);
	});
});

describe('renderFooter', () => {
	it('renders footer with cancel and confirm buttons', () => {
		const footer = renderFooter({
			showCancel: true,
			cancelLabel: 'Cancel',
			confirmLabel: 'Confirm',
			destructive: false,
			onCancel: vi.fn(),
			onConfirm: vi.fn(),
		});

		renderWithProviders(<>{footer}</>);

		expect(screen.getByText('Confirm')).toBeInTheDocument();
		expect(screen.getByText('Cancel')).toBeInTheDocument();
	});

	it('hides cancel button when showCancel is false', () => {
		const footer = renderFooter({
			showCancel: false,
			cancelLabel: 'Cancel',
			confirmLabel: 'Confirm',
			destructive: false,
			onCancel: vi.fn(),
			onConfirm: vi.fn(),
		});

		renderWithProviders(<>{footer}</>);

		expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
		expect(screen.getByText('Confirm')).toBeInTheDocument();
	});

	it('shows cancel button when showCancel is true', () => {
		const footer = renderFooter({
			showCancel: true,
			cancelLabel: 'Cancel',
			confirmLabel: 'Confirm',
			destructive: false,
			onCancel: vi.fn(),
			onConfirm: vi.fn(),
		});

		renderWithProviders(<>{footer}</>);

		expect(screen.getByText('Cancel')).toBeInTheDocument();
		expect(screen.getByText('Confirm')).toBeInTheDocument();
	});

	it('applies destructive styling when destructive is true', () => {
		const footer = renderFooter({
			showCancel: true,
			cancelLabel: 'Cancel',
			confirmLabel: 'Confirm',
			destructive: true,
			onCancel: vi.fn(),
			onConfirm: vi.fn(),
		});

		renderWithProviders(<>{footer}</>);

		const confirmButton = screen.getByText('Confirm');
		expect(confirmButton).toHaveClass('bg-destructive');
	});

	it('does not apply destructive styling when destructive is false', () => {
		const footer = renderFooter({
			showCancel: true,
			cancelLabel: 'Cancel',
			confirmLabel: 'Confirm',
			destructive: false,
			onCancel: vi.fn(),
			onConfirm: vi.fn(),
		});

		renderWithProviders(<>{footer}</>);

		const confirmButton = screen.getByText('Confirm');
		expect(confirmButton).not.toHaveClass('bg-destructive');
	});

	it('calls onConfirm when confirm button is clicked', async () => {
		const onConfirm = vi.fn();
		const footer = renderFooter({
			showCancel: true,
			cancelLabel: 'Cancel',
			confirmLabel: 'Confirm',
			destructive: false,
			onCancel: vi.fn(),
			onConfirm,
		});

		renderWithProviders(<>{footer}</>);

		const confirmButton = screen.getByText('Confirm');
		fireEvent.click(confirmButton);

		await waitFor(() => {
			expect(onConfirm).toHaveBeenCalledTimes(1);
		});
	});

	it('calls onCancel when cancel button is clicked', () => {
		const onCancel = vi.fn();
		const footer = renderFooter({
			showCancel: true,
			cancelLabel: 'Cancel',
			confirmLabel: 'Confirm',
			destructive: false,
			onCancel,
			onConfirm: vi.fn(),
		});

		renderWithProviders(<>{footer}</>);

		const cancelButton = screen.getByText('Cancel');
		fireEvent.click(cancelButton);

		expect(onCancel).toHaveBeenCalledTimes(1);
	});
});

describe('renderDescription', () => {
	it('renders description when provided as string', () => {
		const description = renderDescription('Test description');

		renderWithProviders(<>{description}</>);

		expect(screen.getByText('Test description')).toBeInTheDocument();
	});

	it('renders description when provided as ReactNode', () => {
		const descriptionNode = <div data-testid="custom-desc">Custom description</div>;
		const description = renderDescription(descriptionNode);

		renderWithProviders(<>{description}</>);

		expect(screen.getByTestId('custom-desc')).toBeInTheDocument();
	});

	it('returns null when description is undefined', () => {
		const description = renderDescription(undefined);

		expect(description).toBeNull();
	});

	it('applies correct styling to description', () => {
		const description = renderDescription('Test description');

		renderWithProviders(<>{description}</>);

		const descElement = screen.getByText('Test description');
		expect(descElement).toHaveClass('text-sm', 'text-muted-foreground');
	});
});

describe('prepareHandlers', () => {
	it('creates handleConfirm and handleCancel', () => {
		const onConfirm = vi.fn();
		const onCancel = vi.fn();
		const onClose = vi.fn();
		const handlers = prepareHandlers(onConfirm, onCancel, onClose);

		expect(handlers.handleConfirm).toBeDefined();
		expect(handlers.handleCancel).toBeDefined();
		expect(typeof handlers.handleConfirm).toBe('function');
		expect(typeof handlers.handleCancel).toBe('function');
	});

	it('handleConfirm calls onConfirm and onClose', async () => {
		const onConfirm = vi.fn();
		const onCancel = vi.fn();
		const onClose = vi.fn();
		const { handleConfirm } = prepareHandlers(onConfirm, onCancel, onClose);

		await handleConfirm();

		expect(onConfirm).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('handleCancel calls onCancel and onClose', () => {
		const onConfirm = vi.fn();
		const onCancel = vi.fn();
		const onClose = vi.fn();
		const { handleCancel } = prepareHandlers(onConfirm, onCancel, onClose);

		handleCancel();

		expect(onCancel).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('handles undefined callbacks', async () => {
		const onClose = vi.fn();
		const { handleConfirm, handleCancel } = prepareHandlers(undefined, undefined, onClose);

		await handleConfirm();
		handleCancel();

		expect(onClose).toHaveBeenCalledTimes(2);
	});
});

describe('prepareDialogProps', () => {
	it('returns all required props', () => {
		const props = prepareDialogProps({
			isOpen: true,
			onClose: vi.fn(),
			title: 'Test Title',
			size: 'sm',
			variant: 'centered',
			className: undefined,
			footer: <div>Footer</div>,
			children: <div>Content</div>,
		});

		expect(props.isOpen).toBe(true);
		expect(props.onClose).toBeDefined();
		expect(props.title).toBe('Test Title');
		expect(props.size).toBe('sm');
		expect(props.variant).toBe('centered');
		expect(props.showCloseButton).toBe(false);
		expect(props.closeOnOverlayClick).toBe(false);
		expect(props.footer).toBeDefined();
		expect(props.children).toBeDefined();
	});

	it('includes className when provided', () => {
		const props = prepareDialogProps({
			isOpen: true,
			onClose: vi.fn(),
			title: 'Test Title',
			size: 'sm',
			variant: 'centered',
			className: 'custom-class',
			footer: <div>Footer</div>,
			children: <div>Content</div>,
		});

		expect(props.className).toBe('custom-class');
	});

	it('does not include className when undefined', () => {
		const props = prepareDialogProps({
			isOpen: true,
			onClose: vi.fn(),
			title: 'Test Title',
			size: 'sm',
			variant: 'centered',
			className: undefined,
			footer: <div>Footer</div>,
			children: <div>Content</div>,
		});

		expect(props.className).toBeUndefined();
	});

	it('always sets showCloseButton to false', () => {
		const props = prepareDialogProps({
			isOpen: true,
			onClose: vi.fn(),
			title: 'Test Title',
			size: 'sm',
			variant: 'centered',
			className: undefined,
			footer: <div>Footer</div>,
			children: <div>Content</div>,
		});

		expect(props.showCloseButton).toBe(false);
	});

	it('always sets closeOnOverlayClick to false', () => {
		const props = prepareDialogProps({
			isOpen: true,
			onClose: vi.fn(),
			title: 'Test Title',
			size: 'sm',
			variant: 'centered',
			className: undefined,
			footer: <div>Footer</div>,
			children: <div>Content</div>,
		});

		expect(props.closeOnOverlayClick).toBe(false);
	});
});
