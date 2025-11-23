/**
 * useFormWizardHandlers Tests
 *
 * Tests for the useFormWizardHandlers hook including:
 * - handleNext: Navigating to next step
 * - handlePrevious: Navigating to previous step
 * - handleStepClick: Clicking on a step
 * - handleComplete: Completing the wizard
 * - handleCancel: Cancelling the wizard
 * - validateCurrentStep: Validating current step
 */

import type { FormControls } from '@core/forms/formAdapter';
import { useFormWizardHandlers } from '@core/ui/forms/form-wizard/hooks/useFormWizardHandlers';
import type {
	FormWizardProps,
	FormWizardState,
} from '@core/ui/forms/form-wizard/types/FormWizardTypes';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

interface TestFormData {
	name: string;
	email: string;
	age?: number;
}

// Mock the helper functions
const mockValidateStepFields = vi.fn();
const mockRunCustomValidation = vi.fn();

vi.mock('@core/ui/forms/form-wizard/helpers/useFormWizardHandlers.helpers', () => ({
	validateStepFields: async (
		formControls: unknown,
		step: unknown,
		context: { markStepError: (step: number) => void; stepIndex: number }
	) => {
		const result = await mockValidateStepFields(formControls, step, context);
		if (!result && context) {
			context.markStepError(context.stepIndex);
		}
		return result;
	},
	runCustomValidation: async (
		step: unknown,
		formData: unknown,
		context: { markStepError: (step: number) => void; stepIndex: number }
	) => {
		const result = await mockRunCustomValidation(step, formData, context);
		if (!result && context) {
			context.markStepError(context.stepIndex);
		}
		return result;
	},
}));

// Mock canNavigateToStep
const mockCanNavigateToStep = vi.fn();
vi.mock('@core/ui/forms/wizard/helpers/wizardUtils', () => ({
	canNavigateToStep: (stepIndex: number, activeStep: number, allowBack: boolean) =>
		mockCanNavigateToStep(stepIndex, activeStep, allowBack),
}));

