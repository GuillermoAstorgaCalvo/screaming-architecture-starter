/**
 * useWizard.handlers.groups.actions Tests
 *
 * Tests for action handler group:
 * - Action handlers creation
 */

import { useActionHandlers } from '@core/ui/forms/wizard/hooks/useWizard.handlers.groups.actions';
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

describe('useActionHandlers', () => {
	it('creates action handlers', () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
		};

		const { result } = renderHook(() =>
			useActionHandlers({
				currentStep: step,
				currentStepIndex: 0,
				validateCurrentStep: vi.fn(),
				markRemainingStepsAsSkipped: vi.fn(),
				state: createMockState(),
				onComplete: vi.fn(),
				onCancel: vi.fn(),
			})
		);

		expect(result.current).toHaveProperty('handleComplete');
		expect(result.current).toHaveProperty('handleCancel');
		expect(typeof result.current.handleComplete).toBe('function');
		expect(typeof result.current.handleCancel).toBe('function');
	});

	it('handles undefined callbacks', () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
		};

		const { result } = renderHook(() =>
			useActionHandlers({
				currentStep: step,
				currentStepIndex: 0,
				validateCurrentStep: vi.fn(),
				markRemainingStepsAsSkipped: vi.fn(),
				state: createMockState(),
				onComplete: undefined,
				onCancel: undefined,
			})
		);

		expect(result.current).toHaveProperty('handleComplete');
		expect(result.current).toHaveProperty('handleCancel');
	});
});
