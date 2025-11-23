/**
 * useWizard.state.step Tests
 *
 * Tests for step state management:
 * - Initial step
 * - Controlled step
 * - Step navigation
 */

import { useStepState } from '@core/ui/forms/wizard/hooks/useWizard.state.step';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useStepState', () => {
	it('initializes with initial step', () => {
		const { result } = renderHook(() => useStepState(0));
		expect(result.current.activeStep).toBe(0);
	});

	it('initializes with custom initial step', () => {
		const { result } = renderHook(() => useStepState(2));
		expect(result.current.activeStep).toBe(2);
	});

	it('allows setting step when uncontrolled', () => {
		const { result } = renderHook(() => useStepState(0));

		act(() => {
			result.current.setCurrentStep(1);
		});

		expect(result.current.activeStep).toBe(1);
	});

	it('uses controlled step when provided', () => {
		const { result, rerender } = renderHook(
			({ controlledStep }: { controlledStep?: number }) => useStepState(0, controlledStep),
			{ initialProps: {} }
		);

		expect(result.current.activeStep).toBe(0);

		rerender({ controlledStep: 2 });
		expect(result.current.activeStep).toBe(2);
	});

	it('ignores setCurrentStep when controlled', () => {
		const { result, rerender } = renderHook(
			({ controlledStep }) => useStepState(0, controlledStep),
			{ initialProps: { controlledStep: 1 } }
		);

		expect(result.current.activeStep).toBe(1);

		act(() => {
			result.current.setCurrentStep(2);
		});

		// Should still be 1 because it's controlled
		expect(result.current.activeStep).toBe(1);

		// Update controlled value
		rerender({ controlledStep: 3 });
		expect(result.current.activeStep).toBe(3);
	});

	it('handles step changes correctly', () => {
		const { result } = renderHook(() => useStepState(0));

		act(() => {
			result.current.setCurrentStep(5);
		});

		expect(result.current.activeStep).toBe(5);
	});
});
