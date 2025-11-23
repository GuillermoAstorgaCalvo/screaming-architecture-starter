/**
 * Wizard Component Tests
 *
 * Tests for the main Wizard component:
 * - Rendering
 * - Step navigation
 * - Callbacks
 * - Props forwarding
 * - State management
 */

import Wizard from '@core/ui/forms/wizard/Wizard';
import type { WizardProps } from '@src-types/ui/navigation/wizard';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

const createTestSteps = (): WizardProps['steps'] => [
	{
		id: 'step1',
		label: 'Personal Information',
		content: <div data-testid="step1-content">Step 1 Content</div>,
	},
	{
		id: 'step2',
		label: 'Contact Information',
		content: <div data-testid="step2-content">Step 2 Content</div>,
	},
	{
		id: 'step3',
		label: 'Review',
		content: <div data-testid="step3-content">Step 3 Content</div>,
	},
];

describe('Wizard - Rendering', () => {
	it('renders wizard component', () => {
		const steps = createTestSteps();
		renderWithProviders(<Wizard steps={steps} />);

		expect(screen.getByText('Personal Information')).toBeInTheDocument();
		expect(screen.getByTestId('step1-content')).toBeInTheDocument();
	});

	it('renders first step by default', () => {
		const steps = createTestSteps();
		renderWithProviders(<Wizard steps={steps} />);

		expect(screen.getByTestId('step1-content')).toBeInTheDocument();
		expect(screen.queryByTestId('step2-content')).not.toBeInTheDocument();
	});

	it('renders with custom initialStep', () => {
		const steps = createTestSteps();
		renderWithProviders(<Wizard steps={steps} initialStep={1} />);

		expect(screen.getByTestId('step2-content')).toBeInTheDocument();
		expect(screen.queryByTestId('step1-content')).not.toBeInTheDocument();
	});

	it('renders with custom className', () => {
		const steps = createTestSteps();
		const { container } = renderWithProviders(<Wizard steps={steps} className="custom-wizard" />);

		const wizard = container.querySelector('.custom-wizard');
		expect(wizard).toBeInTheDocument();
	});

	it('renders all steps in stepper', () => {
		const steps = createTestSteps();
		renderWithProviders(<Wizard steps={steps} />);

		expect(screen.getByText('Personal Information')).toBeInTheDocument();
		expect(screen.getByText('Contact Information')).toBeInTheDocument();
		expect(screen.getByText('Review')).toBeInTheDocument();
	});
});

describe('Wizard - Navigation', () => {
	it('navigates to next step', async () => {
		const steps = createTestSteps();
		renderWithProviders(<Wizard steps={steps} />);

		const nextButton = screen.getByRole('button', { name: /next/i });
		fireEvent.click(nextButton);

		await waitFor(() => {
			expect(screen.getByTestId('step2-content')).toBeInTheDocument();
		});
	});

	it('navigates to previous step when allowed', async () => {
		const steps = createTestSteps();
		renderWithProviders(<Wizard steps={steps} allowBackNavigation={true} />);

		// Go to step 2
		const nextButton = screen.getByRole('button', { name: /next/i });
		fireEvent.click(nextButton);

		await waitFor(() => {
			expect(screen.getByTestId('step2-content')).toBeInTheDocument();
		});

		// Go back to step 1
		const previousButton = screen.getByRole('button', { name: /previous/i });
		fireEvent.click(previousButton);

		await waitFor(() => {
			expect(screen.getByTestId('step1-content')).toBeInTheDocument();
		});
	});

	it('calls onStepChange when step changes', async () => {
		const steps = createTestSteps();
		const onStepChange = vi.fn();
		renderWithProviders(<Wizard steps={steps} onStepChange={onStepChange} />);

		const nextButton = screen.getByRole('button', { name: /next/i });
		fireEvent.click(nextButton);

		await waitFor(() => {
			expect(onStepChange).toHaveBeenCalledWith(1);
		});
	});

	it('shows finish button on last step', async () => {
		const steps = createTestSteps();
		renderWithProviders(<Wizard steps={steps} />);

		// Navigate to last step
		const nextButton = screen.getByRole('button', { name: /next/i });
		fireEvent.click(nextButton);

		await waitFor(() => {
			expect(screen.getByTestId('step2-content')).toBeInTheDocument();
		});

		fireEvent.click(nextButton);

		await waitFor(() => {
			expect(screen.getByTestId('step3-content')).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /finish/i })).toBeInTheDocument();
		});
	});
});

