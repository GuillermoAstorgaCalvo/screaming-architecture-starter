/**
 * useWizard.handlers.actions.impl Tests
 *
 * Tests for action handler implementations:
 * - Completion handler
 * - Cancel handler
 */

import {
	useCancelHandler,
	useCompletionHandler,
} from '@core/ui/forms/wizard/hooks/useWizard.handlers.actions.impl';
import type { UseWizardStateReturn } from '@core/ui/forms/wizard/types/useWizard.state.types';
import type { WizardStepConfig } from '@src-types/ui/navigation/wizard';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const createMockState = (): UseWizardStateReturn => ({
	state: {
		currentStep: 0,
		completedSteps: new Set(),
		skippedSteps: new Set(),
		validationState: new Map(),
		isProcessing: false,
	},
	setCurrentStep: vi.fn(),
	markStepCompleted: vi.fn(),
	markStepSkipped: vi.fn(),
	setStepValidation: vi.fn(),
	setIsProcessing: vi.fn(),
	reset: vi.fn(),
	progress: 0,
	isStepCompleted: vi.fn(),
	isStepSkipped: vi.fn(),
	isStepValid: vi.fn(),
});

describe('useCompletionHandler', () => {
	it('completes wizard when step is valid', async () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
		};

		const validateCurrentStep = vi.fn().mockResolvedValue(true);
		const markRemainingStepsAsSkipped = vi.fn();
		const onComplete = vi.fn().mockResolvedValue(undefined);
		const state = createMockState();

		const { result } = renderHook(() =>
			useCompletionHandler({
				currentStep: step,
				currentStepIndex: 0,
				validateCurrentStep,
				markRemainingStepsAsSkipped,
				state,
				onComplete,
			})
		);

		await act(async () => {
			await result.current();
		});

		await waitFor(() => {
			expect(validateCurrentStep).toHaveBeenCalled();
			expect(markRemainingStepsAsSkipped).toHaveBeenCalled();
			expect(state.markStepCompleted).toHaveBeenCalledWith(0);
			expect(state.setIsProcessing).toHaveBeenCalledWith(true);
			expect(onComplete).toHaveBeenCalled();
		});
		expect(state.setIsProcessing).toHaveBeenCalledWith(false);
	});

	it('does not complete when validation fails', async () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
		};

		const validateCurrentStep = vi.fn().mockResolvedValue(false);
		const markRemainingStepsAsSkipped = vi.fn();
		const onComplete = vi.fn();
		const state = createMockState();

		const { result } = renderHook(() =>
			useCompletionHandler({
				currentStep: step,
				currentStepIndex: 0,
				validateCurrentStep,
				markRemainingStepsAsSkipped,
				state,
				onComplete,
			})
		);

		await act(async () => {
			await result.current();
		});

		expect(validateCurrentStep).toHaveBeenCalled();
		expect(markRemainingStepsAsSkipped).not.toHaveBeenCalled();
		expect(onComplete).not.toHaveBeenCalled();
	});

	it('skips validation when step should not be validated', async () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
			validateOnChange: false,
		};

		const validateCurrentStep = vi.fn();
		const markRemainingStepsAsSkipped = vi.fn();
		const onComplete = vi.fn().mockResolvedValue(undefined);
		const state = createMockState();

		const { result } = renderHook(() =>
			useCompletionHandler({
				currentStep: step,
				currentStepIndex: 0,
				validateCurrentStep,
				markRemainingStepsAsSkipped,
				state,
				onComplete,
			})
		);

		await act(async () => {
			await result.current();
		});

		expect(validateCurrentStep).not.toHaveBeenCalled();
		expect(onComplete).toHaveBeenCalled();
	});

	it('does not mark step as completed when optional', async () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
			optional: true,
		};

		const validateCurrentStep = vi.fn().mockResolvedValue(true);
		const markRemainingStepsAsSkipped = vi.fn();
		const onComplete = vi.fn().mockResolvedValue(undefined);
		const state = createMockState();

		const { result } = renderHook(() =>
			useCompletionHandler({
				currentStep: step,
				currentStepIndex: 0,
				validateCurrentStep,
				markRemainingStepsAsSkipped,
				state,
				onComplete,
			})
		);

		await act(async () => {
			await result.current();
		});

		expect(state.markStepCompleted).not.toHaveBeenCalled();
		expect(onComplete).toHaveBeenCalled();
	});

	it('handles async onComplete', async () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
		};

		const validateCurrentStep = vi.fn().mockResolvedValue(true);
		const markRemainingStepsAsSkipped = vi.fn();
		const onComplete = vi
			.fn()
			.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
		const state = createMockState();

		const { result } = renderHook(() =>
			useCompletionHandler({
				currentStep: step,
				currentStepIndex: 0,
				validateCurrentStep,
				markRemainingStepsAsSkipped,
				state,
				onComplete,
			})
		);

		await act(async () => {
			await result.current();
		});

		await waitFor(() => {
			expect(state.setIsProcessing).toHaveBeenCalledWith(false);
		});
	});
});

describe('useCancelHandler', () => {
	it('calls onCancel when provided', () => {
		const onCancel = vi.fn();

		const { result } = renderHook(() => useCancelHandler(onCancel));

		act(() => {
			result.current();
		});

		expect(onCancel).toHaveBeenCalled();
	});

	it('does not throw when onCancel is undefined', () => {
		const { result } = renderHook(() => useCancelHandler(undefined));

		expect(() => {
			act(() => {
				result.current();
			});
		}).not.toThrow();
	});
});
