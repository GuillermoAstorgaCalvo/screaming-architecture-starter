/**
 * useWizard.handlers.navigation.impl Tests
 *
 * Tests for navigation handler implementations:
 * - Next step handler
 * - Previous step handler
 * - Go to step handler
 * - Skip step handler
 */

import {
	useGoToStepHandler,
	useNextStepHandler,
	usePreviousStepHandler,
	useSkipStepHandler,
} from '@core/ui/forms/wizard/hooks/useWizard.handlers.navigation.impl';
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

describe('useNextStepHandler', () => {
	it('navigates to next step when valid', async () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
		};

		const validateCurrentStep = vi.fn().mockResolvedValue(true);
		const onStepChange = vi.fn();
		const state = createMockState();
		state.setCurrentStep = vi.fn();

		const { result } = renderHook(() =>
			useNextStepHandler({
				isLastStep: false,
				currentStep: step,
				currentStepIndex: 0,
				validateCurrentStep,
				state,
				onStepChange,
			})
		);

		await act(async () => {
			await result.current();
		});

		expect(validateCurrentStep).toHaveBeenCalled();
		expect(state.setCurrentStep).toHaveBeenCalledWith(1);
		expect(onStepChange).toHaveBeenCalledWith(1);
	});

	it('does not navigate when on last step', async () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
		};

		const validateCurrentStep = vi.fn();
		const state = createMockState();
		state.setCurrentStep = vi.fn();

		const { result } = renderHook(() =>
			useNextStepHandler({
				isLastStep: true,
				currentStep: step,
				currentStepIndex: 0,
				validateCurrentStep,
				state,
			})
		);

		await act(async () => {
			await result.current();
		});

		expect(validateCurrentStep).not.toHaveBeenCalled();
		expect(state.setCurrentStep).not.toHaveBeenCalled();
	});

	it('does not navigate when validation fails', async () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
		};

		const validateCurrentStep = vi.fn().mockResolvedValue(false);
		const state = createMockState();
		state.setCurrentStep = vi.fn();

		const { result } = renderHook(() =>
			useNextStepHandler({
				isLastStep: false,
				currentStep: step,
				currentStepIndex: 0,
				validateCurrentStep,
				state,
			})
		);

		await act(async () => {
			await result.current();
		});

		expect(state.setCurrentStep).not.toHaveBeenCalled();
	});
});

describe('usePreviousStepHandler', () => {
	it('navigates to previous step when allowed', () => {
		const onStepChange = vi.fn();
		const state = createMockState();
		state.setCurrentStep = vi.fn();

		const { result } = renderHook(() =>
			usePreviousStepHandler({
				canGoPrevious: true,
				currentStepIndex: 1,
				state,
				onStepChange,
			})
		);

		act(() => {
			result.current();
		});

		expect(state.setCurrentStep).toHaveBeenCalledWith(0);
		expect(onStepChange).toHaveBeenCalledWith(0);
	});

	it('does not navigate when not allowed', () => {
		const state = createMockState();
		state.setCurrentStep = vi.fn();

		const { result } = renderHook(() =>
			usePreviousStepHandler({
				canGoPrevious: false,
				currentStepIndex: 0,
				state,
			})
		);

		act(() => {
			result.current();
		});

		expect(state.setCurrentStep).not.toHaveBeenCalled();
	});
});