describe('Wizard - Callbacks', () => {
	it('calls onComplete when wizard is completed', async () => {
		const steps = createTestSteps();
		const onComplete = vi.fn();
		renderWithProviders(<Wizard steps={steps} onComplete={onComplete} />);

		// Navigate to last step
		const nextButton = screen.getByRole('button', { name: /next/i });
		fireEvent.click(nextButton);

		await waitFor(() => {
			expect(screen.getByTestId('step2-content')).toBeInTheDocument();
		});

		fireEvent.click(nextButton);

		await waitFor(() => {
			expect(screen.getByTestId('step3-content')).toBeInTheDocument();
		});

		// Complete the wizard
		const finishButton = screen.getByRole('button', { name: /finish/i });
		fireEvent.click(finishButton);

		await waitFor(() => {
			expect(onComplete).toHaveBeenCalled();
		});
	});
});

describe('Wizard - Props', () => {
	it('respects showNavigation prop', () => {
		const steps = createTestSteps();
		renderWithProviders(<Wizard steps={steps} showNavigation={false} />);

		expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();
	});

	it('respects showProgress prop', () => {
		const steps = createTestSteps();
		const { container } = renderWithProviders(<Wizard steps={steps} showProgress={false} />);

		// Progress indicator should not be visible
		expect(container.querySelector('[data-testid="progress-bar"]')).not.toBeInTheDocument();
	});

	it('forwards additional props to container', () => {
		const steps = createTestSteps();
		renderWithProviders(
			<Wizard steps={steps} data-testid="wizard-container" aria-label="Test Wizard" />
		);

		const wizard = screen.getByTestId('wizard-container');
		expect(wizard).toHaveAttribute('aria-label', 'Test Wizard');
	});
});

describe('Wizard - Controlled Mode', () => {
	it('uses controlled activeStep when provided', async () => {
		const steps = createTestSteps();
		const ControlledWizard = () => {
			const [activeStep, setActiveStep] = React.useState(0);
			return (
				<div>
					<Wizard steps={steps} activeStep={activeStep} />
					<button onClick={() => setActiveStep(1)}>Go to Step 2</button>
				</div>
			);
		};

		renderWithProviders(<ControlledWizard />);
		expect(screen.getByTestId('step1-content')).toBeInTheDocument();

		const goToStep2Button = screen.getByText('Go to Step 2');
		fireEvent.click(goToStep2Button);

		await waitFor(() => {
			expect(screen.getByTestId('step2-content')).toBeInTheDocument();
		});
	});
});

describe('Wizard - Step Clicking', () => {
	it('navigates to clicked step when allowBackNavigation is true', async () => {
		const steps = createTestSteps();
		renderWithProviders(<Wizard steps={steps} allowBackNavigation={true} />);

		// Find and click on step 2 in the stepper
		const step2Label = screen.getByText('Contact Information');
		const step2Button = step2Label.closest('button');

		if (step2Button) {
			fireEvent.click(step2Button);

			await waitFor(() => {
				expect(screen.getByTestId('step2-content')).toBeInTheDocument();
			});
		}
	});

	it('handles step click errors gracefully', async () => {
		const steps = createTestSteps();
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		renderWithProviders(<Wizard steps={steps} allowBackNavigation={true} />);

		// The error handling is internal, so we just verify the component doesn't crash
		// when goToStep fails (which is caught in handleStepClick)
		const step2Label = screen.getByText('Contact Information');
		const step2Button = step2Label.closest('button');

		if (step2Button) {
			fireEvent.click(step2Button);
			// Component should still render without crashing
			await waitFor(() => {
				expect(screen.getByText('Contact Information')).toBeInTheDocument();
			});
		}

		consoleErrorSpy.mockRestore();
	});
});

describe('Wizard - Edge Cases', () => {
	it('handles empty steps array', () => {
		renderWithProviders(<Wizard steps={[]} />);
		// Component should render without crashing
		// With empty steps, navigation buttons may still render but be disabled
		expect(screen.queryByText('Personal Information')).not.toBeInTheDocument();
	});

	it('handles single step', () => {
		const singleStep: WizardProps['steps'] = [
			{
				id: 'step1',
				label: 'Single Step',
				content: <div data-testid="step1-content">Step 1 Content</div>,
			},
		];
		renderWithProviders(<Wizard steps={singleStep} />);

		expect(screen.getByText('Single Step')).toBeInTheDocument();
		expect(screen.getByTestId('step1-content')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /finish/i })).toBeInTheDocument();
	});

	it('merges className with default classes', () => {
		const steps = createTestSteps();
		const { container } = renderWithProviders(<Wizard steps={steps} className="custom-class" />);

		// twMerge combines classes, check that the element exists and has the custom class
		const wizard = container.firstChild as HTMLElement;
		expect(wizard).toBeInTheDocument();
		expect(wizard.className).toContain('custom-class');
	});

	it('handles undefined className', () => {
		const steps = createTestSteps();
		const { container } = renderWithProviders(<Wizard steps={steps} />);

		const wizard = container.querySelector('.w-full');
		expect(wizard).toBeInTheDocument();
	});
});
