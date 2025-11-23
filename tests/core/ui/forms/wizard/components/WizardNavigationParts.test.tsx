/**
 * WizardNavigationParts Tests
 *
 * Tests for wizard navigation parts:
 * - Left buttons (Previous, Skip)
 * - Right buttons (Next, Finish)
 */

import type {
	WizardNavigationLeftButtonsProps,
	WizardNavigationRightButtonsProps,
} from '@core/ui/forms/wizard/components/WizardNavigation.types';
import {
	WizardNavigationLeftButtons,
	WizardNavigationRightButtons,
} from '@core/ui/forms/wizard/components/WizardNavigationParts';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('WizardNavigationLeftButtons', () => {
	it('renders previous button when back navigation is allowed', () => {
		const props: WizardNavigationLeftButtonsProps = {
			allowBackNavigation: true,
			canGoPrevious: true,
			isLastStep: false,
			currentStep: undefined,
			isProcessing: false,
			size: 'md',
			previousButtonLabel: 'Previous',
			onPrevious: vi.fn(),
			onSkip: vi.fn(),
		};

		renderWithProviders(<WizardNavigationLeftButtons {...props} />);

		const previousButton = screen.getByRole('button', { name: /previous/i });
		expect(previousButton).toBeInTheDocument();
	});

	it('does not render previous button when back navigation is not allowed', () => {
		const props: WizardNavigationLeftButtonsProps = {
			allowBackNavigation: false,
			canGoPrevious: false,
			isLastStep: false,
			currentStep: undefined,
			isProcessing: false,
			size: 'md',
			previousButtonLabel: 'Previous',
			onPrevious: vi.fn(),
			onSkip: vi.fn(),
		};

		renderWithProviders(<WizardNavigationLeftButtons {...props} />);

		expect(screen.queryByRole('button', { name: /previous/i })).not.toBeInTheDocument();
	});

	it('renders skip button when step is skippable', () => {
		const props: WizardNavigationLeftButtonsProps = {
			allowBackNavigation: true,
			canGoPrevious: true,
			isLastStep: false,
			currentStep: { skippable: true },
			isProcessing: false,
			size: 'md',
			previousButtonLabel: 'Previous',
			onPrevious: vi.fn(),
			onSkip: vi.fn(),
		};

		renderWithProviders(<WizardNavigationLeftButtons {...props} />);

		const skipButton = screen.getByRole('button', { name: /skip/i });
		expect(skipButton).toBeInTheDocument();
	});

	it('does not render skip button on last step', () => {
		const props: WizardNavigationLeftButtonsProps = {
			allowBackNavigation: true,
			canGoPrevious: true,
			isLastStep: true,
			currentStep: { skippable: true },
			isProcessing: false,
			size: 'md',
			previousButtonLabel: 'Previous',
			onPrevious: vi.fn(),
			onSkip: vi.fn(),
		};

		renderWithProviders(<WizardNavigationLeftButtons {...props} />);

		expect(screen.queryByRole('button', { name: /skip/i })).not.toBeInTheDocument();
	});

	it('calls onPrevious when previous button is clicked', () => {
		const onPrevious = vi.fn();
		const props: WizardNavigationLeftButtonsProps = {
			allowBackNavigation: true,
			canGoPrevious: true,
			isLastStep: false,
			currentStep: undefined,
			isProcessing: false,
			size: 'md',
			previousButtonLabel: 'Previous',
			onPrevious,
			onSkip: vi.fn(),
		};

		renderWithProviders(<WizardNavigationLeftButtons {...props} />);

		const previousButton = screen.getByRole('button', { name: /previous/i });
		fireEvent.click(previousButton);

		expect(onPrevious).toHaveBeenCalled();
	});

	it('calls onSkip when skip button is clicked', () => {
		const onSkip = vi.fn();
		const props: WizardNavigationLeftButtonsProps = {
			allowBackNavigation: true,
			canGoPrevious: true,
			isLastStep: false,
			currentStep: { skippable: true },
			isProcessing: false,
			size: 'md',
			previousButtonLabel: 'Previous',
			onPrevious: vi.fn(),
			onSkip,
		};

		renderWithProviders(<WizardNavigationLeftButtons {...props} />);

		const skipButton = screen.getByRole('button', { name: /skip/i });
		fireEvent.click(skipButton);

		expect(onSkip).toHaveBeenCalled();
	});

	it('disables buttons when processing', () => {
		const props: WizardNavigationLeftButtonsProps = {
			allowBackNavigation: true,
			canGoPrevious: true,
			isLastStep: false,
			currentStep: { skippable: true },
			isProcessing: true,
			size: 'md',
			previousButtonLabel: 'Previous',
			onPrevious: vi.fn(),
			onSkip: vi.fn(),
		};

		renderWithProviders(<WizardNavigationLeftButtons {...props} />);

		const previousButton = screen.getByRole('button', { name: /previous/i });
		const skipButton = screen.getByRole('button', { name: /skip/i });

		expect(previousButton).toBeDisabled();
		expect(skipButton).toBeDisabled();
	});
});

