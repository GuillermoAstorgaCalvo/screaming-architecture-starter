/**
 * FormWizardView.navigation Tests
 *
 * Tests for the NavigationButtons and NavigationSection components including:
 * - Rendering navigation buttons
 * - Previous button visibility and behavior
 * - Next/Finish button switching
 * - Cancel button handling
 * - Disabled states
 * - Button interactions
 * - Conditional rendering
 * - Accessibility
 */

import {
	NavigationButtons,
	NavigationSection,
} from '@core/ui/forms/form-wizard/components/FormWizardView.navigation';
import type { FormWizardState } from '@core/ui/forms/form-wizard/types/FormWizardTypes';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

interface TestFormData {
	name: string;
	email: string;
}

function createMockState(isSubmitting = false): FormWizardState<TestFormData> {
	return {
		activeStep: 0,
		completedSteps: new Set<number>(),
		errorSteps: new Set<number>(),
		formData: {},
		isSubmitting,
	};
}

function createMockHandlers() {
	return {
		handleNext: vi.fn().mockResolvedValue(undefined),
		handlePrevious: vi.fn(),
		handleStepClick: vi.fn(),
		handleComplete: vi.fn().mockResolvedValue(undefined),
		handleCancel: vi.fn(),
		validateCurrentStep: vi.fn().mockResolvedValue(true),
	};
}