describe('useFormWizardHandlers', () => {
	let mockFormControls: FormControls<TestFormData>;
	let mockState: FormWizardState<TestFormData>;
	let mockSteps: FormWizardProps<TestFormData>['steps'];
	let mockSetActiveStep: (step: number) => void;
	let mockMarkStepCompleted: (stepIndex: number) => void;
	let mockMarkStepError: (stepIndex: number) => void;
	let mockClearStepError: (stepIndex: number) => void;
	let mockUpdateFormData: (data: Partial<TestFormData>) => void;
	let mockSetIsSubmitting: (isSubmitting: boolean) => void;

	beforeEach(() => {
		vi.clearAllMocks();

		mockSetActiveStep = vi.fn();
		mockMarkStepCompleted = vi.fn();
		mockMarkStepError = vi.fn();
		mockClearStepError = vi.fn();
		mockUpdateFormData = vi.fn();
		mockSetIsSubmitting = vi.fn();

		mockFormControls = {
			trigger: vi.fn().mockResolvedValue(true),
			getValues: vi.fn().mockReturnValue({ name: 'John', email: 'john@example.com' }),
			isValid: true,
		} as unknown as FormControls<TestFormData>;

		mockState = {
			activeStep: 0,
			completedSteps: new Set(),
			errorSteps: new Set(),
			formData: {},
			isSubmitting: false,
		};

		mockSteps = [
			{
				id: 'step1',
				label: 'Step 1',
				content: () => null,
			},
			{
				id: 'step2',
				label: 'Step 2',
				content: () => null,
			},
			{
				id: 'step3',
				label: 'Step 3',
				content: () => null,
			},
		];

		mockValidateStepFields.mockResolvedValue(true);
		mockRunCustomValidation.mockResolvedValue(true);
		mockCanNavigateToStep.mockReturnValue(true);
	});

	describe('validateCurrentStep', () => {
		it('validates current step successfully', async () => {
			const { result } = renderHook(() =>
				useFormWizardHandlers<TestFormData>({
					state: mockState,
					steps: mockSteps,
					formControls: mockFormControls,
					setActiveStep: mockSetActiveStep,
					markStepCompleted: mockMarkStepCompleted,
					markStepError: mockMarkStepError,
					clearStepError: mockClearStepError,
					updateFormData: mockUpdateFormData,
					setIsSubmitting: mockSetIsSubmitting,
				})
			);

			const isValid = await result.current.validateCurrentStep();

			expect(isValid).toBe(true);
			expect(mockClearStepError).toHaveBeenCalledWith(0);
			expect(mockValidateStepFields).toHaveBeenCalled();
			expect(mockRunCustomValidation).toHaveBeenCalled();
			expect(mockMarkStepCompleted).toHaveBeenCalledWith(0);
		});

		it('returns false when step does not exist', async () => {
			const invalidState = {
				...mockState,
				activeStep: 10,
			};

			const { result } = renderHook(() =>
				useFormWizardHandlers<TestFormData>({
					state: invalidState,
					steps: mockSteps,
					formControls: mockFormControls,
					setActiveStep: mockSetActiveStep,
					markStepCompleted: mockMarkStepCompleted,
					markStepError: mockMarkStepError,
					clearStepError: mockClearStepError,
					updateFormData: mockUpdateFormData,
					setIsSubmitting: mockSetIsSubmitting,
				})
			);

			const isValid = await result.current.validateCurrentStep();

			expect(isValid).toBe(false);
		});

		it('marks step error when field validation fails', async () => {
			mockValidateStepFields.mockResolvedValue(false);

			const { result } = renderHook(() =>
				useFormWizardHandlers<TestFormData>({
					state: mockState,
					steps: mockSteps,
					formControls: mockFormControls,
					setActiveStep: mockSetActiveStep,
					markStepCompleted: mockMarkStepCompleted,
					markStepError: mockMarkStepError,
					clearStepError: mockClearStepError,
					updateFormData: mockUpdateFormData,
					setIsSubmitting: mockSetIsSubmitting,
				})
			);

			const isValid = await result.current.validateCurrentStep();

			expect(isValid).toBe(false);
			expect(mockMarkStepError).toHaveBeenCalledWith(0);
			expect(mockMarkStepCompleted).not.toHaveBeenCalled();
		});

		it('marks step error when custom validation fails', async () => {
			mockRunCustomValidation.mockResolvedValue(false);

			const { result } = renderHook(() =>
				useFormWizardHandlers<TestFormData>({
					state: mockState,
					steps: mockSteps,
					formControls: mockFormControls,
					setActiveStep: mockSetActiveStep,
					markStepCompleted: mockMarkStepCompleted,
					markStepError: mockMarkStepError,
					clearStepError: mockClearStepError,
					updateFormData: mockUpdateFormData,
					setIsSubmitting: mockSetIsSubmitting,
				})
			);

			const isValid = await result.current.validateCurrentStep();

			expect(isValid).toBe(false);
			expect(mockMarkStepError).toHaveBeenCalledWith(0);
			expect(mockMarkStepCompleted).not.toHaveBeenCalled();
		});

		it('marks step completed for optional steps even if form is invalid', async () => {
			const optionalStep = {
				...mockSteps[0],
				optional: true,
			} as FormWizardProps<TestFormData>['steps'][0];

			const stepsWithOptional = [optionalStep, ...mockSteps.slice(1)] as const;

			const formControlsInvalid = {
				...mockFormControls,
				isValid: false,
			} as FormControls<TestFormData>;

			const { result } = renderHook(() =>
				useFormWizardHandlers<TestFormData>({
					state: mockState,
					steps: stepsWithOptional,
					formControls: formControlsInvalid,
					setActiveStep: mockSetActiveStep,
					markStepCompleted: mockMarkStepCompleted,
					markStepError: mockMarkStepError,
					clearStepError: mockClearStepError,
					updateFormData: mockUpdateFormData,
					setIsSubmitting: mockSetIsSubmitting,
				})
			);

			const isValid = await result.current.validateCurrentStep();

			expect(isValid).toBe(true);
			expect(mockMarkStepCompleted).toHaveBeenCalledWith(0);
		});
	});

	describe('handleNext', () => {
		it('navigates to next step when validation passes', async () => {
			const onStepChange = vi.fn();

			const { result } = renderHook(() =>
				useFormWizardHandlers<TestFormData>({
					state: mockState,
					steps: mockSteps,
					formControls: mockFormControls,
					setActiveStep: mockSetActiveStep,
					markStepCompleted: mockMarkStepCompleted,
					markStepError: mockMarkStepError,
					clearStepError: mockClearStepError,
					updateFormData: mockUpdateFormData,
					setIsSubmitting: mockSetIsSubmitting,
					onStepChange,
					validateOnStepChange: true,
				})
			);

			await result.current.handleNext();

			expect(mockUpdateFormData).toHaveBeenCalled();
			expect(mockSetActiveStep).toHaveBeenCalledWith(1);
			expect(onStepChange).toHaveBeenCalledWith(1);
		});

		it('does not navigate when validation fails', async () => {
			mockValidateStepFields.mockResolvedValue(false);

			const { result } = renderHook(() =>
				useFormWizardHandlers<TestFormData>({
					state: mockState,
					steps: mockSteps,
					formControls: mockFormControls,
					setActiveStep: mockSetActiveStep,
					markStepCompleted: mockMarkStepCompleted,
					markStepError: mockMarkStepError,
					clearStepError: mockClearStepError,
					updateFormData: mockUpdateFormData,
					setIsSubmitting: mockSetIsSubmitting,
					validateOnStepChange: true,
				})
			);

			await result.current.handleNext();

			expect(mockSetActiveStep).not.toHaveBeenCalled();
		});

		it('does not navigate when on last step', async () => {
			const lastStepState = {
				...mockState,
				activeStep: 2,
			};

			const { result } = renderHook(() =>
				useFormWizardHandlers<TestFormData>({
					state: lastStepState,
					steps: mockSteps,
					formControls: mockFormControls,
					setActiveStep: mockSetActiveStep,
					markStepCompleted: mockMarkStepCompleted,
					markStepError: mockMarkStepError,
					clearStepError: mockClearStepError,
					updateFormData: mockUpdateFormData,
					setIsSubmitting: mockSetIsSubmitting,
				})
			);

			await result.current.handleNext();

			expect(mockSetActiveStep).not.toHaveBeenCalled();
		});

		it('marks step completed without validation when validateOnStepChange is false', async () => {
			const { result } = renderHook(() =>
				useFormWizardHandlers<TestFormData>({
					state: mockState,
					steps: mockSteps,
					formControls: mockFormControls,
					setActiveStep: mockSetActiveStep,
					markStepCompleted: mockMarkStepCompleted,
					markStepError: mockMarkStepError,
					clearStepError: mockClearStepError,
					updateFormData: mockUpdateFormData,
					setIsSubmitting: mockSetIsSubmitting,
					validateOnStepChange: false,
				})
			);

			await result.current.handleNext();

			expect(mockMarkStepCompleted).toHaveBeenCalledWith(0);
			expect(mockValidateStepFields).not.toHaveBeenCalled();
		});
	});

	describe('handlePrevious', () => {
		it('navigates to previous step', () => {
			const onStepChange = vi.fn();
			const stateAtStep2 = {
				...mockState,
				activeStep: 2,
			};

			const { result } = renderHook(() =>
				useFormWizardHandlers<TestFormData>({
					state: stateAtStep2,
					steps: mockSteps,
					formControls: mockFormControls,
					setActiveStep: mockSetActiveStep,
					markStepCompleted: mockMarkStepCompleted,
					markStepError: mockMarkStepError,
					clearStepError: mockClearStepError,
					updateFormData: mockUpdateFormData,
					setIsSubmitting: mockSetIsSubmitting,
					onStepChange,
					allowBackNavigation: true,
				})
			);

			result.current.handlePrevious();

			expect(mockUpdateFormData).toHaveBeenCalled();
			expect(mockSetActiveStep).toHaveBeenCalledWith(1);
			expect(onStepChange).toHaveBeenCalledWith(1);
		});

		it('does not navigate when on first step', () => {
			const { result } = renderHook(() =>
				useFormWizardHandlers<TestFormData>({
					state: mockState,
					steps: mockSteps,
					formControls: mockFormControls,
					setActiveStep: mockSetActiveStep,
					markStepCompleted: mockMarkStepCompleted,
					markStepError: mockMarkStepError,
					clearStepError: mockClearStepError,
					updateFormData: mockUpdateFormData,
					setIsSubmitting: mockSetIsSubmitting,
					allowBackNavigation: true,
				})
			);

			result.current.handlePrevious();

			expect(mockSetActiveStep).not.toHaveBeenCalled();
		});

		it('does not navigate when back navigation is disabled', () => {
			const stateAtStep2 = {
				...mockState,
				activeStep: 2,
			};

			const { result } = renderHook(() =>
				useFormWizardHandlers<TestFormData>({
					state: stateAtStep2,
					steps: mockSteps,
					formControls: mockFormControls,
					setActiveStep: mockSetActiveStep,
					markStepCompleted: mockMarkStepCompleted,
					markStepError: mockMarkStepError,
					clearStepError: mockClearStepError,
					updateFormData: mockUpdateFormData,
					setIsSubmitting: mockSetIsSubmitting,
					allowBackNavigation: false,
				})
			);

			result.current.handlePrevious();

			expect(mockSetActiveStep).not.toHaveBeenCalled();
		});
	});

	describe('handleStepClick', () => {
		it('navigates to clicked step when allowed', () => {
			const onStepChange = vi.fn();
			mockCanNavigateToStep.mockReturnValue(true);

			const { result } = renderHook(() =>
				useFormWizardHandlers<TestFormData>({
					state: mockState,
					steps: mockSteps,
					formControls: mockFormControls,
					setActiveStep: mockSetActiveStep,
					markStepCompleted: mockMarkStepCompleted,
					markStepError: mockMarkStepError,
					clearStepError: mockClearStepError,
					updateFormData: mockUpdateFormData,
					setIsSubmitting: mockSetIsSubmitting,
					onStepChange,
					allowBackNavigation: true,
				})
			);

			result.current.handleStepClick(2);

			expect(mockCanNavigateToStep).toHaveBeenCalledWith(2, 0, true);
			expect(mockUpdateFormData).toHaveBeenCalled();
			expect(mockSetActiveStep).toHaveBeenCalledWith(2);
			expect(onStepChange).toHaveBeenCalledWith(2);
		});

		it('does not navigate when navigation is not allowed', () => {
			mockCanNavigateToStep.mockReturnValue(false);

			const { result } = renderHook(() =>
				useFormWizardHandlers<TestFormData>({
					state: mockState,
					steps: mockSteps,
					formControls: mockFormControls,
					setActiveStep: mockSetActiveStep,
					markStepCompleted: mockMarkStepCompleted,
					markStepError: mockMarkStepError,
					clearStepError: mockClearStepError,
					updateFormData: mockUpdateFormData,
					setIsSubmitting: mockSetIsSubmitting,
					allowBackNavigation: true,
				})
			);

			result.current.handleStepClick(2);

			expect(mockSetActiveStep).not.toHaveBeenCalled();
		});
	});

	describe('handleComplete', () => {
		it('completes wizard when validation passes', async () => {
			const onComplete = vi.fn().mockResolvedValue(undefined);
			const formData = { name: 'John', email: 'john@example.com' };

			const { result } = renderHook(() =>
				useFormWizardHandlers<TestFormData>({
					state: mockState,
					steps: mockSteps,
					formControls: {
						...mockFormControls,
						getValues: vi.fn().mockReturnValue(formData),
					} as FormControls<TestFormData>,
					setActiveStep: mockSetActiveStep,
					markStepCompleted: mockMarkStepCompleted,
					markStepError: mockMarkStepError,
					clearStepError: mockClearStepError,
					updateFormData: mockUpdateFormData,
					setIsSubmitting: mockSetIsSubmitting,
					onComplete,
				})
			);

			await result.current.handleComplete();

			expect(mockUpdateFormData).toHaveBeenCalled();
			expect(mockSetIsSubmitting).toHaveBeenCalledWith(true);
			expect(onComplete).toHaveBeenCalledWith(formData);
			await waitFor(() => {
				expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
			});
		});

		it('does not complete when validation fails', async () => {
			const onComplete = vi.fn();
			mockValidateStepFields.mockResolvedValue(false);

			const { result } = renderHook(() =>
				useFormWizardHandlers<TestFormData>({
					state: mockState,
					steps: mockSteps,
					formControls: mockFormControls,
					setActiveStep: mockSetActiveStep,
					markStepCompleted: mockMarkStepCompleted,
					markStepError: mockMarkStepError,
					clearStepError: mockClearStepError,
					updateFormData: mockUpdateFormData,
					setIsSubmitting: mockSetIsSubmitting,
					onComplete,
				})
			);

			await result.current.handleComplete();

			expect(onComplete).not.toHaveBeenCalled();
			expect(mockSetIsSubmitting).not.toHaveBeenCalled();
		});

		it('handles async onComplete callback', async () => {
			const onComplete = vi
				.fn()
				.mockImplementation(
					async () => new Promise<void>(resolve => setTimeout(() => resolve(), 10))
				);
			const formData = { name: 'John', email: 'john@example.com' };

			const { result } = renderHook(() =>
				useFormWizardHandlers<TestFormData>({
					state: mockState,
					steps: mockSteps,
					formControls: {
						...mockFormControls,
						getValues: vi.fn().mockReturnValue(formData),
					} as FormControls<TestFormData>,
					setActiveStep: mockSetActiveStep,
					markStepCompleted: mockMarkStepCompleted,
					markStepError: mockMarkStepError,
					clearStepError: mockClearStepError,
					updateFormData: mockUpdateFormData,
					setIsSubmitting: mockSetIsSubmitting,
					onComplete,
				})
			);

			await result.current.handleComplete();

			expect(onComplete).toHaveBeenCalledWith(formData);
			await waitFor(() => {
				expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
			});
		});

		it('resets isSubmitting even if onComplete throws', async () => {
			const onComplete = vi.fn().mockRejectedValue(new Error('Test error'));

			const { result } = renderHook(() =>
				useFormWizardHandlers<TestFormData>({
					state: mockState,
					steps: mockSteps,
					formControls: mockFormControls,
					setActiveStep: mockSetActiveStep,
					markStepCompleted: mockMarkStepCompleted,
					markStepError: mockMarkStepError,
					clearStepError: mockClearStepError,
					updateFormData: mockUpdateFormData,
					setIsSubmitting: mockSetIsSubmitting,
					onComplete,
				})
			);

			await expect(result.current.handleComplete()).rejects.toThrow('Test error');
			await waitFor(() => {
				expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
			});
		});
	});

	describe('handleCancel', () => {
		it('calls onCancel callback', () => {
			const onCancel = vi.fn();

			const { result } = renderHook(() =>
				useFormWizardHandlers<TestFormData>({
					state: mockState,
					steps: mockSteps,
					formControls: mockFormControls,
					setActiveStep: mockSetActiveStep,
					markStepCompleted: mockMarkStepCompleted,
					markStepError: mockMarkStepError,
					clearStepError: mockClearStepError,
					updateFormData: mockUpdateFormData,
					setIsSubmitting: mockSetIsSubmitting,
					onCancel,
				})
			);

			result.current.handleCancel();

			expect(onCancel).toHaveBeenCalledTimes(1);
		});

		it('does not throw when onCancel is undefined', () => {
			const { result } = renderHook(() =>
				useFormWizardHandlers<TestFormData>({
					state: mockState,
					steps: mockSteps,
					formControls: mockFormControls,
					setActiveStep: mockSetActiveStep,
					markStepCompleted: mockMarkStepCompleted,
					markStepError: mockMarkStepError,
					clearStepError: mockClearStepError,
					updateFormData: mockUpdateFormData,
					setIsSubmitting: mockSetIsSubmitting,
				})
			);

			expect(() => result.current.handleCancel()).not.toThrow();
		});
	});
});
