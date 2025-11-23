/**
 * Tests for Popconfirm.builders
 *
 * Tests the builder functions:
 * - buildPopconfirmContent
 * - buildPopoverProps
 * - buildPopconfirmSetup
 */

import {
	buildPopconfirmContent,
	buildPopconfirmSetup,
	buildPopoverProps,
} from '@core/ui/overlays/popconfirm/helpers/Popconfirm.builders';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('buildPopconfirmContent', () => {
	it('builds content with title, description, and footer', () => {
		const onCancel = vi.fn();
		const onConfirm = vi.fn().mockResolvedValue(undefined);
		const content = buildPopconfirmContent({
			title: 'Test Title',
			description: 'Test Description',
			showCancel: true,
			cancelLabel: 'Cancel',
			confirmLabel: 'Confirm',
			destructive: false,
			onCancel,
			onConfirm,
		});

		renderWithProviders(content as React.ReactElement);

		expect(screen.getByText('Test Title')).toBeInTheDocument();
		expect(screen.getByText('Test Description')).toBeInTheDocument();
		expect(screen.getByText('Cancel')).toBeInTheDocument();
		expect(screen.getByText('Confirm')).toBeInTheDocument();
	});

	it('builds content without description when description is undefined', () => {
		const onCancel = vi.fn();
		const onConfirm = vi.fn().mockResolvedValue(undefined);
		const content = buildPopconfirmContent({
			title: 'Test Title',
			description: undefined,
			showCancel: true,
			cancelLabel: 'Cancel',
			confirmLabel: 'Confirm',
			destructive: false,
			onCancel,
			onConfirm,
		});

		renderWithProviders(content as React.ReactElement);

		expect(screen.getByText('Test Title')).toBeInTheDocument();
		expect(screen.getByText('Cancel')).toBeInTheDocument();
		expect(screen.getByText('Confirm')).toBeInTheDocument();
	});

	it('builds content with working handlers', async () => {
		const onCancel = vi.fn();
		const onConfirm = vi.fn().mockResolvedValue(undefined);
		const content = buildPopconfirmContent({
			title: 'Test Title',
			description: 'Test Description',
			showCancel: true,
			cancelLabel: 'Cancel',
			confirmLabel: 'Confirm',
			destructive: false,
			onCancel,
			onConfirm,
		});

		renderWithProviders(content as React.ReactElement);

		const cancelButton = screen.getByText('Cancel');
		fireEvent.click(cancelButton);
		expect(onCancel).toHaveBeenCalledTimes(1);

		const confirmButton = screen.getByText('Confirm');
		fireEvent.click(confirmButton);
		await waitFor(() => {
			expect(onConfirm).toHaveBeenCalledTimes(1);
		});
	});
});

describe('buildPopoverProps', () => {
	it('builds popover props with all required fields', () => {
		const props = buildPopoverProps({
			isOpen: true,
			onClose: vi.fn(),
			trigger: <button>Trigger</button>,
			position: 'top',
			closeOnOutsideClick: true,
			closeOnEscape: true,
			children: <div>Content</div>,
		});

		expect(props.isOpen).toBe(true);
		expect(props.onClose).toBeDefined();
		expect(props.trigger).toBeDefined();
		expect(props.position).toBe('top');
		expect(props.closeOnOutsideClick).toBe(true);
		expect(props.closeOnEscape).toBe(true);
		expect(props.children).toBeDefined();
	});

	it('maps popconfirmId to popoverId', () => {
		const props = buildPopoverProps({
			isOpen: true,
			onClose: vi.fn(),
			trigger: <button>Trigger</button>,
			position: 'top',
			closeOnOutsideClick: true,
			closeOnEscape: true,
			popconfirmId: 'test-id',
			children: <div>Content</div>,
		});

		expect(props.popoverId).toBe('test-id');
	});

	it('maps className correctly', () => {
		const props = buildPopoverProps({
			isOpen: true,
			onClose: vi.fn(),
			trigger: <button>Trigger</button>,
			position: 'top',
			closeOnOutsideClick: true,
			closeOnEscape: true,
			className: 'test-class',
			children: <div>Content</div>,
		});

		expect(props.className).toBe('test-class');
	});

	it('maps containerClassName correctly', () => {
		const props = buildPopoverProps({
			isOpen: true,
			onClose: vi.fn(),
			trigger: <button>Trigger</button>,
			position: 'top',
			closeOnOutsideClick: true,
			closeOnEscape: true,
			containerClassName: 'container-class',
			children: <div>Content</div>,
		});

		expect(props.containerClassName).toBe('container-class');
	});

	it('handles undefined optional props', () => {
		const props = buildPopoverProps({
			isOpen: true,
			onClose: vi.fn(),
			trigger: <button>Trigger</button>,
			position: 'top',
			closeOnOutsideClick: true,
			closeOnEscape: true,
			children: <div>Content</div>,
		});

		expect(props.popoverId).toBeUndefined();
		expect(props.className).toBeUndefined();
		expect(props.containerClassName).toBeUndefined();
	});
});