describe('NavigationButtons', () => {
	describe('Previous Button', () => {
		it('renders previous button when not on first step', () => {
			const state = createMockState();
			const handlers = createMockHandlers();

			renderWithProviders(
				<NavigationButtons
					state={state}
					handlers={handlers}
					isFirstStep={false}
					isLastStep={false}
					size="md"
					allowBackNavigation={true}
					previousButtonLabel="Back"
					nextButtonLabel="Next"
					finishButtonLabel="Finish"
				/>
			);

			expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
		});

		it('does not render previous button on first step', () => {
			const state = createMockState();
			const handlers = createMockHandlers();

			renderWithProviders(
				<NavigationButtons
					state={state}
					handlers={handlers}
					isFirstStep={true}
					isLastStep={false}
					size="md"
					allowBackNavigation={true}
					previousButtonLabel="Back"
					nextButtonLabel="Next"
					finishButtonLabel="Finish"
				/>
			);

			expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();
		});

		it('calls handlePrevious when previous button is clicked', () => {
			const state = createMockState();
			const handlers = createMockHandlers();

			renderWithProviders(
				<NavigationButtons
					state={state}
					handlers={handlers}
					isFirstStep={false}
					isLastStep={false}
					size="md"
					allowBackNavigation={true}
					previousButtonLabel="Back"
					nextButtonLabel="Next"
					finishButtonLabel="Finish"
				/>
			);

			const previousButton = screen.getByRole('button', { name: 'Back' });
			fireEvent.click(previousButton);

			expect(handlers.handlePrevious).toHaveBeenCalledTimes(1);
		});

		it('disables previous button when allowBackNavigation is false', () => {
			const state = createMockState();
			const handlers = createMockHandlers();

			renderWithProviders(
				<NavigationButtons
					state={state}
					handlers={handlers}
					isFirstStep={false}
					isLastStep={false}
					size="md"
					allowBackNavigation={false}
					previousButtonLabel="Back"
					nextButtonLabel="Next"
					finishButtonLabel="Finish"
				/>
			);

			const previousButton = screen.getByRole('button', { name: 'Back' });
			expect(previousButton).toBeDisabled();
		});

		it('disables previous button when isSubmitting is true', () => {
			const state = createMockState(true);
			const handlers = createMockHandlers();

			renderWithProviders(
				<NavigationButtons
					state={state}
					handlers={handlers}
					isFirstStep={false}
					isLastStep={false}
					size="md"
					allowBackNavigation={true}
					previousButtonLabel="Back"
					nextButtonLabel="Next"
					finishButtonLabel="Finish"
				/>
			);

			const previousButton = screen.getByRole('button', { name: 'Back' });
			expect(previousButton).toBeDisabled();
		});

		it('uses custom previous button label', () => {
			const state = createMockState();
			const handlers = createMockHandlers();

			renderWithProviders(
				<NavigationButtons
					state={state}
					handlers={handlers}
					isFirstStep={false}
					isLastStep={false}
					size="md"
					allowBackNavigation={true}
					previousButtonLabel="Go Back"
					nextButtonLabel="Next"
					finishButtonLabel="Finish"
				/>
			);

			expect(screen.getByRole('button', { name: 'Go Back' })).toBeInTheDocument();
		});
	});

	describe('Next/Finish Button', () => {
		it('renders next button when not on last step', () => {
			const state = createMockState();
			const handlers = createMockHandlers();

			renderWithProviders(
				<NavigationButtons
					state={state}
					handlers={handlers}
					isFirstStep={true}
					isLastStep={false}
					size="md"
					allowBackNavigation={true}
					previousButtonLabel="Back"
					nextButtonLabel="Next"
					finishButtonLabel="Finish"
				/>
			);

			expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
			expect(screen.queryByRole('button', { name: 'Finish' })).not.toBeInTheDocument();
		});

		it('renders finish button when on last step', () => {
			const state = createMockState();
			const handlers = createMockHandlers();

			renderWithProviders(
				<NavigationButtons
					state={state}
					handlers={handlers}
					isFirstStep={false}
					isLastStep={true}
					size="md"
					allowBackNavigation={true}
					previousButtonLabel="Back"
					nextButtonLabel="Next"
					finishButtonLabel="Finish"
				/>
			);

			expect(screen.getByRole('button', { name: 'Finish' })).toBeInTheDocument();
			expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
		});

		it('calls handleNext when next button is clicked', async () => {
			const state = createMockState();
			const handlers = createMockHandlers();

			renderWithProviders(
				<NavigationButtons
					state={state}
					handlers={handlers}
					isFirstStep={true}
					isLastStep={false}
					size="md"
					allowBackNavigation={true}
					previousButtonLabel="Back"
					nextButtonLabel="Next"
					finishButtonLabel="Finish"
				/>
			);

			const nextButton = screen.getByRole('button', { name: 'Next' });
			fireEvent.click(nextButton);

			expect(handlers.handleNext).toHaveBeenCalledTimes(1);
		});

		it('calls handleComplete when finish button is clicked', async () => {
			const state = createMockState();
			const handlers = createMockHandlers();

			renderWithProviders(
				<NavigationButtons
					state={state}
					handlers={handlers}
					isFirstStep={false}
					isLastStep={true}
					size="md"
					allowBackNavigation={true}
					previousButtonLabel="Back"
					nextButtonLabel="Next"
					finishButtonLabel="Finish"
				/>
			);

			const finishButton = screen.getByRole('button', { name: 'Finish' });
			fireEvent.click(finishButton);

			expect(handlers.handleComplete).toHaveBeenCalledTimes(1);
		});

		it('disables next button when isSubmitting is true', () => {
			const state = createMockState(true);
			const handlers = createMockHandlers();

			renderWithProviders(
				<NavigationButtons
					state={state}
					handlers={handlers}
					isFirstStep={true}
					isLastStep={false}
					size="md"
					allowBackNavigation={true}
					previousButtonLabel="Back"
					nextButtonLabel="Next"
					finishButtonLabel="Finish"
				/>
			);

			const nextButton = screen.getByRole('button', { name: 'Next' });
			expect(nextButton).toBeDisabled();
		});

		it('disables finish button when isSubmitting is true', () => {
			const state = createMockState(true);
			const handlers = createMockHandlers();

			renderWithProviders(
				<NavigationButtons
					state={state}
					handlers={handlers}
					isFirstStep={false}
					isLastStep={true}
					size="md"
					allowBackNavigation={true}
					previousButtonLabel="Back"
					nextButtonLabel="Next"
					finishButtonLabel="Finish"
				/>
			);

			const finishButton = screen.getByRole('button', { name: /loading.*finish/i });
			expect(finishButton).toBeDisabled();
		});

		it('shows loading state on finish button when isSubmitting is true', () => {
			const state = createMockState(true);
			const handlers = createMockHandlers();

			renderWithProviders(
				<NavigationButtons
					state={state}
					handlers={handlers}
					isFirstStep={false}
					isLastStep={true}
					size="md"
					allowBackNavigation={true}
					previousButtonLabel="Back"
					nextButtonLabel="Next"
					finishButtonLabel="Finish"
				/>
			);

			const finishButton = screen.getByRole('button', { name: /loading.*finish/i });
			expect(finishButton).toBeInTheDocument();
			expect(finishButton).toBeDisabled();
		});

		it('uses custom next button label', () => {
			const state = createMockState();
			const handlers = createMockHandlers();

			renderWithProviders(
				<NavigationButtons
					state={state}
					handlers={handlers}
					isFirstStep={true}
					isLastStep={false}
					size="md"
					allowBackNavigation={true}
					previousButtonLabel="Back"
					nextButtonLabel="Continue"
					finishButtonLabel="Finish"
				/>
			);

			expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
		});

		it('uses custom finish button label', () => {
			const state = createMockState();
			const handlers = createMockHandlers();

			renderWithProviders(
				<NavigationButtons
					state={state}
					handlers={handlers}
					isFirstStep={false}
					isLastStep={true}
					size="md"
					allowBackNavigation={true}
					previousButtonLabel="Back"
					nextButtonLabel="Next"
					finishButtonLabel="Submit"
				/>
			);

			expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
		});
	});

	describe('Cancel Button', () => {
		it('renders cancel button when onCancel is provided', () => {
			const state = createMockState();
			const handlers = createMockHandlers();
			const onCancel = vi.fn();

			renderWithProviders(
				<NavigationButtons
					state={state}
					handlers={handlers}
					isFirstStep={true}
					isLastStep={false}
					size="md"
					allowBackNavigation={true}
					previousButtonLabel="Back"
					nextButtonLabel="Next"
					finishButtonLabel="Finish"
					onCancel={onCancel}
				/>
			);

			expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
		});

		it('does not render cancel button when onCancel is not provided', () => {
			const state = createMockState();
			const handlers = createMockHandlers();

			renderWithProviders(
				<NavigationButtons
					state={state}
					handlers={handlers}
					isFirstStep={true}
					isLastStep={false}
					size="md"
					allowBackNavigation={true}
					previousButtonLabel="Back"
					nextButtonLabel="Next"
					finishButtonLabel="Finish"
				/>
			);

			expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
		});

		it('calls onCancel when cancel button is clicked', () => {
			const state = createMockState();
			const handlers = createMockHandlers();
			const onCancel = vi.fn();

			renderWithProviders(
				<NavigationButtons
					state={state}
					handlers={handlers}
					isFirstStep={true}
					isLastStep={false}
					size="md"
					allowBackNavigation={true}
					previousButtonLabel="Back"
					nextButtonLabel="Next"
					finishButtonLabel="Finish"
					onCancel={onCancel}
				/>
			);

			const cancelButton = screen.getByRole('button', { name: 'Cancel' });
			fireEvent.click(cancelButton);

			expect(onCancel).toHaveBeenCalledTimes(1);
		});

		it('disables cancel button when isSubmitting is true', () => {
			const state = createMockState(true);
			const handlers = createMockHandlers();
			const onCancel = vi.fn();

			renderWithProviders(
				<NavigationButtons
					state={state}
					handlers={handlers}
					isFirstStep={true}
					isLastStep={false}
					size="md"
					allowBackNavigation={true}
					previousButtonLabel="Back"
					nextButtonLabel="Next"
					finishButtonLabel="Finish"
					onCancel={onCancel}
				/>
			);

			const cancelButton = screen.getByRole('button', { name: 'Cancel' });
			expect(cancelButton).toBeDisabled();
		});
	});

	describe('Size Variants', () => {
		it('renders with sm size', () => {
			const state = createMockState();
			const handlers = createMockHandlers();

			renderWithProviders(
				<NavigationButtons
					state={state}
					handlers={handlers}
					isFirstStep={true}
					isLastStep={false}
					size="sm"
					allowBackNavigation={true}
					previousButtonLabel="Back"
					nextButtonLabel="Next"
					finishButtonLabel="Finish"
				/>
			);

			expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
		});

		it('renders with md size', () => {
			const state = createMockState();
			const handlers = createMockHandlers();

			renderWithProviders(
				<NavigationButtons
					state={state}
					handlers={handlers}
					isFirstStep={true}
					isLastStep={false}
					size="md"
					allowBackNavigation={true}
					previousButtonLabel="Back"
					nextButtonLabel="Next"
					finishButtonLabel="Finish"
				/>
			);

			expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
		});

		it('renders with lg size', () => {
			const state = createMockState();
			const handlers = createMockHandlers();

			renderWithProviders(
				<NavigationButtons
					state={state}
					handlers={handlers}
					isFirstStep={true}
					isLastStep={false}
					size="lg"
					allowBackNavigation={true}
					previousButtonLabel="Back"
					nextButtonLabel="Next"
					finishButtonLabel="Finish"
				/>
			);

			expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
		});
	});

	describe('Accessibility', () => {
		it('has no accessibility violations', async () => {
			const state = createMockState();
			const handlers = createMockHandlers();

			const { container } = renderWithProviders(
				<NavigationButtons
					state={state}
					handlers={handlers}
					isFirstStep={false}
					isLastStep={false}
					size="md"
					allowBackNavigation={true}
					previousButtonLabel="Back"
					nextButtonLabel="Next"
					finishButtonLabel="Finish"
				/>
			);
			await expectA11y(container);
		});
	});
});

