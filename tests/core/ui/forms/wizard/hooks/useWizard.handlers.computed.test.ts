/**
 * useWizard.handlers.computed Tests
 *
 * Tests for computed handler values:
 * - Step position calculation
 * - Navigation capability calculation
 */

import { computeWizardHandlerValues } from '@core/ui/forms/wizard/hooks/useWizard.handlers.computed';
import type { UseWizardStateReturn } from '@core/ui/forms/wizard/types/useWizard.state.types';
import type { WizardStepConfig } from '@src-types/ui/navigation/wizard';
import { describe, expect, it, vi } from 'vitest';

const createMockState = (currentStep: number): UseWizardStateReturn => ({
	state: {
		currentStep,
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

describe('computeWizardHandlerValues', () => {
	const steps: WizardStepConfig[] = [
		{ id: 'step1', label: 'Step 1', content: null },
		{ id: 'step2', label: 'Step 2', content: null },
		{ id: 'step3', label: 'Step 3', content: null },
	];

	it('computes values for first step', () => {
		const state = createMockState(0);
		const result = computeWizardHandlerValues(state, steps, true);

		expect(result.currentStepIndex).toBe(0);
		expect(result.currentStep).toBe(steps[0]);
		expect(result.totalSteps).toBe(3);
		expect(result.isFirstStep).toBe(true);
		expect(result.isLastStep).toBe(false);
		expect(result.canGoPrevious).toBe(false);
		expect(result.canGoNext).toBe(true);
	});

	it('computes values for middle step', () => {
		const state = createMockState(1);
		const result = computeWizardHandlerValues(state, steps, true);

		expect(result.currentStepIndex).toBe(1);
		expect(result.currentStep).toBe(steps[1]);
		expect(result.isFirstStep).toBe(false);
		expect(result.isLastStep).toBe(false);
		expect(result.canGoPrevious).toBe(true);
		expect(result.canGoNext).toBe(true);
	});

	it('computes values for last step', () => {
		const state = createMockState(2);
		const result = computeWizardHandlerValues(state, steps, true);

		expect(result.currentStepIndex).toBe(2);
		expect(result.currentStep).toBe(steps[2]);
		expect(result.isFirstStep).toBe(false);
		expect(result.isLastStep).toBe(true);
		expect(result.canGoPrevious).toBe(true);
		expect(result.canGoNext).toBe(false);
	});

	it('prevents back navigation when allowBackNavigation is false', () => {
		const state = createMockState(1);
		const result = computeWizardHandlerValues(state, steps, false);

		expect(result.canGoPrevious).toBe(false);
		expect(result.canGoNext).toBe(true);
	});

	it('allows back navigation when allowBackNavigation is true', () => {
		const state = createMockState(1);
		const result = computeWizardHandlerValues(state, steps, true);

		expect(result.canGoPrevious).toBe(true);
	});

	it('handles single step', () => {
		const singleStep: WizardStepConfig[] = [{ id: 'step1', label: 'Step 1', content: null }];
		const state = createMockState(0);
		const result = computeWizardHandlerValues(state, singleStep, true);

		expect(result.isFirstStep).toBe(true);
		expect(result.isLastStep).toBe(true);
		expect(result.canGoPrevious).toBe(false);
		expect(result.canGoNext).toBe(false);
	});

	it('handles empty steps array', () => {
		const state = createMockState(0);
		const result = computeWizardHandlerValues(state, [], true);

		expect(result.totalSteps).toBe(0);
		expect(result.currentStep).toBeUndefined();
	});

	it('handles out of bounds step index', () => {
		const state = createMockState(5);
		const result = computeWizardHandlerValues(state, steps, true);

		expect(result.currentStep).toBeUndefined();
		expect(result.totalSteps).toBe(3);
	});
});
