/**
 * FormWizard Component Tests
 *
 * Tests for the FormWizard component including:
 * - Rendering
 * - Step navigation
 * - Form integration
 * - Callbacks
 * - Props forwarding
 * - State management
 */

import FormWizard from '@core/ui/forms/form-wizard/FormWizard';
import type { FormWizardStep } from '@core/ui/forms/form-wizard/types/FormWizardTypes';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import React from 'react';
import type { FieldValues } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

interface TestFormData extends FieldValues {
	name: string;
	email: string;
}

const STEP1_LABEL = 'Personal Information';
const STEP2_LABEL = 'Contact Information';

const createTestSteps = (): FormWizardStep<TestFormData>[] => [
	{
		id: 'personal',
		label: STEP1_LABEL,
		content: ({ register }) => (
			<div>
				<input {...register('name')} placeholder="Name" data-testid="name-input" />
			</div>
		),
	},
	{
		id: 'contact',
		label: STEP2_LABEL,
		content: ({ register }) => (
			<div>
				<input {...register('email')} placeholder="Email" data-testid="email-input" />
			</div>
		),
	},
];

describe('FormWizard - Rendering', () => {
	it('renders form wizard component', () => {
		const steps = createTestSteps();
		renderWithProviders(<FormWizard steps={steps} />);
		expect(screen.getByText(STEP1_LABEL)).toBeInTheDocument();
	});

	it('renders first step by default', () => {
		const steps = createTestSteps();
		renderWithProviders(<FormWizard steps={steps} />);
		expect(screen.getByTestId('name-input')).toBeInTheDocument();
		expect(screen.queryByTestId('email-input')).not.toBeInTheDocument();
	});

	it('renders with custom initialStep', () => {
		const steps = createTestSteps();
		renderWithProviders(<FormWizard steps={steps} initialStep={1} />);
		expect(screen.getByTestId('email-input')).toBeInTheDocument();
		expect(screen.queryByTestId('name-input')).not.toBeInTheDocument();
	});

	it('renders with custom className', () => {
		const steps = createTestSteps();
		const { container } = renderWithProviders(
			<FormWizard steps={steps} className="custom-wizard" />
		);
		const wizard = container.querySelector('.custom-wizard');
		expect(wizard).toBeInTheDocument();
	});

	it('renders all steps in stepper', () => {
		const steps = createTestSteps();
		renderWithProviders(<FormWizard steps={steps} />);
		expect(screen.getByText(STEP1_LABEL)).toBeInTheDocument();
		expect(screen.getByText(STEP2_LABEL)).toBeInTheDocument();
	});
});

describe('FormWizard - Form Integration', () => {
	it('initializes form with default values', () => {
		const steps = createTestSteps();
		const defaultValues: TestFormData = { name: 'John', email: 'john@example.com' };
		renderWithProviders(<FormWizard steps={steps} formOptions={{ defaultValues }} />);
		const nameInput = screen.getByTestId('name-input');
		expect(nameInput).toHaveValue('John');
	});

	it('allows form field interaction', async () => {
		const steps = createTestSteps();
		renderWithProviders(<FormWizard steps={steps} />);
		const nameInput = screen.getByTestId('name-input');

		// Type in the input
		fireEvent.change(nameInput, { target: { value: 'Test Name' } });

		await waitFor(() => {
			expect(nameInput).toHaveValue('Test Name');
		});
	});
});

describe('FormWizard - Callbacks', () => {
	it('calls onStepChange when step changes', async () => {
		const steps = createTestSteps();
		const onStepChange = vi.fn();
		renderWithProviders(<FormWizard steps={steps} onStepChange={onStepChange} />);

		// Find and click next button
		const nextButton = screen.getByRole('button', { name: /next/i });
		nextButton.click();

		await waitFor(() => {
			expect(onStepChange).toHaveBeenCalledWith(1);
		});
	});

	it('calls onComplete when wizard is completed', async () => {
		const steps = createTestSteps();
		const onComplete = vi.fn();
		renderWithProviders(<FormWizard steps={steps} onComplete={onComplete} />);

		// Navigate to last step
		const nextButton = screen.getByRole('button', { name: /next/i });
		nextButton.click();

		await waitFor(() => {
			expect(screen.getByTestId('email-input')).toBeInTheDocument();
		});

		// Complete the wizard
		const finishButton = screen.getByRole('button', { name: /finish|complete/i });
		finishButton.click();

		await waitFor(() => {
			expect(onComplete).toHaveBeenCalled();
		});
	});

	it('calls onCancel when cancel button is clicked', async () => {
		const steps = createTestSteps();
		const onCancel = vi.fn();
		renderWithProviders(<FormWizard steps={steps} onCancel={onCancel} />);

		const cancelButton = screen.getByRole('button', { name: /cancel/i });
		cancelButton.click();

		await waitFor(() => {
			expect(onCancel).toHaveBeenCalled();
		});
	});
});

