/**
 * Tests for FormWizardView.data
 *
 * Tests the prepareWizardViewData function:
 * - Converting steps to stepper steps
 * - Calculating step metadata
 * - Rendering step content
 * - Handling different step configurations
 */

import type { FormControls } from '@core/forms/formAdapter';
import { prepareWizardViewData } from '@core/ui/forms/form-wizard/components/FormWizardView.data';
import type { FormWizardStep } from '@core/ui/forms/form-wizard/types/FormWizardTypes';
import type { FieldValues } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

interface TestFormData extends FieldValues {
	name: string;
	email: string;
}

describe('prepareWizardViewData', () => {
	it('should return wizard view data with correct structure', () => {
		const steps: FormWizardStep<TestFormData>[] = [
			{
				id: 'step1',
				label: 'Step 1',
				content: () => <div>Step 1 Content</div>,
			},
		];

		const mockFormControls = createMockFormControls<TestFormData>();
		const result = prepareWizardViewData(steps, 0, mockFormControls);

		expect(result).toHaveProperty('stepperSteps');
		expect(result).toHaveProperty('stepMetadata');
		expect(result).toHaveProperty('stepContent');
	});

	it('should convert steps to stepper steps format', () => {
		const steps: FormWizardStep<TestFormData>[] = [
			{
				id: 'step1',
				label: 'Step 1',
				description: 'Step 1 Description',
				content: () => <div>Step 1 Content</div>,
			},
			{
				id: 'step2',
				label: 'Step 2',
				content: () => <div>Step 2 Content</div>,
			},
		];

		const mockFormControls = createMockFormControls<TestFormData>();
		const result = prepareWizardViewData(steps, 0, mockFormControls);

		expect(result.stepperSteps).toHaveLength(2);
		expect(result.stepperSteps[0]).toEqual({
			id: 'step1',
			label: 'Step 1',
			description: 'Step 1 Description',
		});
		expect(result.stepperSteps[1]).toEqual({
			id: 'step2',
			label: 'Step 2',
		});
	});

	it('should calculate step metadata correctly for first step', () => {
		const steps: FormWizardStep<TestFormData>[] = [
			{
				id: 'step1',
				label: 'Step 1',
				content: () => <div>Step 1 Content</div>,
			},
			{
				id: 'step2',
				label: 'Step 2',
				content: () => <div>Step 2 Content</div>,
			},
		];

		const mockFormControls = createMockFormControls<TestFormData>();
		const result = prepareWizardViewData(steps, 0, mockFormControls);

		expect(result.stepMetadata.isFirstStep).toBe(true);
		expect(result.stepMetadata.isLastStep).toBe(false);
		expect(result.stepMetadata.progress).toBe(50); // (0 + 1) / 2 * 100
		expect(result.stepMetadata.currentStep).toEqual(steps[0]);
	});

	it('should calculate step metadata correctly for last step', () => {
		const steps: FormWizardStep<TestFormData>[] = [
			{
				id: 'step1',
				label: 'Step 1',
				content: () => <div>Step 1 Content</div>,
			},
			{
				id: 'step2',
				label: 'Step 2',
				content: () => <div>Step 2 Content</div>,
			},
		];

		const mockFormControls = createMockFormControls<TestFormData>();
		const result = prepareWizardViewData(steps, 1, mockFormControls);

		expect(result.stepMetadata.isFirstStep).toBe(false);
		expect(result.stepMetadata.isLastStep).toBe(true);
		expect(result.stepMetadata.progress).toBe(100); // (1 + 1) / 2 * 100
		expect(result.stepMetadata.currentStep).toEqual(steps[1]);
	});

	it('should calculate step metadata correctly for middle step', () => {
		const steps: FormWizardStep<TestFormData>[] = [
			{
				id: 'step1',
				label: 'Step 1',
				content: () => <div>Step 1 Content</div>,
			},
			{
				id: 'step2',
				label: 'Step 2',
				content: () => <div>Step 2 Content</div>,
			},
			{
				id: 'step3',
				label: 'Step 3',
				content: () => <div>Step 3 Content</div>,
			},
		];

		const mockFormControls = createMockFormControls<TestFormData>();
		const result = prepareWizardViewData(steps, 1, mockFormControls);

		expect(result.stepMetadata.isFirstStep).toBe(false);
		expect(result.stepMetadata.isLastStep).toBe(false);
		expect(result.stepMetadata.progress).toBe(67); // (1 + 1) / 3 * 100, rounded
		expect(result.stepMetadata.currentStep).toEqual(steps[1]);
	});

	it('should render step content for active step', () => {
		const steps: FormWizardStep<TestFormData>[] = [
			{
				id: 'step1',
				label: 'Step 1',
				content: () => <div data-testid="step1-content">Step 1 Content</div>,
			},
			{
				id: 'step2',
				label: 'Step 2',
				content: () => <div data-testid="step2-content">Step 2 Content</div>,
			},
		];

		const mockFormControls = createMockFormControls<TestFormData>();
		const result = prepareWizardViewData(steps, 0, mockFormControls);

		expect(result.stepContent).toBeDefined();
		// Step content is a ReactNode, we can't directly test it here
		// but we can verify it's not null
		expect(result.stepContent).not.toBeNull();
	});

	it('should handle single step wizard', () => {
		const steps: FormWizardStep<TestFormData>[] = [
			{
				id: 'step1',
				label: 'Step 1',
				content: () => <div>Step 1 Content</div>,
			},
		];

		const mockFormControls = createMockFormControls<TestFormData>();
		const result = prepareWizardViewData(steps, 0, mockFormControls);

		expect(result.stepperSteps).toHaveLength(1);
		expect(result.stepMetadata.isFirstStep).toBe(true);
		expect(result.stepMetadata.isLastStep).toBe(true);
		expect(result.stepMetadata.progress).toBe(100);
	});

	it('should handle steps with descriptions', () => {
		const steps: FormWizardStep<TestFormData>[] = [
			{
				id: 'step1',
				label: 'Step 1',
				description: 'Description 1',
				content: () => <div>Step 1 Content</div>,
			},
			{
				id: 'step2',
				label: 'Step 2',
				content: () => <div>Step 2 Content</div>,
			},
		];

		const mockFormControls = createMockFormControls<TestFormData>();
		const result = prepareWizardViewData(steps, 0, mockFormControls);

		expect(result.stepperSteps[0]?.description).toBe('Description 1');
		expect(result.stepperSteps[1]?.description).toBeUndefined();
	});

	it('should handle empty steps array', () => {
		const steps: FormWizardStep<TestFormData>[] = [];

		const mockFormControls = createMockFormControls<TestFormData>();
		const result = prepareWizardViewData(steps, 0, mockFormControls);

		expect(result.stepperSteps).toHaveLength(0);
		expect(result.stepMetadata.currentStep).toBeUndefined();
		expect(result.stepMetadata.progress).toBe(0);
	});
});

