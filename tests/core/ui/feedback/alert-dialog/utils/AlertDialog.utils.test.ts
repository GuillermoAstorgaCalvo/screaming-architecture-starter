/**
 * AlertDialog.utils Tests
 *
 * Tests for utility functions:
 * - createConfirmHandler
 * - createCancelHandler
 */

import {
	createCancelHandler,
	createConfirmHandler,
} from '@core/ui/feedback/alert-dialog/utils/AlertDialog.utils';
import { describe, expect, it, vi } from 'vitest';

describe('createConfirmHandler', () => {
	it('should call onConfirm and then onClose when onConfirm is provided', async () => {
		const onConfirm = vi.fn();
		const onClose = vi.fn();

		const handler = createConfirmHandler(onConfirm, onClose);
		await handler();

		expect(onConfirm).toHaveBeenCalledOnce();
		expect(onClose).toHaveBeenCalledOnce();
		expect(onConfirm).toHaveBeenCalledBefore(onClose);
	});

	it('should only call onClose when onConfirm is undefined', async () => {
		const onClose = vi.fn();

		const handler = createConfirmHandler(undefined, onClose);
		await handler();

		expect(onClose).toHaveBeenCalledOnce();
	});

	it('should handle async onConfirm callback', async () => {
		const onConfirm = vi.fn().mockResolvedValue(undefined);
		const onClose = vi.fn();

		const handler = createConfirmHandler(onConfirm, onClose);
		await handler();

		expect(onConfirm).toHaveBeenCalledOnce();
		expect(onClose).toHaveBeenCalledOnce();
		expect(onConfirm).toHaveBeenCalledBefore(onClose);
	});

	it('should not call onClose if onConfirm throws an error', async () => {
		const error = new Error('Test error');
		const onConfirm = vi.fn().mockRejectedValue(error);
		const onClose = vi.fn();

		const handler = createConfirmHandler(onConfirm, onClose);

		await expect(handler()).rejects.toThrow('Test error');
		expect(onConfirm).toHaveBeenCalledOnce();
		expect(onClose).not.toHaveBeenCalled();
	});

	it('should handle onConfirm that returns a promise', async () => {
		const onConfirm = vi.fn().mockResolvedValue(undefined);
		const onClose = vi.fn();

		const handler = createConfirmHandler(onConfirm, onClose);
		await handler();

		expect(onConfirm).toHaveBeenCalledOnce();
		expect(onClose).toHaveBeenCalledOnce();
	});

	it('should handle onConfirm that returns void', async () => {
		const onConfirm = vi.fn().mockReturnValue(undefined);
		const onClose = vi.fn();

		const handler = createConfirmHandler(onConfirm, onClose);
		await handler();

		expect(onConfirm).toHaveBeenCalledOnce();
		expect(onClose).toHaveBeenCalledOnce();
	});
});

describe('createCancelHandler', () => {
	it('should call onCancel and then onClose when onCancel is provided', () => {
		const onCancel = vi.fn();
		const onClose = vi.fn();

		const handler = createCancelHandler(onCancel, onClose);
		handler();

		expect(onCancel).toHaveBeenCalledOnce();
		expect(onClose).toHaveBeenCalledOnce();
		expect(onCancel).toHaveBeenCalledBefore(onClose);
	});

	it('should only call onClose when onCancel is undefined', () => {
		const onClose = vi.fn();

		const handler = createCancelHandler(undefined, onClose);
		handler();

		expect(onClose).toHaveBeenCalledOnce();
	});

	it('should not call onClose if onCancel throws an error', () => {
		const error = new Error('Test error');
		const onCancel = vi.fn().mockImplementation(() => {
			throw error;
		});
		const onClose = vi.fn();

		const handler = createCancelHandler(onCancel, onClose);

		expect(() => handler()).toThrow('Test error');
		expect(onCancel).toHaveBeenCalledOnce();
		expect(onClose).not.toHaveBeenCalled();
	});

	it('should return a function that can be called multiple times', () => {
		const onCancel = vi.fn();
		const onClose = vi.fn();

		const handler = createCancelHandler(onCancel, onClose);
		handler();
		handler();

		expect(onCancel).toHaveBeenCalledTimes(2);
		expect(onClose).toHaveBeenCalledTimes(2);
	});
});
