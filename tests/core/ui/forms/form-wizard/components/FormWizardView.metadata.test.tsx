/**
 * Tests for FormWizardView.metadata
 *
 * Tests the getStepMetadata function:
 * - Calculating step metadata
 * - Handling first, middle, and last steps
 * - Progress calculation
 * - Edge cases
 */

import { getStepMetadata } from '@core/ui/forms/form-wizard/components/FormWizardView.metadata';
import type { FormWizardStep } from '@core/ui/forms/form-wizard/types/FormWizardTypes';
import type { FieldValues } from 'react-hook-form';
import { describe, expect, it } from 'vitest';

interface TestFormData extends FieldValues {
	name: string;
	email: string;
}

describe('getStepMetadata', () => {
	it('should return step metadata with correct structure', () => {
		const steps: FormWizardStep<TestFormData>[] = [
			{
				id: 'step1',
				label: 'Step 1',
				content: () => <div>Step 1 Content</div>,
			},
		];

		const result = getStepMetadata(0, steps);

		expect(result).toHaveProperty('currentStep');
		expect(result).toHaveProperty('isFirstStep');
		expect(result).toHaveProperty('isLastStep');
		expect(result).toHaveProperty('progress');
	});

	it('should return correct metadata for first step', () => {
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

		const result = getStepMetadata(0, steps);

		expect(result.currentStep).toEqual(steps[0]);
		expect(result.isFirstStep).toBe(true);
		expect(result.isLastStep).toBe(false);
		expect(result.progress).toBe(50); // (0 + 1) / 2 * 100
	});

	it('should return correct metadata for last step', () => {
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

		const result = getStepMetadata(1, steps);

		expect(result.currentStep).toEqual(steps[1]);
		expect(result.isFirstStep).toBe(false);
		expect(result.isLastStep).toBe(true);
		expect(result.progress).toBe(100); // (1 + 1) / 2 * 100
	});

	it('should return correct metadata for middle step', () => {
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

		const result = getStepMetadata(1, steps);

		expect(result.currentStep).toEqual(steps[1]);
		expect(result.isFirstStep).toBe(false);
		expect(result.isLastStep).toBe(false);
		expect(result.progress).toBe(67); // (1 + 1) / 3 * 100, rounded
	});

	it('should handle single step wizard', () => {
		const steps: FormWizardStep<TestFormData>[] = [
			{
				id: 'step1',
				label: 'Step 1',
				content: () => <div>Step 1 Content</div>,
			},
		];

		const result = getStepMetadata(0, steps);

		expect(result.currentStep).toEqual(steps[0]);
		expect(result.isFirstStep).toBe(true);
		expect(result.isLastStep).toBe(true);
		expect(result.progress).toBe(100); // (0 + 1) / 1 * 100
	});

	it('should calculate progress correctly for three steps', () => {
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

		const step1Result = getStepMetadata(0, steps);
		expect(step1Result.progress).toBe(33); // (0 + 1) / 3 * 100, rounded

		const step2Result = getStepMetadata(1, steps);
		expect(step2Result.progress).toBe(67); // (1 + 1) / 3 * 100, rounded

		const step3Result = getStepMetadata(2, steps);
		expect(step3Result.progress).toBe(100); // (2 + 1) / 3 * 100
	});

	it('should handle empty steps array', () => {
		const steps: FormWizardStep<TestFormData>[] = [];

		const result = getStepMetadata(0, steps);

		expect(result.currentStep).toBeUndefined();
		expect(result.progress).toBe(0);
	});

	it('should handle out of bounds activeStep', () => {
		const steps: FormWizardStep<TestFormData>[] = [
			{
				id: 'step1',
				label: 'Step 1',
				content: () => <div>Step 1 Content</div>,
			},
		];

		const result = getStepMetadata(5, steps);

		expect(result.currentStep).toBeUndefined();
		expect(result.progress).toBeGreaterThan(100); // (5 + 1) / 1 * 100 = 600
	});

	it('should handle negative activeStep', () => {
		const steps: FormWizardStep<TestFormData>[] = [
			{
				id: 'step1',
				label: 'Step 1',
				content: () => <div>Step 1 Content</div>,
			},
		];

		const result = getStepMetadata(-1, steps);

		expect(result.currentStep).toBeUndefined();
		expect(result.progress).toBe(0); // (-1 + 1) / 1 * 100 = 0
	});

	it('should return correct step for each index', () => {
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

		for (let i = 0; i < steps.length; i++) {
			const result = getStepMetadata(i, steps);
			expect(result.currentStep).toEqual(steps[i]);
		}
	});
});