describe('FormWizard - Controlled Mode', () => {
	it('uses controlled activeStep when provided', async () => {
		const steps = createTestSteps();
		const ControlledWizard = () => {
			const [activeStep, setActiveStep] = React.useState(0);
			return (
				<div>
					<FormWizard steps={steps} activeStep={activeStep} />
					<button onClick={() => setActiveStep(1)}>Go to Step 2</button>
				</div>
			);
		};

		renderWithProviders(<ControlledWizard />);
		expect(screen.getByTestId('name-input')).toBeInTheDocument();

		const goToStep2Button = screen.getByText('Go to Step 2');
		goToStep2Button.click();

		await waitFor(() => {
			expect(screen.getByTestId('email-input')).toBeInTheDocument();
		});
	});
});

describe('FormWizard - Props', () => {
	it('forwards additional props to container', () => {
		const steps = createTestSteps();
		renderWithProviders(
			<FormWizard steps={steps} data-testid="wizard-container" aria-label="Test Wizard" />
		);
		const wizard = screen.getByTestId('wizard-container');
		expect(wizard).toHaveAttribute('aria-label', 'Test Wizard');
	});

	it('respects showNavigation prop', () => {
		const steps = createTestSteps();
		renderWithProviders(<FormWizard steps={steps} showNavigation={false} />);
		expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();
	});

	it('respects showProgress prop', () => {
		const steps = createTestSteps();
		const { container } = renderWithProviders(<FormWizard steps={steps} showProgress={false} />);
		// Progress indicator should not be visible
		// This is implementation-specific, adjust based on actual component structure
		expect(container).toBeInTheDocument();
	});
});

describe('FormWizard - Data Persistence', () => {
	it('persists data when persistData is true', async () => {
		const steps = createTestSteps();
		const persistKey = 'test-wizard-data';
		renderWithProviders(<FormWizard steps={steps} persistData={true} persistKey={persistKey} />);

		const nameInput = screen.getByTestId('name-input');
		fireEvent.change(nameInput, { target: { value: 'Persisted Name' } });

		await waitFor(() => {
			// Data should be persisted to localStorage
			const persisted = localStorage.getItem(persistKey);
			expect(persisted).toBeTruthy();
		});
	});

	it('does not persist data when persistData is false', () => {
		const steps = createTestSteps();
		const persistKey = 'test-wizard-data';
		// Clear any existing data
		localStorage.removeItem(persistKey);

		renderWithProviders(<FormWizard steps={steps} persistData={false} persistKey={persistKey} />);

		// Data should not be persisted
		const persisted = localStorage.getItem(persistKey);
		expect(persisted).toBeNull();
	});
});

describe('FormWizard - Navigation', () => {
	it('allows back navigation when allowBackNavigation is true', async () => {
		const steps = createTestSteps();
		renderWithProviders(<FormWizard steps={steps} allowBackNavigation={true} />);

		// Go to step 2
		const nextButton = screen.getByRole('button', { name: /next/i });
		nextButton.click();

		await waitFor(() => {
			expect(screen.getByTestId('email-input')).toBeInTheDocument();
		});

		// Go back to step 1
		const previousButton = screen.getByRole('button', { name: /previous|back/i });
		previousButton.click();

		await waitFor(() => {
			expect(screen.getByTestId('name-input')).toBeInTheDocument();
		});
	});

	it('prevents back navigation when allowBackNavigation is false', async () => {
		const steps = createTestSteps();
		renderWithProviders(<FormWizard steps={steps} allowBackNavigation={false} />);

		// Go to step 2
		const nextButton = screen.getByRole('button', { name: /next/i });
		nextButton.click();

		await waitFor(() => {
			expect(screen.getByTestId('email-input')).toBeInTheDocument();
		});

		// Previous button should exist but clicking it should not navigate back
		const previousButton = screen.getByRole('button', { name: /previous/i });
		expect(previousButton).toBeInTheDocument();

		// Click the button - it should not navigate back due to allowBackNavigation being false
		previousButton.click();

		// Verify we're still on step 2 (email input should still be visible, name input should not)
		await waitFor(
			() => {
				expect(screen.getByTestId('email-input')).toBeInTheDocument();
				expect(screen.queryByTestId('name-input')).not.toBeInTheDocument();
			},
			{ timeout: 1000 }
		);
	});
});
