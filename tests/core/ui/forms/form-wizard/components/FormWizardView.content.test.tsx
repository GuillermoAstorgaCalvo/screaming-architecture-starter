/**
 * Tests for FormWizardView.content
 *
 * Tests the renderStepContent function:
 * - Rendering step content with form controls
 * - Handling undefined steps
 * - Passing form controls to step content
 */

import type { FormControls } from '@core/forms/formAdapter';
import { renderStepContent } from '@core/ui/forms/form-wizard/components/FormWizardView.content';
import type { FormWizardStep } from '@core/ui/forms/form-wizard/types/FormWizardTypes';
import { render } from '@testing-library/react';
import type { FieldValues } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

interface TestFormData extends FieldValues {
	name: string;
	email: string;
}

describe('renderStepContent', () => {
	it('should return null when currentStep is undefined', () => {
		const mockFormControls = createMockFormControls<TestFormData>();
		const result = renderStepContent(undefined, mockFormControls);
		expect(result).toBeNull();
	});

	it('should call step content function with form controls', () => {
		const mockContent = vi.fn(() => <div>Step Content</div>);
		const step: FormWizardStep<TestFormData> = {
			id: 'step1',
			label: 'Step 1',
			content: mockContent,
		};

		const mockFormControls = createMockFormControls<TestFormData>();
		renderStepContent(step, mockFormControls);

		expect(mockContent).toHaveBeenCalledTimes(1);
		expect(mockContent.mock.calls.length).toBeGreaterThan(0);
		const firstCall = mockContent.mock.calls[0];
		expect(firstCall).toBeDefined();
		if (firstCall && Array.isArray(firstCall) && firstCall.length > 0) {
			const callArgs = (firstCall as unknown[])[0];
			expect(callArgs).toBeDefined();
			if (callArgs) {
				expect(callArgs).toHaveProperty('register');
				expect(callArgs).toHaveProperty('errors');
				expect(callArgs).toHaveProperty('setValue');
				expect(callArgs).toHaveProperty('getValues');
				expect(callArgs).toHaveProperty('watch');
				expect(callArgs).toHaveProperty('trigger');
				expect(callArgs).toHaveProperty('control');
				expect(callArgs).toHaveProperty('isValid');
				expect(callArgs).toHaveProperty('isDirty');
			}
		}
	});

	it('should pass correct form controls to step content', () => {
		const mockFormControls = createMockFormControls<TestFormData>();
		const mockContent = vi.fn(() => <div>Step Content</div>);
		const step: FormWizardStep<TestFormData> = {
			id: 'step1',
			label: 'Step 1',
			content: mockContent,
		};

		renderStepContent(step, mockFormControls);

		expect(mockContent).toHaveBeenCalledWith({
			register: mockFormControls.register,
			errors: mockFormControls.errors,
			setValue: mockFormControls.setValue,
			getValues: mockFormControls.getValues,
			watch: mockFormControls.watch,
			trigger: mockFormControls.trigger,
			control: mockFormControls.control,
			isValid: mockFormControls.isValid,
			isDirty: mockFormControls.isDirty,
		});
	});

	it('should render step content as ReactNode', () => {
		const step: FormWizardStep<TestFormData> = {
			id: 'step1',
			label: 'Step 1',
			content: () => <div data-testid="step-content">Step Content</div>,
		};

		const mockFormControls = createMockFormControls<TestFormData>();
		const result = renderStepContent(step, mockFormControls);

		const { getByTestId } = render(<>{result}</>);
		expect(getByTestId('step-content')).toBeInTheDocument();
	});

	it('should handle step content that uses form controls', () => {
		const step: FormWizardStep<TestFormData> = {
			id: 'step1',
			label: 'Step 1',
			content: ({ register, errors }) => (
				<div>
					<input {...register('name')} data-testid="name-input" />
					{errors.name ? <span data-testid="error">Error</span> : null}
				</div>
			),
		};

		const mockFormControls = createMockFormControls<TestFormData>();
		const result = renderStepContent(step, mockFormControls);

		const { getByTestId } = render(<>{result}</>);
		expect(getByTestId('name-input')).toBeInTheDocument();
	});

	it('should handle multiple steps with different content', () => {
		const step1: FormWizardStep<TestFormData> = {
			id: 'step1',
			label: 'Step 1',
			content: () => <div data-testid="step1">Step 1 Content</div>,
		};

		const step2: FormWizardStep<TestFormData> = {
			id: 'step2',
			label: 'Step 2',
			content: () => <div data-testid="step2">Step 2 Content</div>,
		};

		const mockFormControls = createMockFormControls<TestFormData>();

		const result1 = renderStepContent(step1, mockFormControls);
		const { getByTestId: getByTestId1, unmount: unmount1 } = render(<>{result1}</>);
		expect(getByTestId1('step1')).toBeInTheDocument();
		unmount1();

		const result2 = renderStepContent(step2, mockFormControls);
		const { getByTestId: getByTestId2 } = render(<>{result2}</>);
		expect(getByTestId2('step2')).toBeInTheDocument();
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