/**
 * Helper function to create mock form controls
 */
function createMockFormControls<T extends FieldValues>(): FormControls<T> {
	return {
		register: vi.fn() as unknown as FormControls<T>['register'],
		errors: {} as FormControls<T>['errors'],
		setValue: vi.fn() as unknown as FormControls<T>['setValue'],
		getValues: vi.fn() as unknown as FormControls<T>['getValues'],
		watch: vi.fn() as unknown as FormControls<T>['watch'],
		trigger: vi.fn() as unknown as FormControls<T>['trigger'],
		control: {} as FormControls<T>['control'],
		handleSubmit: vi.fn() as unknown as FormControls<T>['handleSubmit'],
		reset: vi.fn() as unknown as FormControls<T>['reset'],
		setError: vi.fn() as unknown as FormControls<T>['setError'],
		clearErrors: vi.fn() as unknown as FormControls<T>['clearErrors'],
		unregister: vi.fn() as unknown as FormControls<T>['unregister'],
		setFocus: vi.fn() as unknown as FormControls<T>['setFocus'],
		getFieldState: vi.fn() as unknown as FormControls<T>['getFieldState'],
		isValid: false,
		isSubmitting: false,
		isDirty: false,
		formState: {
			isValid: false,
			isDirty: false,
			isSubmitting: false,
			errors: {},
		} as FormControls<T>['formState'],
	};
}
