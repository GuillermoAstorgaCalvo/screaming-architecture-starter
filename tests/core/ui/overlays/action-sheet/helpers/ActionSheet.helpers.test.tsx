import {
	createActionSheetHandlers,
	createActionSheetPortalContent,
	getActionClasses,
	handleActionClick,
	handleOverlayClick,
} from '@core/ui/overlays/action-sheet/helpers/ActionSheet.helpers';
import type { ActionSheetAction } from '@src-types/ui/overlays/interactions';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { MouseEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('ActionSheet Helpers - handleOverlayClick', () => {
	it('calls onClose when closeOnOverlayClick is true and target is currentTarget', () => {
		const onClose = vi.fn();
		const mockEvent = {
			target: document.createElement('div'),
			currentTarget: document.createElement('div'),
		} as unknown as MouseEvent<HTMLDivElement>;

		// Make target and currentTarget the same
		mockEvent.target = mockEvent.currentTarget;

		handleOverlayClick(mockEvent, true, onClose);

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('does not call onClose when closeOnOverlayClick is false', () => {
		const onClose = vi.fn();
		const mockEvent = {
			target: document.createElement('div'),
			currentTarget: document.createElement('div'),
		} as unknown as MouseEvent<HTMLDivElement>;

		mockEvent.target = mockEvent.currentTarget;

		handleOverlayClick(mockEvent, false, onClose);

		expect(onClose).not.toHaveBeenCalled();
	});

	it('does not call onClose when target is not currentTarget', () => {
		const onClose = vi.fn();
		const mockEvent = {
			target: document.createElement('div'),
			currentTarget: document.createElement('div'),
		} as unknown as MouseEvent<HTMLDivElement>;

		// target and currentTarget are different
		handleOverlayClick(mockEvent, true, onClose);

		expect(onClose).not.toHaveBeenCalled();
	});
});

describe('ActionSheet Helpers - handleActionClick', () => {
	it('calls onSelect and onClose when action is not disabled', async () => {
		const onClose = vi.fn();
		const onSelect = vi.fn();
		const action: ActionSheetAction = { id: 'test', label: 'Test', onSelect };

		await handleActionClick(action, onClose);

		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('calls onClose even when onSelect is not provided', async () => {
		const onClose = vi.fn();
		const action: ActionSheetAction = { id: 'test', label: 'Test' };

		await handleActionClick(action, onClose);

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('does not call onSelect or onClose when action is disabled', async () => {
		const onClose = vi.fn();
		const onSelect = vi.fn();
		const action: ActionSheetAction = {
			id: 'test',
			label: 'Test',
			disabled: true,
			onSelect,
		};

		await handleActionClick(action, onClose);

		expect(onSelect).not.toHaveBeenCalled();
		expect(onClose).not.toHaveBeenCalled();
	});

	it('handles async onSelect', async () => {
		const onClose = vi.fn();
		const onSelect = vi.fn(async () => {
			await new Promise(resolve => setTimeout(resolve, 10));
		});
		const action: ActionSheetAction = { id: 'test', label: 'Test', onSelect };

		await handleActionClick(action, onClose);

		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});

describe('ActionSheet Helpers - getActionClasses', () => {
	it('returns base classes for non-destructive action at index 0', () => {
		const action: ActionSheetAction = { id: 'test', label: 'Test' };
		const classes = getActionClasses(action, 0);

		expect(classes).toContain('w-full');
		expect(classes).toContain('flex');
		expect(classes).toContain('text-text-primary');
		expect(classes).not.toContain('text-error');
		expect(classes).not.toContain('border-t');
	});

	it('returns destructive classes for destructive action', () => {
		const action: ActionSheetAction = { id: 'test', label: 'Test', destructive: true };
		const classes = getActionClasses(action, 0);

		expect(classes).toContain('text-error');
		expect(classes).not.toContain('text-text-primary');
	});

	it('includes separator class for index > 0', () => {
		const action: ActionSheetAction = { id: 'test', label: 'Test' };
		const classes = getActionClasses(action, 1);

		expect(classes).toContain('border-t');
	});

	it('does not include separator class for index 0', () => {
		const action: ActionSheetAction = { id: 'test', label: 'Test' };
		const classes = getActionClasses(action, 0);

		expect(classes).not.toContain('border-t');
	});

	it('combines base, default, and separator classes correctly', () => {
		const action: ActionSheetAction = { id: 'test', label: 'Test' };
		const classes = getActionClasses(action, 2);

		expect(classes).toContain('w-full');
		expect(classes).toContain('text-text-primary');
		expect(classes).toContain('border-t');
	});

	it('combines base, destructive, and separator classes correctly', () => {
		const action: ActionSheetAction = { id: 'test', label: 'Test', destructive: true };
		const classes = getActionClasses(action, 1);

		expect(classes).toContain('w-full');
		expect(classes).toContain('text-error');
		expect(classes).toContain('border-t');
	});
});

describe('ActionSheet Helpers - createActionSheetHandlers', () => {
	it('creates handlers with correct onOverlayClick', () => {
		const onClose = vi.fn();
		const handlers = createActionSheetHandlers(true, onClose);

		expect(handlers).toHaveProperty('onOverlayClick');
		expect(handlers).toHaveProperty('onActionClick');
		expect(typeof handlers.onOverlayClick).toBe('function');
		expect(typeof handlers.onActionClick).toBe('function');
	});

	it('onOverlayClick calls handleOverlayClick correctly', () => {
		const onClose = vi.fn();
		const handlers = createActionSheetHandlers(true, onClose);
		const mockEvent = {
			target: document.createElement('div'),
			currentTarget: document.createElement('div'),
		} as unknown as MouseEvent<HTMLDivElement>;

		mockEvent.target = mockEvent.currentTarget;

		handlers.onOverlayClick(mockEvent);

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('onActionClick calls handleActionClick correctly', async () => {
		const onClose = vi.fn();
		const onSelect = vi.fn();
		const handlers = createActionSheetHandlers(true, onClose);
		const action: ActionSheetAction = { id: 'test', label: 'Test', onSelect };

		await handlers.onActionClick(action);

		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('handles closeOnOverlayClick false', () => {
		const onClose = vi.fn();
		const handlers = createActionSheetHandlers(false, onClose);
		const mockEvent = {
			target: document.createElement('div'),
			currentTarget: document.createElement('div'),
		} as unknown as MouseEvent<HTMLDivElement>;

		mockEvent.target = mockEvent.currentTarget;

		handlers.onOverlayClick(mockEvent);

		expect(onClose).not.toHaveBeenCalled();
	});
});

describe('ActionSheet Helpers - createActionSheetPortalContent', () => {
	it('creates portal content with all props', () => {
		const onClose = vi.fn();
		const onActionClick = vi.fn();
		const onOverlayClick = vi.fn();
		const actions: readonly ActionSheetAction[] = [{ id: 'test', label: 'Test' }];

		const portalContent = createActionSheetPortalContent({
			id: 'test-id',
			actions,
			cancelLabel: 'Cancel',
			showCancel: true,
			onClose,
			onActionClick,
			onOverlayClick,
			title: 'Test Title',
			className: 'custom-class',
			overlayClassName: 'overlay-class',
			isOpen: true,
		});

		renderWithProviders(portalContent as React.ReactElement);

		expect(screen.getByText('Test Title')).toBeInTheDocument();
		expect(screen.getByText('Test')).toBeInTheDocument();
		expect(screen.getByText('Cancel')).toBeInTheDocument();
	});

	it('creates portal content without title', () => {
		const onClose = vi.fn();
		const onActionClick = vi.fn();
		const onOverlayClick = vi.fn();
		const actions: readonly ActionSheetAction[] = [{ id: 'test', label: 'Test' }];

		const portalContent = createActionSheetPortalContent({
			id: 'test-id',
			actions,
			cancelLabel: 'Cancel',
			showCancel: true,
			onClose,
			onActionClick,
			onOverlayClick,
			isOpen: true,
		});

		renderWithProviders(portalContent as React.ReactElement);

		expect(screen.getByText('Test')).toBeInTheDocument();
		expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
	});

	it('creates portal content without cancel button', () => {
		const onClose = vi.fn();
		const onActionClick = vi.fn();
		const onOverlayClick = vi.fn();
		const actions: readonly ActionSheetAction[] = [{ id: 'test', label: 'Test' }];

		const portalContent = createActionSheetPortalContent({
			id: 'test-id',
			actions,
			cancelLabel: 'Cancel',
			showCancel: false,
			onClose,
			onActionClick,
			onOverlayClick,
			isOpen: true,
		});

		renderWithProviders(portalContent as React.ReactElement);

		expect(screen.getByText('Test')).toBeInTheDocument();
		expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
	});

	it('creates portal content with Backdrop', () => {
		const onClose = vi.fn();
		const onActionClick = vi.fn();
		const onOverlayClick = vi.fn();
		const actions: readonly ActionSheetAction[] = [{ id: 'test', label: 'Test' }];

		const portalContent = createActionSheetPortalContent({
			id: 'test-id',
			actions,
			cancelLabel: 'Cancel',
			showCancel: true,
			onClose,
			onActionClick,
			onOverlayClick,
			isOpen: true,
		});

		renderWithProviders(portalContent as React.ReactElement);

		// Backdrop should be rendered in document.body (portal)
		const backdrop = document.body.querySelector('[aria-hidden="true"]');
		expect(backdrop).toBeInTheDocument();
	});

	it('creates portal content with custom className', () => {
		const onClose = vi.fn();
		const onActionClick = vi.fn();
		const onOverlayClick = vi.fn();
		const actions: readonly ActionSheetAction[] = [{ id: 'test', label: 'Test' }];

		const portalContent = createActionSheetPortalContent({
			id: 'test-id',
			actions,
			cancelLabel: 'Cancel',
			showCancel: true,
			onClose,
			onActionClick,
			onOverlayClick,
			className: 'custom-class',
			isOpen: true,
		});

		renderWithProviders(portalContent as React.ReactElement);

		const dialog = screen.getByRole('alertdialog');
		expect(dialog).toHaveClass('custom-class');
	});

	it('creates portal content with custom overlayClassName', () => {
		const onClose = vi.fn();
		const onActionClick = vi.fn();
		const onOverlayClick = vi.fn();
		const actions: readonly ActionSheetAction[] = [{ id: 'test', label: 'Test' }];

		const portalContent = createActionSheetPortalContent({
			id: 'test-id',
			actions,
			cancelLabel: 'Cancel',
			showCancel: true,
			onClose,
			onActionClick,
			onOverlayClick,
			overlayClassName: 'custom-overlay',
			isOpen: true,
		});

		renderWithProviders(portalContent as React.ReactElement);

		// Backdrop should have custom className in document.body (portal)
		const backdrop = document.body.querySelector('.custom-overlay');
		expect(backdrop).toBeInTheDocument();
	});
});
