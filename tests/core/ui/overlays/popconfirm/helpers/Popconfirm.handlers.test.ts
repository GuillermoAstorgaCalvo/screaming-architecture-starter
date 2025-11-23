/**
 * Tests for Popconfirm.handlers
 *
 * Tests the handler creation functions:
 * - createConfirmHandler
 * - createCancelHandler
 * - prepareHandlers
 */

import {
	createCancelHandler,
	createConfirmHandler,
	prepareHandlers,
} from '@core/ui/overlays/popconfirm/helpers/Popconfirm.handlers';
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

	it('calls onClose when onConfirm is undefined', async () => {
		const onClose = vi.fn();
		const handler = createConfirmHandler(undefined, onClose);

		await handler();

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('handles async onConfirm callback', async () => {
		const asyncConfirm = async () => {
			await new Promise(resolve => setTimeout(resolve, 10));
		};
		const onConfirm = vi.fn(asyncConfirm);
		const onClose = vi.fn();
		const handler = createConfirmHandler(onConfirm, onClose);

		await handler();

		expect(onConfirm).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('calls onClose even if onConfirm throws an error', async () => {
		const throwingConfirm = async () => {
			throw new Error('Test error');
		};
		const onConfirm = vi.fn(throwingConfirm);
		const onClose = vi.fn();
		const handler = createConfirmHandler(onConfirm, onClose);

		await expect(handler()).rejects.toThrow('Test error');

		expect(onConfirm).toHaveBeenCalledTimes(1);
		// onClose should not be called when onConfirm throws
		expect(onClose).not.toHaveBeenCalled();
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

	it('calls onClose when onCancel is undefined', () => {
		const onClose = vi.fn();
		const handler = createCancelHandler(undefined, onClose);

		handler();

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('does not call onClose if onCancel throws an error', () => {
		const throwingCancel = () => {
			throw new Error('Test error');
		};
		const onCancel = vi.fn(throwingCancel);
		const onClose = vi.fn();
		const handler = createCancelHandler(onCancel, onClose);

		expect(() => handler()).toThrow('Test error');

		expect(onCancel).toHaveBeenCalledTimes(1);
		// onClose should not be called when onCancel throws
		expect(onClose).not.toHaveBeenCalled();
	});
});

describe('prepareHandlers', () => {
	it('returns both handleConfirm and handleCancel', () => {
		const onClose = vi.fn();
		const handlers = prepareHandlers(undefined, undefined, onClose);

		expect(handlers.handleConfirm).toBeDefined();
		expect(handlers.handleCancel).toBeDefined();
		expect(typeof handlers.handleConfirm).toBe('function');
		expect(typeof handlers.handleCancel).toBe('function');
	});

	it('returns working confirm handler', async () => {
		const onConfirm = vi.fn();
		const onClose = vi.fn();
		const { handleConfirm } = prepareHandlers(onConfirm, undefined, onClose);

		await handleConfirm();

		expect(onConfirm).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('returns working cancel handler', () => {
		const onCancel = vi.fn();
		const onClose = vi.fn();
		const { handleCancel } = prepareHandlers(undefined, onCancel, onClose);

		handleCancel();

		expect(onCancel).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('handles all callbacks being undefined', async () => {
		const onClose = vi.fn();
		const { handleConfirm, handleCancel } = prepareHandlers(undefined, undefined, onClose);

		await handleConfirm();
		expect(onClose).toHaveBeenCalledTimes(1);

		handleCancel();
		expect(onClose).toHaveBeenCalledTimes(2);
	});
});
