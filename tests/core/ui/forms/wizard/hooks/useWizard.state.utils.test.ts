/**
 * useWizard.state.utils Tests
 *
 * Tests for wizard state utility hooks:
 * - Reset handler
 * - Progress calculation
 * - State memoization
 */

import {
	useResetHandler,
	useWizardProgress,
	useWizardStateMemo,
} from '@core/ui/forms/wizard/hooks/useWizard.state.utils';
import type { StepValidationState } from '@core/ui/forms/wizard/types/useWizard.state.types';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useResetHandler', () => {
	it('resets state to initial step', () => {
		const setCurrentStep = vi.fn();
		const setCompletedSteps = vi.fn();
		const setSkippedSteps = vi.fn();
		const setValidationState = vi.fn();
		const setIsProcessing = vi.fn();

		const { result } = renderHook(() =>
			useResetHandler({
				initialStep: 0,
				controlledStep: undefined,
				setCurrentStep,
				setCompletedSteps,
				setSkippedSteps,
				setValidationState,
				setIsProcessing,
			})
		);

		act(() => {
			result.current();
		});

		expect(setCurrentStep).toHaveBeenCalledWith(0);
		expect(setCompletedSteps).toHaveBeenCalledWith(new Set());
		expect(setSkippedSteps).toHaveBeenCalledWith(new Set());
		expect(setValidationState).toHaveBeenCalledWith(new Map());
		expect(setIsProcessing).toHaveBeenCalledWith(false);
	});

	it('does not reset step when controlled', () => {
		const setCurrentStep = vi.fn();
		const setCompletedSteps = vi.fn();
		const setSkippedSteps = vi.fn();
		const setValidationState = vi.fn();
		const setIsProcessing = vi.fn();

		const { result } = renderHook(() =>
			useResetHandler({
				initialStep: 0,
				controlledStep: 2,
				setCurrentStep,
				setCompletedSteps,
				setSkippedSteps,
				setValidationState,
				setIsProcessing,
			})
		);

		act(() => {
			result.current();
		});

		expect(setCurrentStep).not.toHaveBeenCalled();
		expect(setCompletedSteps).toHaveBeenCalledWith(new Set());
		expect(setSkippedSteps).toHaveBeenCalledWith(new Set());
		expect(setValidationState).toHaveBeenCalledWith(new Map());
		expect(setIsProcessing).toHaveBeenCalledWith(false);
	});
});

describe('useWizardProgress', () => {
	it('calculates progress based on completed steps', () => {
		const completedSteps = new Set([0, 1]);
		const skippedSteps = new Set<number>();

		const { result } = renderHook(() => useWizardProgress(3, completedSteps, skippedSteps));

		expect(result.current).toBe(67);
	});

	it('includes skipped steps in progress', () => {
		const completedSteps = new Set([0]);
		const skippedSteps = new Set([1]);

		const { result } = renderHook(() => useWizardProgress(3, completedSteps, skippedSteps));

		expect(result.current).toBe(67);
	});

	it('calculates 100% when all steps completed', () => {
		const completedSteps = new Set([0, 1, 2]);
		const skippedSteps = new Set<number>();

		const { result } = renderHook(() => useWizardProgress(3, completedSteps, skippedSteps));

		expect(result.current).toBe(100);
	});

	it('calculates 0% when no steps completed', () => {
		const completedSteps = new Set<number>();
		const skippedSteps = new Set<number>();

		const { result } = renderHook(() => useWizardProgress(3, completedSteps, skippedSteps));

		expect(result.current).toBe(0);
	});

	it('updates when steps change', () => {
		const { result, rerender } = renderHook(
			({ completedSteps, skippedSteps }) => useWizardProgress(3, completedSteps, skippedSteps),
			{
				initialProps: {
					completedSteps: new Set<number>(),
					skippedSteps: new Set<number>(),
				},
			}
		);

		expect(result.current).toBe(0);

		rerender({
			completedSteps: new Set([0]),
			skippedSteps: new Set<number>(),
		});

		expect(result.current).toBe(33);
	});
});

describe('useWizardStateMemo', () => {
	it('memoizes wizard state object', () => {
		const params = {
			activeStep: 0,
			completedSteps: new Set([0]),
			skippedSteps: new Set<number>(),
			validationState: new Map<number, StepValidationState>(),
			isProcessing: false,
		};

		const { result } = renderHook(() => useWizardStateMemo(params));

		expect(result.current.currentStep).toBe(0);
		expect(result.current.completedSteps).toBe(params.completedSteps);
		expect(result.current.skippedSteps).toBe(params.skippedSteps);
		expect(result.current.validationState).toBe(params.validationState);
		expect(result.current.isProcessing).toBe(false);
	});

	it('updates when params change', () => {
		const { result, rerender } = renderHook(({ params }) => useWizardStateMemo(params), {
			initialProps: {
				params: {
					activeStep: 0,
					completedSteps: new Set<number>(),
					skippedSteps: new Set<number>(),
					validationState: new Map<number, StepValidationState>(),
					isProcessing: false,
				},
			},
		});

		const firstResult = result.current;

		rerender({
			params: {
				activeStep: 1,
				completedSteps: new Set([0]),
				skippedSteps: new Set<number>(),
				validationState: new Map<number, StepValidationState>(),
				isProcessing: false,
			},
		});

		expect(result.current).not.toBe(firstResult);
		expect(result.current.currentStep).toBe(1);
		expect(result.current.completedSteps.has(0)).toBe(true);
	});

	it('preserves reference when params do not change', () => {
		const params = {
			activeStep: 0,
			completedSteps: new Set<number>(),
			skippedSteps: new Set<number>(),
			validationState: new Map<number, StepValidationState>(),
			isProcessing: false,
		};

		const { result, rerender } = renderHook(() => useWizardStateMemo(params));

		const firstResult = result.current;
		rerender();
		expect(result.current).toBe(firstResult);
	});
});