describe('NavigationSection', () => {
	it('renders NavigationButtons when showNavigation is true', () => {
		const state = createMockState();
		const handlers = createMockHandlers();

		renderWithProviders(
			<NavigationSection
				showNavigation={true}
				state={state}
				handlers={handlers}
				isFirstStep={true}
				isLastStep={false}
				size="md"
				allowBackNavigation={true}
				previousButtonLabel="Back"
				nextButtonLabel="Next"
				finishButtonLabel="Finish"
				onCancel={undefined}
			/>
		);

		expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
	});

	it('returns null when showNavigation is false', () => {
		const state = createMockState();
		const handlers = createMockHandlers();

		const { container } = renderWithProviders(
			<NavigationSection
				showNavigation={false}
				state={state}
				handlers={handlers}
				isFirstStep={true}
				isLastStep={false}
				size="md"
				allowBackNavigation={true}
				previousButtonLabel="Back"
				nextButtonLabel="Next"
				finishButtonLabel="Finish"
				onCancel={undefined}
			/>
		);

		expect(container.firstChild).toBeNull();
		expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
	});

	it('passes all props to NavigationButtons when visible', () => {
		const state = createMockState();
		const handlers = createMockHandlers();
		const onCancel = vi.fn();

		renderWithProviders(
			<NavigationSection
				showNavigation={true}
				state={state}
				handlers={handlers}
				isFirstStep={false}
				isLastStep={true}
				size="md"
				allowBackNavigation={true}
				previousButtonLabel="Back"
				nextButtonLabel="Next"
				finishButtonLabel="Finish"
				onCancel={onCancel}
			/>
		);

		expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Finish' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
	});

	it('passes onCancel when provided', () => {
		const state = createMockState();
		const handlers = createMockHandlers();
		const onCancel = vi.fn();

		renderWithProviders(
			<NavigationSection
				showNavigation={true}
				state={state}
				handlers={handlers}
				isFirstStep={true}
				isLastStep={false}
				size="md"
				allowBackNavigation={true}
				previousButtonLabel="Back"
				nextButtonLabel="Next"
				finishButtonLabel="Finish"
				onCancel={onCancel}
			/>
		);

		const cancelButton = screen.getByRole('button', { name: 'Cancel' });
		fireEvent.click(cancelButton);

		expect(onCancel).toHaveBeenCalledTimes(1);
	});

	it('does not pass onCancel when undefined', () => {
		const state = createMockState();
		const handlers = createMockHandlers();

		renderWithProviders(
			<NavigationSection
				showNavigation={true}
				state={state}
				handlers={handlers}
				isFirstStep={true}
				isLastStep={false}
				size="md"
				allowBackNavigation={true}
				previousButtonLabel="Back"
				nextButtonLabel="Next"
				finishButtonLabel="Finish"
				onCancel={undefined}
			/>
		);

		expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
	});
});
