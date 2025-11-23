/**
 * useFormWizardHandlers.helpers Tests
 *
 * Tests for the handler helper functions including:
 * - validateStepFields: Validating step fields
 * - runCustomValidation: Running custom step validation
 */

import type { FormControls } from '@core/forms/formAdapter';
import {
	runCustomValidation,
	validateStepFields,
} from '@core/ui/forms/form-wizard/helpers/useFormWizardHandlers.helpers';
import type { FormWizardStep } from '@core/ui/forms/form-wizard/types/FormWizardTypes';
import React from 'react';
import type { Path } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

interface TestFormData {
	name: string;
	email: string;
	age?: number;
}

const mockContent = () => React.createElement('div', null, 'Step Content');

describe('validateStepFields', () => {
	it('validates specific fields when validateFields is provided', async () => {
		const trigger = vi.fn().mockResolvedValue(true);
		const markStepError = vi.fn();

		const formControls = {
			trigger,
		} as unknown as FormControls<TestFormData>;

		const step: FormWizardStep<TestFormData> = {
			id: 'step1',
			label: 'Step 1',
			content: mockContent,
			validateFields: ['name', 'email'] as Path<TestFormData>[],
		};

		const context = {
			stepIndex: 0,
			markStepError,
		};

		const result = await validateStepFields(formControls, step, context);

		expect(result).toBe(true);
		expect(trigger).toHaveBeenCalledWith('name', 'email');
		expect(markStepError).not.toHaveBeenCalled();
	});

	it('marks step error when specific fields validation fails', async () => {
		const trigger = vi.fn().mockResolvedValue(false);
		const markStepError = vi.fn();

		const formControls = {
			trigger,
		} as unknown as FormControls<TestFormData>;

		const step: FormWizardStep<TestFormData> = {
			id: 'step1',
			label: 'Step 1',
			content: mockContent,
			validateFields: ['name'] as Path<TestFormData>[],
		};

		const context = {
			stepIndex: 0,
			markStepError,
		};

		const result = await validateStepFields(formControls, step, context);

		expect(result).toBe(false);
		expect(trigger).toHaveBeenCalledWith('name');
		expect(markStepError).toHaveBeenCalledWith(0);
	});

	it('validates all fields when validateFields is not provided', async () => {
		const trigger = vi.fn().mockResolvedValue(true);
		const markStepError = vi.fn();

		const formControls = {
			trigger,
		} as unknown as FormControls<TestFormData>;

		const step: FormWizardStep<TestFormData> = {
			id: 'step1',
			label: 'Step 1',
			content: mockContent,
		};

		const context = {
			stepIndex: 0,
			markStepError,
		};

		const result = await validateStepFields(formControls, step, context);

		expect(result).toBe(true);
		expect(trigger).toHaveBeenCalledWith();
		expect(markStepError).not.toHaveBeenCalled();
	});

	it('marks step error when all fields validation fails', async () => {
		const trigger = vi.fn().mockResolvedValue(false);
		const markStepError = vi.fn();

		const formControls = {
			trigger,
		} as unknown as FormControls<TestFormData>;

		const step: FormWizardStep<TestFormData> = {
			id: 'step1',
			label: 'Step 1',
			content: mockContent,
		};

		const context = {
			stepIndex: 1,
			markStepError,
		};

		const result = await validateStepFields(formControls, step, context);

		expect(result).toBe(false);
		expect(trigger).toHaveBeenCalledWith();
		expect(markStepError).toHaveBeenCalledWith(1);
	});

	it('validates all fields when validateFields is empty array', async () => {
		const trigger = vi.fn().mockResolvedValue(true);
		const markStepError = vi.fn();

		const formControls = {
			trigger,
		} as unknown as FormControls<TestFormData>;

		const step: FormWizardStep<TestFormData> = {
			id: 'step1',
			label: 'Step 1',
			content: mockContent,
			validateFields: [],
		};

		const context = {
			stepIndex: 0,
			markStepError,
		};

		const result = await validateStepFields(formControls, step, context);

		expect(result).toBe(true);
		expect(trigger).toHaveBeenCalledWith();
		expect(markStepError).not.toHaveBeenCalled();
	});

	it('handles multiple fields in validateFields', async () => {
		const trigger = vi.fn().mockResolvedValue(true);
		const markStepError = vi.fn();

		const formControls = {
			trigger,
		} as unknown as FormControls<TestFormData>;

		const step: FormWizardStep<TestFormData> = {
			id: 'step1',
			label: 'Step 1',
			content: mockContent,
			validateFields: ['name', 'email', 'age'] as Path<TestFormData>[],
		};

		const context = {
			stepIndex: 2,
			markStepError,
		};

		const result = await validateStepFields(formControls, step, context);

		expect(result).toBe(true);
		expect(trigger).toHaveBeenCalledWith('name', 'email', 'age');
		expect(markStepError).not.toHaveBeenCalled();
	});

	it('uses correct step index when marking error', async () => {
		const trigger = vi.fn().mockResolvedValue(false);
		const markStepError = vi.fn();

		const formControls = {
			trigger,
		} as unknown as FormControls<TestFormData>;

		const step: FormWizardStep<TestFormData> = {
			id: 'step1',
			label: 'Step 1',
			content: mockContent,
			validateFields: ['name'] as Path<TestFormData>[],
		};

		const context = {
			stepIndex: 5,
			markStepError,
		};

		const result = await validateStepFields(formControls, step, context);

		expect(result).toBe(false);
		expect(markStepError).toHaveBeenCalledWith(5);
	});
});

