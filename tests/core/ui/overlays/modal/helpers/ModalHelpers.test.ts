/**
 * Tests for ModalHelpers
 *
 * Tests the helper functions for modal event handlers:
 * - createOverlayClickHandler
 * - createOverlayKeyDownHandler
 * - createModalEventHandlers
 * - createDialogCancelHandler
 */

import {
	createDialogCancelHandler,
	createModalEventHandlers,
	createOverlayClickHandler,
	createOverlayKeyDownHandler,
} from '@core/ui/overlays/modal/helpers/ModalHelpers';
import { describe, expect, it, vi } from 'vitest';

describe('createOverlayClickHandler', () => {
	it('calls onClose when closeOnOverlayClick is true and target equals currentTarget', () => {
		const onClose = vi.fn();
		const handler = createOverlayClickHandler(true, onClose);

		const event = {
			target: document.createElement('dialog'),
			currentTarget: document.createElement('dialog'),
		} as unknown as React.MouseEvent<HTMLDialogElement>;

		// Make target and currentTarget the same element
		event.target = event.currentTarget;

		handler(event);

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('does not call onClose when closeOnOverlayClick is false', () => {
		const onClose = vi.fn();
		const handler = createOverlayClickHandler(false, onClose);

		const event = {
			target: document.createElement('dialog'),
			currentTarget: document.createElement('dialog'),
		} as unknown as React.MouseEvent<HTMLDialogElement>;

		event.target = event.currentTarget;

		handler(event);

		expect(onClose).not.toHaveBeenCalled();
	});

	it('does not call onClose when target does not equal currentTarget', () => {
		const onClose = vi.fn();
		const handler = createOverlayClickHandler(true, onClose);

		const dialog = document.createElement('dialog');
		const child = document.createElement('div');
		dialog.append(child);

		const event = {
			target: child,
			currentTarget: dialog,
		} as unknown as React.MouseEvent<HTMLDialogElement>;

		handler(event);

		expect(onClose).not.toHaveBeenCalled();
	});
});

describe('createOverlayKeyDownHandler', () => {
	it('does not call onClose when Escape key is pressed', () => {
		const onClose = vi.fn();
		const handler = createOverlayKeyDownHandler(true, onClose);

		const event = {
			key: 'Escape',
			target: document.createElement('dialog'),
			currentTarget: document.createElement('dialog'),
		} as unknown as React.KeyboardEvent<HTMLDialogElement>;

		event.target = event.currentTarget;

		handler(event);

		expect(onClose).not.toHaveBeenCalled();
	});

	it('calls onClose when Enter key is pressed, closeOnOverlayClick is true, and target equals currentTarget', () => {
		const onClose = vi.fn();
		const handler = createOverlayKeyDownHandler(true, onClose);

		const event = {
			key: 'Enter',
			target: document.createElement('dialog'),
			currentTarget: document.createElement('dialog'),
		} as unknown as React.KeyboardEvent<HTMLDialogElement>;

		event.target = event.currentTarget;

		handler(event);

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('calls onClose when Space key is pressed, closeOnOverlayClick is true, and target equals currentTarget', () => {
		const onClose = vi.fn();
		const handler = createOverlayKeyDownHandler(true, onClose);

		const event = {
			key: ' ',
			target: document.createElement('dialog'),
			currentTarget: document.createElement('dialog'),
		} as unknown as React.KeyboardEvent<HTMLDialogElement>;

		event.target = event.currentTarget;

		handler(event);

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('does not call onClose when Enter key is pressed but closeOnOverlayClick is false', () => {
		const onClose = vi.fn();
		const handler = createOverlayKeyDownHandler(false, onClose);

		const event = {
			key: 'Enter',
			target: document.createElement('dialog'),
			currentTarget: document.createElement('dialog'),
		} as unknown as React.KeyboardEvent<HTMLDialogElement>;

		event.target = event.currentTarget;

		handler(event);

		expect(onClose).not.toHaveBeenCalled();
	});

	it('does not call onClose when Enter key is pressed but target does not equal currentTarget', () => {
		const onClose = vi.fn();
		const handler = createOverlayKeyDownHandler(true, onClose);

		const dialog = document.createElement('dialog');
		const child = document.createElement('div');
		dialog.append(child);

		const event = {
			key: 'Enter',
			target: child,
			currentTarget: dialog,
		} as unknown as React.KeyboardEvent<HTMLDialogElement>;

		handler(event);

		expect(onClose).not.toHaveBeenCalled();
	});

	it('does not call onClose for other keys', () => {
		const onClose = vi.fn();
		const handler = createOverlayKeyDownHandler(true, onClose);

		const event = {
			key: 'Tab',
			target: document.createElement('dialog'),
			currentTarget: document.createElement('dialog'),
		} as unknown as React.KeyboardEvent<HTMLDialogElement>;

		event.target = event.currentTarget;

		handler(event);

		expect(onClose).not.toHaveBeenCalled();
	});
});

describe('createModalEventHandlers', () => {
	it('returns handlers for overlay click and keydown', () => {
		const onClose = vi.fn();
		const handlers = createModalEventHandlers(true, onClose);

		expect(handlers.handleOverlayClick).toBeDefined();
		expect(handlers.handleOverlayKeyDown).toBeDefined();
		expect(typeof handlers.handleOverlayClick).toBe('function');
		expect(typeof handlers.handleOverlayKeyDown).toBe('function');
	});

	it('returns working overlay click handler', () => {
		const onClose = vi.fn();
		const { handleOverlayClick } = createModalEventHandlers(true, onClose);

		const event = {
			target: document.createElement('dialog'),
			currentTarget: document.createElement('dialog'),
		} as unknown as React.MouseEvent<HTMLDialogElement>;

		event.target = event.currentTarget;

		handleOverlayClick(event);

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('returns working overlay keydown handler', () => {
		const onClose = vi.fn();
		const { handleOverlayKeyDown } = createModalEventHandlers(true, onClose);

		const event = {
			key: 'Enter',
			target: document.createElement('dialog'),
			currentTarget: document.createElement('dialog'),
		} as unknown as React.KeyboardEvent<HTMLDialogElement>;

		event.target = event.currentTarget;

		handleOverlayKeyDown(event);

		expect(onClose).toHaveBeenCalledTimes(1);
	});
});

describe('createDialogCancelHandler', () => {
	it('calls onClose and prevents default when closeOnEscape is true', () => {
		const onClose = vi.fn();
		const handler = createDialogCancelHandler(true, onClose);

		const event = {
			preventDefault: vi.fn(),
		} as unknown as React.SyntheticEvent<HTMLDialogElement>;

		handler(event);

		expect(event.preventDefault).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('does not call onClose or preventDefault when closeOnEscape is false', () => {
		const onClose = vi.fn();
		const handler = createDialogCancelHandler(false, onClose);

		const event = {
			preventDefault: vi.fn(),
		} as unknown as React.SyntheticEvent<HTMLDialogElement>;

		handler(event);

		expect(event.preventDefault).not.toHaveBeenCalled();
		expect(onClose).not.toHaveBeenCalled();
	});
});
