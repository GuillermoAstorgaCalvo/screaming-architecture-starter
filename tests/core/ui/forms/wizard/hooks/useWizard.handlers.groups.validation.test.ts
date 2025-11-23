/**
 * useWizard.handlers.groups.validation Tests
 *
 * Tests for validation handler group:
 * - Validation handlers creation
 */

import { useValidationHandlers } from '@core/ui/forms/wizard/hooks/useWizard.handlers.groups.validation';
import type { UseWizardStateReturn } from '@core/ui/forms/wizard/types/useWizard.state.types';
import type { WizardStepConfig } from '@src-types/ui/navigation/wizard';
import { renderHook } from '@testing-library/react';
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

describe('useValidationHandlers', () => {
	it('creates validation handlers', () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
		};

		const steps: WizardStepConfig[] = [step];

		const { result } = renderHook(() =>
			useValidationHandlers({
				currentStep: step,
				currentStepIndex: 0,
				formData: {},
				totalSteps: 1,
				steps,
				state: createMockState(),
			})
		);

		expect(result.current).toHaveProperty('validateCurrentStep');
		expect(result.current).toHaveProperty('markRemainingStepsAsSkipped');
		expect(typeof result.current.validateCurrentStep).toBe('function');
		expect(typeof result.current.markRemainingStepsAsSkipped).toBe('function');
	});

	it('handles undefined formData', () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
		};

		const steps: WizardStepConfig[] = [step];

		const { result } = renderHook(() =>
			useValidationHandlers({
				currentStep: step,
				currentStepIndex: 0,
				formData: undefined,
				totalSteps: 1,
				steps,
				state: createMockState(),
			})
		);

		expect(result.current).toHaveProperty('validateCurrentStep');
		expect(result.current).toHaveProperty('markRemainingStepsAsSkipped');
	});
});
