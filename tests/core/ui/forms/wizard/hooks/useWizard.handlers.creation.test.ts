/**
 * useWizard.handlers.creation Tests
 *
 * Tests for handler creation logic:
 * - Handler group creation
 * - Handler combination
 */

import { useWizardHandlersCreation } from '@core/ui/forms/wizard/hooks/useWizard.handlers.creation';
import { useWizardState } from '@core/ui/forms/wizard/hooks/useWizard.state';
import type { WizardStepConfig } from '@src-types/ui/navigation/wizard';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useWizardHandlersCreation', () => {
	const createTestSteps = (): WizardStepConfig[] => [
		{ id: 'step1', label: 'Step 1', content: null },
		{ id: 'step2', label: 'Step 2', content: null },
	];

	it('creates all handlers with computed values', () => {
		const steps = createTestSteps();
		const { result: stateResult } = renderHook(() =>
			useWizardState({
				initialStep: 0,
				totalSteps: steps.length,
			})
		);

		const computed = {
			currentStepIndex: 0,
			currentStep: steps[0],
			totalSteps: 2,
			isLastStep: false,
			isFirstStep: true,
			canGoPrevious: false,
			canGoNext: true,
		};

		const { result } = renderHook(() =>
			useWizardHandlersCreation(
				{
					state: stateResult.current,
					steps,
					allowBackNavigation: true,
				},
				computed
			)
		);

		expect(result.current).toHaveProperty('handleNext');
		expect(result.current).toHaveProperty('handlePrevious');
		expect(result.current).toHaveProperty('goToStep');
		expect(result.current).toHaveProperty('skipStep');
		expect(result.current).toHaveProperty('handleComplete');
		expect(result.current).toHaveProperty('handleCancel');
		expect(result.current).toHaveProperty('validateCurrentStep');
		expect(result.current.canGoNext).toBe(true);
		expect(result.current.canGoPrevious).toBe(false);
		expect(result.current.isLastStep).toBe(false);
		expect(result.current.isFirstStep).toBe(true);
	});

	it('handles optional callbacks', () => {
		const steps = createTestSteps();
		const { result: stateResult } = renderHook(() =>
			useWizardState({
				initialStep: 0,
				totalSteps: steps.length,
			})
		);

		const computed = {
			currentStepIndex: 0,
			currentStep: steps[0],
			totalSteps: 2,
			isLastStep: false,
			isFirstStep: true,
			canGoPrevious: false,
			canGoNext: true,
		};

		const { result } = renderHook(() =>
			useWizardHandlersCreation(
				{
					state: stateResult.current,
					steps,
					allowBackNavigation: true,
					onStepChange: vi.fn(),
					onComplete: vi.fn(),
					onCancel: vi.fn(),
				},
				computed
			)
		);

		expect(result.current).toHaveProperty('handleComplete');
		expect(result.current).toHaveProperty('handleCancel');
	});

	it('handles formData when provided', () => {
		const steps = createTestSteps();
		const { result: stateResult } = renderHook(() =>
			useWizardState({
				initialStep: 0,
				totalSteps: steps.length,
			})
		);

		const computed = {
			currentStepIndex: 0,
			currentStep: steps[0],
			totalSteps: 2,
			isLastStep: false,
			isFirstStep: true,
			canGoPrevious: false,
			canGoNext: true,
		};

		const { result } = renderHook(() =>
			useWizardHandlersCreation(
				{
					state: stateResult.current,
					steps,
					formData: { field: 'value' },
					allowBackNavigation: true,
				},
				computed
			)
		);

		expect(result.current).toHaveProperty('validateCurrentStep');
	});
});