describe('runCustomValidation', () => {
	it('returns true when step has no validate function', async () => {
		const markStepError = vi.fn();

		const step: FormWizardStep<TestFormData> = {
			id: 'step1',
			label: 'Step 1',
			content: mockContent,
		};

		const formData: TestFormData = {
			name: 'John',
			email: 'john@example.com',
		};

		const context = {
			stepIndex: 0,
			markStepError,
		};

		const result = await runCustomValidation(step, formData, context);

		expect(result).toBe(true);
		expect(markStepError).not.toHaveBeenCalled();
	});

	it('returns true when custom validation passes', async () => {
		const markStepError = vi.fn();
		const validate = vi.fn().mockResolvedValue(true);

		const step: FormWizardStep<TestFormData> = {
			id: 'step1',
			label: 'Step 1',
			content: mockContent,
			validate,
		};

		const formData: TestFormData = {
			name: 'John',
			email: 'john@example.com',
		};

		const context = {
			stepIndex: 0,
			markStepError,
		};

		const result = await runCustomValidation(step, formData, context);

		expect(result).toBe(true);
		expect(validate).toHaveBeenCalledWith(formData);
		expect(markStepError).not.toHaveBeenCalled();
	});

	it('returns false and marks error when custom validation fails', async () => {
		const markStepError = vi.fn();
		const validate = vi.fn().mockResolvedValue(false);

		const step: FormWizardStep<TestFormData> = {
			id: 'step1',
			label: 'Step 1',
			content: mockContent,
			validate,
		};

		const formData: TestFormData = {
			name: 'John',
			email: 'john@example.com',
		};

		const context = {
			stepIndex: 1,
			markStepError,
		};

		const result = await runCustomValidation(step, formData, context);

		expect(result).toBe(false);
		expect(validate).toHaveBeenCalledWith(formData);
		expect(markStepError).toHaveBeenCalledWith(1);
	});

	it('handles synchronous validation function', async () => {
		const markStepError = vi.fn();
		const validate = vi.fn().mockReturnValue(true);

		const step: FormWizardStep<TestFormData> = {
			id: 'step1',
			label: 'Step 1',
			content: mockContent,
			validate,
		};

		const formData: TestFormData = {
			name: 'John',
			email: 'john@example.com',
		};

		const context = {
			stepIndex: 0,
			markStepError,
		};

		const result = await runCustomValidation(step, formData, context);

		expect(result).toBe(true);
		expect(validate).toHaveBeenCalledWith(formData);
		expect(markStepError).not.toHaveBeenCalled();
	});

	it('handles synchronous validation failure', async () => {
		const markStepError = vi.fn();
		const validate = vi.fn().mockReturnValue(false);

		const step: FormWizardStep<TestFormData> = {
			id: 'step1',
			label: 'Step 1',
			content: mockContent,
			validate,
		};

		const formData: TestFormData = {
			name: 'John',
			email: 'john@example.com',
		};

		const context = {
			stepIndex: 2,
			markStepError,
		};

		const result = await runCustomValidation(step, formData, context);

		expect(result).toBe(false);
		expect(validate).toHaveBeenCalledWith(formData);
		expect(markStepError).toHaveBeenCalledWith(2);
	});

	it('passes complete form data to validate function', async () => {
		const markStepError = vi.fn();
		const validate = vi.fn().mockResolvedValue(true);

		const step: FormWizardStep<TestFormData> = {
			id: 'step1',
			label: 'Step 1',
			content: mockContent,
			validate,
		};

		const formData: TestFormData = {
			name: 'Jane',
			email: 'jane@example.com',
			age: 25,
		};

		const context = {
			stepIndex: 0,
			markStepError,
		};

		await runCustomValidation(step, formData, context);

		expect(validate).toHaveBeenCalledWith(formData);
		expect(validate).toHaveBeenCalledTimes(1);
	});

	it('uses correct step index when marking error', async () => {
		const markStepError = vi.fn();
		const validate = vi.fn().mockResolvedValue(false);

		const step: FormWizardStep<TestFormData> = {
			id: 'step1',
			label: 'Step 1',
			content: mockContent,
			validate,
		};

		const formData: TestFormData = {
			name: 'John',
			email: 'john@example.com',
		};

		const context = {
			stepIndex: 3,
			markStepError,
		};

		await runCustomValidation(step, formData, context);

		expect(markStepError).toHaveBeenCalledWith(3);
	});

	it('handles async validation with delay', async () => {
		const markStepError = vi.fn();
		const validate = vi
			.fn()
			.mockImplementation(
				async () => new Promise<boolean>(resolve => setTimeout(() => resolve(true), 10))
			);

		const step: FormWizardStep<TestFormData> = {
			id: 'step1',
			label: 'Step 1',
			content: mockContent,
			validate,
		};

		const formData: TestFormData = {
			name: 'John',
			email: 'john@example.com',
		};

		const context = {
			stepIndex: 0,
			markStepError,
		};

		const result = await runCustomValidation(step, formData, context);

		expect(result).toBe(true);
		expect(validate).toHaveBeenCalledWith(formData);
		expect(markStepError).not.toHaveBeenCalled();
	});
});