describe('buildPopconfirmSetup', () => {
	it('builds complete popconfirm setup with all props', () => {
		const onClose = vi.fn();
		const onConfirm = vi.fn().mockResolvedValue(undefined);
		const onCancel = vi.fn();
		const props = buildPopconfirmSetup({
			isOpen: true,
			onClose,
			trigger: <button>Trigger</button>,
			title: 'Test Title',
			description: 'Test Description',
			confirmLabel: 'Confirm',
			cancelLabel: 'Cancel',
			onConfirm,
			onCancel,
			destructive: true,
			showCancel: true,
			position: 'bottom',
			closeOnOutsideClick: false,
			closeOnEscape: false,
			popconfirmId: 'test-id',
			className: 'test-class',
			containerClassName: 'container-class',
		});

		expect(props.isOpen).toBe(true);
		expect(props.onClose).toBe(onClose);
		expect(props.position).toBe('bottom');
		expect(props.closeOnOutsideClick).toBe(false);
		expect(props.closeOnEscape).toBe(false);
		expect(props.popoverId).toBe('test-id');
		expect(props.className).toBe('test-class');
		expect(props.containerClassName).toBe('container-class');
		expect(props.children).toBeDefined();
	});

	it('creates handlers that call onConfirm, onCancel, and onClose', async () => {
		const onClose = vi.fn();
		const onConfirm = vi.fn().mockResolvedValue(undefined);
		const onCancel = vi.fn();
		const props = buildPopconfirmSetup({
			isOpen: true,
			onClose,
			trigger: <button>Trigger</button>,
			title: 'Test Title',
			confirmLabel: 'Confirm',
			cancelLabel: 'Cancel',
			onConfirm,
			onCancel,
			destructive: false,
			showCancel: true,
			position: 'top',
			closeOnOutsideClick: true,
			closeOnEscape: true,
		});

		renderWithProviders(props.children as React.ReactElement);

		const confirmButton = screen.getByText('Confirm');
		fireEvent.click(confirmButton);
		await waitFor(() => {
			expect(onConfirm).toHaveBeenCalledTimes(1);
			expect(onClose).toHaveBeenCalledTimes(1);
		});

		const cancelButton = screen.getByText('Cancel');
		fireEvent.click(cancelButton);
		expect(onCancel).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledTimes(2);
	});

	it('handles undefined onConfirm and onCancel', async () => {
		const onClose = vi.fn();
		const props = buildPopconfirmSetup({
			isOpen: true,
			onClose,
			trigger: <button>Trigger</button>,
			title: 'Test Title',
			confirmLabel: 'Confirm',
			cancelLabel: 'Cancel',
			onConfirm: undefined,
			onCancel: undefined,
			destructive: false,
			showCancel: true,
			position: 'top',
			closeOnOutsideClick: true,
			closeOnEscape: true,
		});

		renderWithProviders(props.children as React.ReactElement);

		const confirmButton = screen.getByText('Confirm');
		fireEvent.click(confirmButton);
		await waitFor(() => {
			expect(onClose).toHaveBeenCalledTimes(1);
		});

		const cancelButton = screen.getByText('Cancel');
		fireEvent.click(cancelButton);
		expect(onClose).toHaveBeenCalledTimes(2);
	});
});
