/**
 * FormWizard.callbacks Tests
 *
 * Tests for the buildCallbacks helper function including:
 * - Building callbacks with all callbacks defined
 * - Building callbacks with partial callbacks
 * - Building callbacks with no callbacks
 * - Handling undefined callbacks
 */

import { buildCallbacks } from '@core/ui/forms/form-wizard/helpers/FormWizard.callbacks';
import { describe, expect, it, vi } from 'vitest';

interface TestFormData {
	name: string;
	email: string;
}

describe('buildCallbacks', () => {
	it('builds callbacks object with all callbacks defined', () => {
		const onStepChange = vi.fn();
		const onComplete = vi.fn();
		const onCancel = vi.fn();

		const result = buildCallbacks<TestFormData>({
			onStepChange,
			onComplete,
			onCancel,
		});

		expect(result).toEqual({
			onStepChange,
			onComplete,
			onCancel,
		});
	});

	it('builds callbacks object with only onStepChange', () => {
		const onStepChange = vi.fn();

		const result = buildCallbacks<TestFormData>({
			onStepChange,
		});

		expect(result).toEqual({
			onStepChange,
		});
		expect(result.onComplete).toBeUndefined();
		expect(result.onCancel).toBeUndefined();
	});

	it('builds callbacks object with only onComplete', () => {
		const onComplete = vi.fn();

		const result = buildCallbacks<TestFormData>({
			onComplete,
		});

		expect(result).toEqual({
			onComplete,
		});
		expect(result.onStepChange).toBeUndefined();
		expect(result.onCancel).toBeUndefined();
	});

	it('builds callbacks object with only onCancel', () => {
		const onCancel = vi.fn();

		const result = buildCallbacks<TestFormData>({
			onCancel,
		});

		expect(result).toEqual({
			onCancel,
		});
		expect(result.onStepChange).toBeUndefined();
		expect(result.onComplete).toBeUndefined();
	});

	it('builds empty callbacks object when no callbacks provided', () => {
		const result = buildCallbacks<TestFormData>({});

		expect(result).toEqual({});
		expect(result.onStepChange).toBeUndefined();
		expect(result.onComplete).toBeUndefined();
		expect(result.onCancel).toBeUndefined();
	});

	it('excludes undefined callbacks from result', () => {
		const onStepChange = vi.fn();

		const result = buildCallbacks<TestFormData>({
			onStepChange,
		});

		expect(result).toEqual({
			onStepChange,
		});
		expect(result.onComplete).toBeUndefined();
		expect(result.onCancel).toBeUndefined();
	});

	it('handles onStepChange callback', () => {
		const onStepChange = vi.fn();
		const result = buildCallbacks<TestFormData>({ onStepChange });

		expect(result.onStepChange).toBe(onStepChange);
		result.onStepChange?.(2);
		expect(onStepChange).toHaveBeenCalledWith(2);
		expect(onStepChange).toHaveBeenCalledTimes(1);
	});

	it('handles onComplete callback with data', async () => {
		const onComplete = vi.fn().mockResolvedValue(undefined);
		const result = buildCallbacks<TestFormData>({ onComplete });

		const testData: TestFormData = { name: 'John', email: 'john@example.com' };
		await result.onComplete?.(testData);

		expect(onComplete).toHaveBeenCalledWith(testData);
		expect(onComplete).toHaveBeenCalledTimes(1);
	});

	it('handles onCancel callback', () => {
		const onCancel = vi.fn();
		const result = buildCallbacks<TestFormData>({ onCancel });

		expect(result.onCancel).toBe(onCancel);
		result.onCancel?.();
		expect(onCancel).toHaveBeenCalledTimes(1);
	});

	it('handles async onComplete callback', async () => {
		const onComplete = vi.fn().mockImplementation(async () => {
			await new Promise(resolve => setTimeout(resolve, 10));
		});
		const result = buildCallbacks<TestFormData>({ onComplete });

		const testData: TestFormData = { name: 'Jane', email: 'jane@example.com' };
		await result.onComplete?.(testData);

		expect(onComplete).toHaveBeenCalledWith(testData);
		expect(onComplete).toHaveBeenCalledTimes(1);
	});

	it('builds callbacks with onStepChange and onComplete', () => {
		const onStepChange = vi.fn();
		const onComplete = vi.fn();

		const result = buildCallbacks<TestFormData>({
			onStepChange,
			onComplete,
		});

		expect(result.onStepChange).toBe(onStepChange);
		expect(result.onComplete).toBe(onComplete);
		expect(result.onCancel).toBeUndefined();
	});

	it('builds callbacks with onStepChange and onCancel', () => {
		const onStepChange = vi.fn();
		const onCancel = vi.fn();

		const result = buildCallbacks<TestFormData>({
			onStepChange,
			onCancel,
		});

		expect(result.onStepChange).toBe(onStepChange);
		expect(result.onCancel).toBe(onCancel);
		expect(result.onComplete).toBeUndefined();
	});

	it('builds callbacks with onComplete and onCancel', () => {
		const onComplete = vi.fn();
		const onCancel = vi.fn();

		const result = buildCallbacks<TestFormData>({
			onComplete,
			onCancel,
		});

		expect(result.onComplete).toBe(onComplete);
		expect(result.onCancel).toBe(onCancel);
		expect(result.onStepChange).toBeUndefined();
	});
});
