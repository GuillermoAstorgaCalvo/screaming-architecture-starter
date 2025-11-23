/**
 * useWizard Tests
 *
 * Tests for main wizard hook:
 * - Hook initialization
 * - State management
 * - Handler integration
 * - Step status
 */

import { useWizard } from '@core/ui/forms/wizard/hooks/useWizard';
import type { WizardProps } from '@src-types/ui/navigation/wizard';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const createTestSteps = (): WizardProps['steps'] => [
	{
		id: 'step1',
		label: 'Step 1',
		content: null,
	},
	{
		id: 'step2',
		label: 'Step 2',
		content: null,
	},
	{
		id: 'step3',
		label: 'Step 3',
		content: null,
	},
];

describe('useWizard', () => {
	it('initializes with first step', () => {
		const steps = createTestSteps();
		const props: WizardProps = { steps };

		const { result } = renderHook(() => useWizard(props));

		expect(result.current.state.currentStep).toBe(0);
		expect(result.current.currentStep).toBe(steps[0]);
		expect(result.current.totalSteps).toBe(3);
	});

	it('initializes with custom initial step', () => {
		const steps = createTestSteps();
		const props: WizardProps = { steps, initialStep: 1 };

		const { result } = renderHook(() => useWizard(props));

		expect(result.current.state.currentStep).toBe(1);
		expect(result.current.currentStep).toBe(steps[1]);
	});

	it('uses controlled step when provided', () => {
		const steps = createTestSteps();
		const { result, rerender } = renderHook(({ activeStep }) => useWizard({ steps, activeStep }), {
			initialProps: { activeStep: 0 },
		});

		expect(result.current.state.currentStep).toBe(0);

		rerender({ activeStep: 2 });
		expect(result.current.state.currentStep).toBe(2);
	});

	it('provides all handlers', () => {
		const steps = createTestSteps();
		const props: WizardProps = { steps };

		const { result } = renderHook(() => useWizard(props));

		expect(result.current).toHaveProperty('handleNext');
		expect(result.current).toHaveProperty('handlePrevious');
		expect(result.current).toHaveProperty('goToStep');
		expect(result.current).toHaveProperty('skipStep');
		expect(result.current).toHaveProperty('handleComplete');
		expect(result.current).toHaveProperty('handleCancel');
		expect(result.current).toHaveProperty('validateCurrentStep');
	});

	it('provides step status function', () => {
		const steps = createTestSteps();
		const props: WizardProps = { steps };

		const { result } = renderHook(() => useWizard(props));

		expect(typeof result.current.getStepStatus).toBe('function');
		expect(result.current.getStepStatus(0)).toBe('active');
		expect(result.current.getStepStatus(1)).toBe('pending');
	});

	it('calculates progress correctly', () => {
		const steps = createTestSteps();
		const props: WizardProps = { steps };

		const { result } = renderHook(() => useWizard(props));

		act(() => {
			result.current.markStepCompleted(0);
		});

		expect(result.current.progress).toBeGreaterThan(0);
	});

	it('handles step navigation', async () => {
		const steps = createTestSteps();
		const props: WizardProps = { steps };

		const { result } = renderHook(() => useWizard(props));

		await act(async () => {
			await result.current.handleNext();
		});

		expect(result.current.state.currentStep).toBe(1);
		expect(result.current.currentStep).toBe(steps[1]);
	});

	it('calls onStepChange when provided', async () => {
		const steps = createTestSteps();
		const onStepChange = vi.fn();
		const props: WizardProps = { steps, onStepChange };

		const { result } = renderHook(() => useWizard(props));

		await act(async () => {
			await result.current.handleNext();
		});

		await waitFor(() => {
			expect(onStepChange).toHaveBeenCalledWith(1);
		});
	});

	it('handles step status for completed steps', () => {
		const steps = createTestSteps();
		const props: WizardProps = { steps };

		const { result } = renderHook(() => useWizard(props));

		act(() => {
			result.current.markStepCompleted(0);
			result.current.setCurrentStep(1);
		});

		expect(result.current.getStepStatus(0)).toBe('completed');
		expect(result.current.getStepStatus(1)).toBe('active');
	});

	it('handles step status for skipped steps', () => {
		const steps = createTestSteps();
		const props: WizardProps = { steps };

		const { result } = renderHook(() => useWizard(props));

		act(() => {
			result.current.markStepSkipped(0);
			result.current.setCurrentStep(1);
		});

		expect(result.current.getStepStatus(0)).toBe('completed');
	});

	it('handles step status for invalid steps', () => {
		const steps = createTestSteps();
		const props: WizardProps = { steps };

		const { result } = renderHook(() => useWizard(props));

		act(() => {
			result.current.setStepValidation(0, {
				isValidated: true,
				isValid: false,
			});
		});

		expect(result.current.getStepStatus(0)).toBe('error');
	});

	it('handles formData for validation', () => {
		const steps = createTestSteps();
		const formData = { field: 'value' };
		const props: WizardProps = { steps, formData };

		const { result } = renderHook(() => useWizard(props));

		expect(result.current).toHaveProperty('validateCurrentStep');
	});
});
