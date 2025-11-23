/**
 * FormWizardView.progress Tests
 *
 * Tests for the ProgressIndicator and ProgressSection components including:
 * - Rendering progress indicator
 * - Displaying step information
 * - Progress percentage calculation
 * - Conditional rendering of ProgressSection
 * - Accessibility
 */

import {
	ProgressIndicator,
	ProgressSection,
} from '@core/ui/forms/form-wizard/components/FormWizardView.progress';
import { screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

describe('ProgressIndicator', () => {
	it('renders progress indicator with step information', () => {
		renderWithProviders(<ProgressIndicator activeStep={2} totalSteps={5} progress={60} />);

		expect(screen.getByText('Step 3 of 5')).toBeInTheDocument();
		expect(screen.getByText('60%')).toBeInTheDocument();
	});

	it('displays correct step number (0-based to 1-based conversion)', () => {
		renderWithProviders(<ProgressIndicator activeStep={0} totalSteps={3} progress={33} />);

		expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
	});

	it('displays correct progress percentage', () => {
		renderWithProviders(<ProgressIndicator activeStep={1} totalSteps={4} progress={50} />);

		expect(screen.getByText('50%')).toBeInTheDocument();
	});

	it('renders progress element with correct attributes', () => {
		renderWithProviders(<ProgressIndicator activeStep={2} totalSteps={5} progress={60} />);

		const progressElement = screen.getByRole('progressbar');
		expect(progressElement).toBeInTheDocument();
		expect(progressElement).toHaveAttribute('value', '60');
		expect(progressElement).toHaveAttribute('max', '100');
	});

	it('handles first step correctly', () => {
		renderWithProviders(<ProgressIndicator activeStep={0} totalSteps={5} progress={20} />);

		expect(screen.getByText('Step 1 of 5')).toBeInTheDocument();
		expect(screen.getByText('20%')).toBeInTheDocument();
	});

	it('handles last step correctly', () => {
		renderWithProviders(<ProgressIndicator activeStep={4} totalSteps={5} progress={100} />);

		expect(screen.getByText('Step 5 of 5')).toBeInTheDocument();
		expect(screen.getByText('100%')).toBeInTheDocument();
	});

	it('handles single step wizard', () => {
		renderWithProviders(<ProgressIndicator activeStep={0} totalSteps={1} progress={100} />);

		expect(screen.getByText('Step 1 of 1')).toBeInTheDocument();
		expect(screen.getByText('100%')).toBeInTheDocument();
	});

	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<ProgressIndicator activeStep={2} totalSteps={5} progress={60} />
		);
		await expectA11y(container);
	});
});

describe('ProgressSection', () => {
	it('renders ProgressIndicator when showProgress is true', () => {
		renderWithProviders(
			<ProgressSection showProgress={true} activeStep={2} totalSteps={5} progress={60} />
		);

		expect(screen.getByText('Step 3 of 5')).toBeInTheDocument();
		expect(screen.getByText('60%')).toBeInTheDocument();
	});

	it('returns null when showProgress is false', () => {
		const { container } = renderWithProviders(
			<ProgressSection showProgress={false} activeStep={2} totalSteps={5} progress={60} />
		);

		expect(container.firstChild).toBeNull();
		expect(screen.queryByText('Step 3 of 5')).not.toBeInTheDocument();
	});

	it('passes all props to ProgressIndicator when visible', () => {
		renderWithProviders(
			<ProgressSection showProgress={true} activeStep={1} totalSteps={3} progress={66} />
		);

		expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
		expect(screen.getByText('66%')).toBeInTheDocument();
	});

	it('handles edge case with zero progress', () => {
		renderWithProviders(
			<ProgressSection showProgress={true} activeStep={0} totalSteps={5} progress={0} />
		);

		expect(screen.getByText('Step 1 of 5')).toBeInTheDocument();
		expect(screen.getByText('0%')).toBeInTheDocument();
	});

	it('handles edge case with maximum progress', () => {
		renderWithProviders(
			<ProgressSection showProgress={true} activeStep={4} totalSteps={5} progress={100} />
		);

		expect(screen.getByText('Step 5 of 5')).toBeInTheDocument();
		expect(screen.getByText('100%')).toBeInTheDocument();
	});
});
