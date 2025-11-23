/**
 * useWizard.state Tests
 *
 * Tests for main wizard state hook:
 * - State initialization
 * - State management
 * - Progress calculation
 * - Step tracking
 */

import { useWizardState } from '@core/ui/forms/wizard/hooks/useWizard.state';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useWizardState', () => {
	it('initializes with initial step', () => {
		const { result } = renderHook(() =>
			useWizardState({
				initialStep: 0,
				totalSteps: 3,
			})
		);

		expect(result.current.state.currentStep).toBe(0);
		expect(result.current.progress).toBe(0);
	});

	it('initializes with custom initial step', () => {
		const { result } = renderHook(() =>
			useWizardState({
				initialStep: 2,
				totalSteps: 3,
			})
		);

		expect(result.current.state.currentStep).toBe(2);
	});

	it('uses controlled step when provided', () => {
		const { result, rerender } = renderHook(
			({ controlledStep }) =>
				useWizardState({
					initialStep: 0,
					totalSteps: 3,
					controlledStep,
				}),
			{ initialProps: { controlledStep: 1 } }
		);

		expect(result.current.state.currentStep).toBe(1);

		rerender({ controlledStep: 2 });
		expect(result.current.state.currentStep).toBe(2);
	});

	it('allows setting current step when uncontrolled', () => {
		const { result } = renderHook(() =>
			useWizardState({
				initialStep: 0,
				totalSteps: 3,
			})
		);

		act(() => {
			result.current.setCurrentStep(2);
		});

		expect(result.current.state.currentStep).toBe(2);
	});

	it('marks step as completed', () => {
		const { result } = renderHook(() =>
			useWizardState({
				initialStep: 0,
				totalSteps: 3,
			})
		);

		act(() => {
			result.current.markStepCompleted(0);
		});

		expect(result.current.isStepCompleted(0)).toBe(true);
		expect(result.current.progress).toBeGreaterThan(0);
	});

	it('marks step as skipped', () => {
		const { result } = renderHook(() =>
			useWizardState({
				initialStep: 0,
				totalSteps: 3,
			})
		);

		act(() => {
			result.current.markStepSkipped(1);
		});

		expect(result.current.isStepSkipped(1)).toBe(true);
		expect(result.current.progress).toBeGreaterThan(0);
	});

	it('calculates progress correctly', () => {
		const { result } = renderHook(() =>
			useWizardState({
				initialStep: 0,
				totalSteps: 3,
			})
		);

		act(() => {
			result.current.markStepCompleted(0);
			result.current.markStepCompleted(1);
		});

		expect(result.current.progress).toBe(67);
	});

	it('sets step validation', () => {
		const { result } = renderHook(() =>
			useWizardState({
				initialStep: 0,
				totalSteps: 3,
			})
		);

		act(() => {
			result.current.setStepValidation(0, {
				isValidated: true,
				isValid: true,
			});
		});

		expect(result.current.isStepValid(0)).toBe(true);
	});

	it('sets processing state', () => {
		const { result } = renderHook(() =>
			useWizardState({
				initialStep: 0,
				totalSteps: 3,
			})
		);

		act(() => {
			result.current.setIsProcessing(true);
		});

		expect(result.current.state.isProcessing).toBe(true);

		act(() => {
			result.current.setIsProcessing(false);
		});

		expect(result.current.state.isProcessing).toBe(false);
	});

	it('resets state', () => {
		const { result } = renderHook(() =>
			useWizardState({
				initialStep: 0,
				totalSteps: 3,
			})
		);

		act(() => {
			result.current.setCurrentStep(2);
			result.current.markStepCompleted(0);
			result.current.markStepSkipped(1);
			result.current.setStepValidation(0, { isValidated: true, isValid: true });
			result.current.setIsProcessing(true);
		});

		act(() => {
			result.current.reset();
		});

		expect(result.current.state.currentStep).toBe(0);
		expect(result.current.state.completedSteps.size).toBe(0);
		expect(result.current.state.skippedSteps.size).toBe(0);
		expect(result.current.state.validationState.size).toBe(0);
		expect(result.current.state.isProcessing).toBe(false);
	});
});
