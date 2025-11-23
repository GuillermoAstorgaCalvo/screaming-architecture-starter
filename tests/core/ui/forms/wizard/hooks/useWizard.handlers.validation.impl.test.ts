/**
 * useWizard.handlers.validation.impl Tests
 *
 * Tests for validation handler implementations:
 * - Validation handler hook
 * - Step skipping handler hook
 */

import {
	useStepSkippingHandler,
	useValidationHandler,
} from '@core/ui/forms/wizard/hooks/useWizard.handlers.validation.impl';
import type { UseWizardStateReturn } from '@core/ui/forms/wizard/types/useWizard.state.types';
import type { WizardStepConfig } from '@src-types/ui/navigation/wizard';
import { act, renderHook } from '@testing-library/react';
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

describe('useValidationHandler', () => {
	it('returns true when step is undefined', async () => {
		const { result } = renderHook(() =>
			useValidationHandler({
				currentStep: undefined,
				currentStepIndex: 0,
				formData: {},
				state: createMockState(),
			})
		);

		const isValid = await result.current();
		expect(isValid).toBe(false);
	});

	it('returns true when step is optional', async () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
			optional: true,
		};

		const { result } = renderHook(() =>
			useValidationHandler({
				currentStep: step,
				currentStepIndex: 0,
				formData: {},
				state: createMockState(),
			})
		);

		const isValid = await result.current();
		expect(isValid).toBe(true);
	});

	it('returns true when step is skippable', async () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
			skippable: true,
		};

		const { result } = renderHook(() =>
			useValidationHandler({
				currentStep: step,
				currentStepIndex: 0,
				formData: {},
				state: createMockState(),
			})
		);

		const isValid = await result.current();
		expect(isValid).toBe(true);
	});

	it('returns true when no validator provided', async () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
		};

		const { result } = renderHook(() =>
			useValidationHandler({
				currentStep: step,
				currentStepIndex: 0,
				formData: {},
				state: createMockState(),
			})
		);

		const isValid = await result.current();
		expect(isValid).toBe(true);
	});

	it('validates step when validator provided', async () => {
		const validate = vi.fn().mockResolvedValue(true);
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
			validate,
		};

		const state = createMockState();
		const { result } = renderHook(() =>
			useValidationHandler({
				currentStep: step,
				currentStepIndex: 0,
				formData: { field: 'value' },
				state,
			})
		);

		const isValid = await result.current();

		expect(validate).toHaveBeenCalledWith({ field: 'value' });
		expect(isValid).toBe(true);
		expect(state.setStepValidation).toHaveBeenCalledWith(0, {
			isValidated: true,
			isValid: true,
		});
	});

	it('handles validation failure', async () => {
		const validate = vi.fn().mockResolvedValue(false);
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
			validate,
		};

		const state = createMockState();
		const { result } = renderHook(() =>
			useValidationHandler({
				currentStep: step,
				currentStepIndex: 0,
				formData: {},
				state,
			})
		);

		const isValid = await result.current();

		expect(isValid).toBe(false);
		expect(state.setStepValidation).toHaveBeenCalledWith(0, {
			isValidated: true,
			isValid: false,
			error: expect.any(String),
		});
	});
});

describe('useStepSkippingHandler', () => {
	it('marks remaining optional steps as skipped', () => {
		const steps: WizardStepConfig[] = [
			{ id: 'step1', label: 'Step 1', content: null },
			{ id: 'step2', label: 'Step 2', content: null, optional: true },
			{ id: 'step3', label: 'Step 3', content: null, skippable: true },
			{ id: 'step4', label: 'Step 4', content: null },
		];

		const state = createMockState();
		const { result } = renderHook(() =>
			useStepSkippingHandler({
				currentStepIndex: 0,
				totalSteps: 4,
				steps,
				state,
			})
		);

		act(() => {
			result.current();
		});

		expect(state.markStepSkipped).toHaveBeenCalledWith(1);
		expect(state.markStepSkipped).toHaveBeenCalledWith(2);
		expect(state.markStepSkipped).not.toHaveBeenCalledWith(3);
	});

	it('handles no remaining optional steps', () => {
		const steps: WizardStepConfig[] = [
			{ id: 'step1', label: 'Step 1', content: null },
			{ id: 'step2', label: 'Step 2', content: null },
		];

		const state = createMockState();
		const { result } = renderHook(() =>
			useStepSkippingHandler({
				currentStepIndex: 0,
				totalSteps: 2,
				steps,
				state,
			})
		);

		act(() => {
			result.current();
		});

		expect(state.markStepSkipped).not.toHaveBeenCalled();
	});

	it('handles last step', () => {
		const steps: WizardStepConfig[] = [
			{ id: 'step1', label: 'Step 1', content: null },
			{ id: 'step2', label: 'Step 2', content: null, optional: true },
		];

		const state = createMockState();
		const { result } = renderHook(() =>
			useStepSkippingHandler({
				currentStepIndex: 1,
				totalSteps: 2,
				steps,
				state,
			})
		);

		act(() => {
			result.current();
		});

		expect(state.markStepSkipped).not.toHaveBeenCalled();
	});
});