describe('WizardNavigationRightButtons', () => {
	it('renders next button when not on last step', () => {
		const props: WizardNavigationRightButtonsProps = {
			isLastStep: false,
			canGoNext: true,
			isProcessing: false,
			size: 'md',
			nextButtonLabel: 'Next',
			finishButtonLabel: 'Finish',
			onNext: vi.fn(),
			onComplete: vi.fn(),
		};

		renderWithProviders(<WizardNavigationRightButtons {...props} />);

		const nextButton = screen.getByRole('button', { name: /next/i });
		expect(nextButton).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: /finish/i })).not.toBeInTheDocument();
	});

	it('renders finish button when on last step', () => {
		const props: WizardNavigationRightButtonsProps = {
			isLastStep: true,
			canGoNext: false,
			isProcessing: false,
			size: 'md',
			nextButtonLabel: 'Next',
			finishButtonLabel: 'Finish',
			onNext: vi.fn(),
			onComplete: vi.fn(),
		};

		renderWithProviders(<WizardNavigationRightButtons {...props} />);

		const finishButton = screen.getByRole('button', { name: /finish/i });
		expect(finishButton).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();
	});

	it('calls onNext when next button is clicked', () => {
		const onNext = vi.fn();
		const props: WizardNavigationRightButtonsProps = {
			isLastStep: false,
			canGoNext: true,
			isProcessing: false,
			size: 'md',
			nextButtonLabel: 'Next',
			finishButtonLabel: 'Finish',
			onNext,
			onComplete: vi.fn(),
		};

		renderWithProviders(<WizardNavigationRightButtons {...props} />);

		const nextButton = screen.getByRole('button', { name: /next/i });
		fireEvent.click(nextButton);

		expect(onNext).toHaveBeenCalled();
	});

	it('calls onComplete when finish button is clicked', () => {
		const onComplete = vi.fn();
		const props: WizardNavigationRightButtonsProps = {
			isLastStep: true,
			canGoNext: false,
			isProcessing: false,
			size: 'md',
			nextButtonLabel: 'Next',
			finishButtonLabel: 'Finish',
			onNext: vi.fn(),
			onComplete,
		};

		renderWithProviders(<WizardNavigationRightButtons {...props} />);

		const finishButton = screen.getByRole('button', { name: /finish/i });
		fireEvent.click(finishButton);

		expect(onComplete).toHaveBeenCalled();
	});

	it('disables next button when cannot go next', () => {
		const props: WizardNavigationRightButtonsProps = {
			isLastStep: false,
			canGoNext: false,
			isProcessing: false,
			size: 'md',
			nextButtonLabel: 'Next',
			finishButtonLabel: 'Finish',
			onNext: vi.fn(),
			onComplete: vi.fn(),
		};

		renderWithProviders(<WizardNavigationRightButtons {...props} />);

		const nextButton = screen.getByRole('button', { name: /next/i });
		expect(nextButton).toBeDisabled();
	});

	it('disables buttons when processing', () => {
		const props: WizardNavigationRightButtonsProps = {
			isLastStep: false,
			canGoNext: true,
			isProcessing: true,
			size: 'md',
			nextButtonLabel: 'Next',
			finishButtonLabel: 'Finish',
			onNext: vi.fn(),
			onComplete: vi.fn(),
		};

		renderWithProviders(<WizardNavigationRightButtons {...props} />);

		const nextButton = screen.getByRole('button', { name: /next/i });
		expect(nextButton).toBeDisabled();
	});
});