describe('useGoToStepHandler', () => {
	it('navigates to valid step', async () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
		};

		const validateCurrentStep = vi.fn().mockResolvedValue(true);
		const onStepChange = vi.fn();
		const state = createMockState();
		state.setCurrentStep = vi.fn();

		const { result } = renderHook(() =>
			useGoToStepHandler({
				currentStepIndex: 0,
				totalSteps: 3,
				currentStep: step,
				validateCurrentStep,
				allowBackNavigation: true,
				state,
				onStepChange,
			})
		);

		await act(async () => {
			await result.current(2);
		});

		expect(state.setCurrentStep).toHaveBeenCalledWith(2);
		expect(onStepChange).toHaveBeenCalledWith(2);
	});

	it('validates when going forward', async () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
		};

		const validateCurrentStep = vi.fn().mockResolvedValue(true);
		const state = createMockState();
		state.setCurrentStep = vi.fn();

		const { result } = renderHook(() =>
			useGoToStepHandler({
				currentStepIndex: 0,
				totalSteps: 3,
				currentStep: step,
				validateCurrentStep,
				allowBackNavigation: true,
				state,
			})
		);

		await act(async () => {
			await result.current(2);
		});

		expect(validateCurrentStep).toHaveBeenCalled();
	});

	it('does not validate when going backward', async () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
		};

		const validateCurrentStep = vi.fn();
		const state = createMockState();
		state.setCurrentStep = vi.fn();

		const { result } = renderHook(() =>
			useGoToStepHandler({
				currentStepIndex: 2,
				totalSteps: 3,
				currentStep: step,
				validateCurrentStep,
				allowBackNavigation: true,
				state,
			})
		);

		await act(async () => {
			await result.current(0);
		});

		expect(validateCurrentStep).not.toHaveBeenCalled();
		expect(state.setCurrentStep).toHaveBeenCalledWith(0);
	});

	it('prevents navigation when back navigation not allowed', async () => {
		const state = createMockState();
		state.setCurrentStep = vi.fn();

		const { result } = renderHook(() =>
			useGoToStepHandler({
				currentStepIndex: 2,
				totalSteps: 3,
				currentStep: undefined,
				validateCurrentStep: vi.fn(),
				allowBackNavigation: false,
				state,
			})
		);

		await act(async () => {
			await result.current(0);
		});

		expect(state.setCurrentStep).not.toHaveBeenCalled();
	});

	it('does not navigate to invalid step index', async () => {
		const state = createMockState();
		state.setCurrentStep = vi.fn();

		const { result } = renderHook(() =>
			useGoToStepHandler({
				currentStepIndex: 1,
				totalSteps: 3,
				currentStep: undefined,
				validateCurrentStep: vi.fn(),
				allowBackNavigation: true,
				state,
			})
		);

		await act(async () => {
			await result.current(-1);
		});

		await act(async () => {
			await result.current(3);
		});

		expect(state.setCurrentStep).not.toHaveBeenCalled();
	});
});

describe('useSkipStepHandler', () => {
	it('skips step and navigates to next', async () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
			skippable: true,
		};

		const onStepChange = vi.fn();
		const handleComplete = vi.fn().mockResolvedValue(undefined);
		const state = createMockState();
		state.markStepSkipped = vi.fn();
		state.setCurrentStep = vi.fn();

		const { result } = renderHook(() =>
			useSkipStepHandler({
				currentStep: step,
				currentStepIndex: 0,
				isLastStep: false,
				state,
				onStepChange,
				handleComplete,
			})
		);

		await act(async () => {
			await result.current();
		});

		expect(state.markStepSkipped).toHaveBeenCalledWith(0);
		expect(state.setCurrentStep).toHaveBeenCalledWith(1);
		expect(onStepChange).toHaveBeenCalledWith(1);
		expect(handleComplete).not.toHaveBeenCalled();
	});

	it('completes wizard when skipping last step', async () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
			skippable: true,
		};

		const handleComplete = vi.fn().mockResolvedValue(undefined);
		const state = createMockState();
		state.markStepSkipped = vi.fn();

		const { result } = renderHook(() =>
			useSkipStepHandler({
				currentStep: step,
				currentStepIndex: 2,
				isLastStep: true,
				state,
				handleComplete,
			})
		);

		await act(async () => {
			await result.current();
		});

		expect(state.markStepSkipped).toHaveBeenCalledWith(2);
		expect(handleComplete).toHaveBeenCalled();
	});

	it('does not skip when step is not skippable', async () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
			skippable: false,
		};

		const state = createMockState();
		state.markStepSkipped = vi.fn();

		const { result } = renderHook(() =>
			useSkipStepHandler({
				currentStep: step,
				currentStepIndex: 0,
				isLastStep: false,
				state,
				handleComplete: vi.fn(),
			})
		);

		await act(async () => {
			await result.current();
		});

		expect(state.markStepSkipped).not.toHaveBeenCalled();
	});

	it('does not skip when step is undefined', async () => {
		const state = createMockState();
		state.markStepSkipped = vi.fn();

		const { result } = renderHook(() =>
			useSkipStepHandler({
				currentStep: undefined,
				currentStepIndex: 0,
				isLastStep: false,
				state,
				handleComplete: vi.fn(),
			})
		);

		await act(async () => {
			await result.current();
		});

		expect(state.markStepSkipped).not.toHaveBeenCalled();
	});
});
