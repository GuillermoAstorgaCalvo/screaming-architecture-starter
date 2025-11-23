/**
 * useWizard.handlers Tests
 *
 * Tests for main wizard handlers hook:
 * - Handler creation
 * - Handler integration
 */

import { useWizardHandlers } from '@core/ui/forms/wizard/hooks/useWizard.handlers';
import { useWizardState } from '@core/ui/forms/wizard/hooks/useWizard.state';
import type { WizardStepConfig } from '@src-types/ui/navigation/wizard';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useWizardHandlers', () => {
	const createTestSteps = (): WizardStepConfig[] => [
		{ id: 'step1', label: 'Step 1', content: null },
		{ id: 'step2', label: 'Step 2', content: null },
	];

	it('creates all handlers', () => {
		const steps = createTestSteps();
		const { result: stateResult } = renderHook(() =>
			useWizardState({
				initialStep: 0,
				totalSteps: steps.length,
			})
		);

		const { result } = renderHook(() =>
			useWizardHandlers({
				state: stateResult.current,
				steps,
				allowBackNavigation: true,
			})
		);

		expect(result.current).toHaveProperty('handleNext');
		expect(result.current).toHaveProperty('handlePrevious');
		expect(result.current).toHaveProperty('goToStep');
		expect(result.current).toHaveProperty('skipStep');
		expect(result.current).toHaveProperty('handleComplete');
		expect(result.current).toHaveProperty('handleCancel');
		expect(result.current).toHaveProperty('validateCurrentStep');
		expect(result.current).toHaveProperty('canGoNext');
		expect(result.current).toHaveProperty('canGoPrevious');
		expect(result.current).toHaveProperty('isLastStep');
		expect(result.current).toHaveProperty('isFirstStep');
	});

	it('computes navigation capabilities correctly', () => {
		const steps = createTestSteps();
		const { result: stateResult } = renderHook(() =>
			useWizardState({
				initialStep: 0,
				totalSteps: steps.length,
			})
		);

		const { result } = renderHook(() =>
			useWizardHandlers({
				state: stateResult.current,
				steps,
				allowBackNavigation: true,
			})
		);

		expect(result.current.isFirstStep).toBe(true);
		expect(result.current.isLastStep).toBe(false);
		expect(result.current.canGoNext).toBe(true);
		expect(result.current.canGoPrevious).toBe(false);
	});

	it('handles formData when provided', () => {
		const steps = createTestSteps();
		const { result: stateResult } = renderHook(() =>
			useWizardState({
				initialStep: 0,
				totalSteps: steps.length,
			})
		);

		const { result } = renderHook(() =>
			useWizardHandlers({
				state: stateResult.current,
				steps,
				formData: { field: 'value' },
				allowBackNavigation: true,
			})
		);

		expect(result.current).toHaveProperty('validateCurrentStep');
	});

	it('handles callbacks when provided', () => {
		const steps = createTestSteps();
		const { result: stateResult } = renderHook(() =>
			useWizardState({
				initialStep: 0,
				totalSteps: steps.length,
			})
		);

		const onStepChange = vi.fn();
		const onComplete = vi.fn();
		const onCancel = vi.fn();

		const { result } = renderHook(() =>
			useWizardHandlers({
				state: stateResult.current,
				steps,
				onStepChange,
				onComplete,
				onCancel,
				allowBackNavigation: true,
			})
		);

		expect(result.current).toHaveProperty('handleComplete');
		expect(result.current).toHaveProperty('handleCancel');
	});
});
