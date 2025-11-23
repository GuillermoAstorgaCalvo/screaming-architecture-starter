/**
 * Tests for Popconfirm.renderers
 *
 * Tests the renderer functions:
 * - renderFooter
 * - renderDescription
 * - renderPopconfirmContent
 */

import {
	renderDescription,
	renderFooter,
	renderPopconfirmContent,
} from '@core/ui/overlays/popconfirm/helpers/Popconfirm.renderers';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('renderFooter', () => {
	it('renders footer with cancel and confirm buttons when showCancel is true', () => {
		const onCancel = vi.fn();
		const onConfirm = vi.fn().mockResolvedValue(undefined);
		const footer = renderFooter({
			showCancel: true,
			cancelLabel: 'Cancel',
			confirmLabel: 'Confirm',
			destructive: false,
			onCancel,
			onConfirm,
		});

		renderWithProviders(footer as React.ReactElement);

		expect(screen.getByText('Cancel')).toBeInTheDocument();
		expect(screen.getByText('Confirm')).toBeInTheDocument();
	});

	it('does not render cancel button when showCancel is false', () => {
		const onConfirm = vi.fn().mockResolvedValue(undefined);
		const footer = renderFooter({
			showCancel: false,
			cancelLabel: 'Cancel',
			confirmLabel: 'Confirm',
			destructive: false,
			onCancel: vi.fn(),
			onConfirm,
		});

		renderWithProviders(footer as React.ReactElement);

		expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
		expect(screen.getByText('Confirm')).toBeInTheDocument();
	});

	it('renders with custom labels', () => {
		const onCancel = vi.fn();
		const onConfirm = vi.fn().mockResolvedValue(undefined);
		const footer = renderFooter({
			showCancel: true,
			cancelLabel: 'No',
			confirmLabel: 'Yes',
			destructive: false,
			onCancel,
			onConfirm,
		});

		renderWithProviders(footer as React.ReactElement);

		expect(screen.getByText('No')).toBeInTheDocument();
		expect(screen.getByText('Yes')).toBeInTheDocument();
	});

	it('applies destructive styling when destructive is true', () => {
		const onConfirm = vi.fn().mockResolvedValue(undefined);
		const footer = renderFooter({
			showCancel: true,
			cancelLabel: 'Cancel',
			confirmLabel: 'Confirm',
			destructive: true,
			onCancel: vi.fn(),
			onConfirm,
		});

		renderWithProviders(footer as React.ReactElement);

		const confirmButton = screen.getByText('Confirm');
		expect(confirmButton).toHaveClass('bg-destructive');
	});

	it('does not apply destructive styling when destructive is false', () => {
		const onConfirm = vi.fn().mockResolvedValue(undefined);
		const footer = renderFooter({
			showCancel: true,
			cancelLabel: 'Cancel',
			confirmLabel: 'Confirm',
			destructive: false,
			onCancel: vi.fn(),
			onConfirm,
		});

		renderWithProviders(footer as React.ReactElement);

		const confirmButton = screen.getByText('Confirm');
		expect(confirmButton).not.toHaveClass('bg-destructive');
	});

	it('calls onCancel when cancel button is clicked', () => {
		const onCancel = vi.fn();
		const onConfirm = vi.fn().mockResolvedValue(undefined);
		const footer = renderFooter({
			showCancel: true,
			cancelLabel: 'Cancel',
			confirmLabel: 'Confirm',
			destructive: false,
			onCancel,
			onConfirm,
		});

		renderWithProviders(footer as React.ReactElement);

		const cancelButton = screen.getByText('Cancel');
		fireEvent.click(cancelButton);

		expect(onCancel).toHaveBeenCalledTimes(1);
	});

	it('calls onConfirm when confirm button is clicked', async () => {
		const onConfirm = vi.fn().mockResolvedValue(undefined);
		const footer = renderFooter({
			showCancel: true,
			cancelLabel: 'Cancel',
			confirmLabel: 'Confirm',
			destructive: false,
			onCancel: vi.fn(),
			onConfirm,
		});

		renderWithProviders(footer as React.ReactElement);

		const confirmButton = screen.getByText('Confirm');
		fireEvent.click(confirmButton);

		await waitFor(() => {
			expect(onConfirm).toHaveBeenCalledTimes(1);
		});
	});
});

describe('renderDescription', () => {
	it('returns null when description is undefined', () => {
		const result = renderDescription(undefined);

		expect(result).toBeNull();
	});

	it('renders description when provided as string', () => {
		const description = renderDescription('Test description');

		renderWithProviders(description as React.ReactElement);

		expect(screen.getByText('Test description')).toBeInTheDocument();
	});

	it('renders description when provided as ReactNode', () => {
		const description = renderDescription(<span>Custom description</span>);

		renderWithProviders(description as React.ReactElement);

		expect(screen.getByText('Custom description')).toBeInTheDocument();
	});
});

describe('renderPopconfirmContent', () => {
	it('renders content with title, description, and footer', () => {
		const footer = renderFooter({
			showCancel: true,
			cancelLabel: 'Cancel',
			confirmLabel: 'Confirm',
			destructive: false,
			onCancel: vi.fn(),
			onConfirm: vi.fn().mockResolvedValue(undefined),
		});
		const content = renderPopconfirmContent({
			title: 'Test Title',
			description: 'Test Description',
			footer,
		});

		renderWithProviders(content as React.ReactElement);

		expect(screen.getByText('Test Title')).toBeInTheDocument();
		expect(screen.getByText('Test Description')).toBeInTheDocument();
		expect(screen.getByText('Cancel')).toBeInTheDocument();
		expect(screen.getByText('Confirm')).toBeInTheDocument();
	});

	it('renders content without description when description is undefined', () => {
		const footer = renderFooter({
			showCancel: true,
			cancelLabel: 'Cancel',
			confirmLabel: 'Confirm',
			destructive: false,
			onCancel: vi.fn(),
			onConfirm: vi.fn().mockResolvedValue(undefined),
		});
		const content = renderPopconfirmContent({
			title: 'Test Title',
			description: undefined,
			footer,
		});

		renderWithProviders(content as React.ReactElement);

		expect(screen.getByText('Test Title')).toBeInTheDocument();
		expect(screen.getByText('Cancel')).toBeInTheDocument();
		expect(screen.getByText('Confirm')).toBeInTheDocument();
	});
});
