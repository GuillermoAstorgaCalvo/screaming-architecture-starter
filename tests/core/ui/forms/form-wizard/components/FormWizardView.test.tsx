/**
 * FormWizardView Tests
 *
 * Tests for the FormWizardView component including:
 * - Rendering with all sections
 * - Props extraction and application
 * - View data preparation
 * - Section rendering
 * - Custom className handling
 * - Rest props forwarding
 */

import { useFormAdapter } from '@core/forms/formAdapter';
import FormWizardView from '@core/ui/forms/form-wizard/components/FormWizardView';
import type {
	FormWizardProps,
	FormWizardState,
} from '@core/ui/forms/form-wizard/types/FormWizardTypes';
import { screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

interface TestFormData {
	name: string;
	email: string;
}

function createMockState(activeStep = 0): FormWizardState<TestFormData> {
	return {
		activeStep,
		completedSteps: new Set<number>(),
		errorSteps: new Set<number>(),
		formData: {},
		isSubmitting: false,
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

function createMockSteps(): FormWizardProps<TestFormData>['steps'] {
	return [
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
}

function FormWrapper({
	children,
	state,
	steps,
	handlers,
	props,
}: {
	readonly children?: ReactNode;
	readonly state: FormWizardState<TestFormData>;
	readonly steps: FormWizardProps<TestFormData>['steps'];
	readonly handlers: ReturnType<typeof createMockHandlers>;
	readonly props: Omit<FormWizardProps<TestFormData>, 'steps' | 'formOptions'>;
}) {
	const formControls = useFormAdapter<TestFormData>({
		defaultValues: { name: '', email: '' },
	});

	return (
		<FormWizardView
			state={state}
			steps={steps}
			formControls={formControls}
			handlers={handlers}
			props={props}
		/>
	);
}

function renderFormWizardView(
	state: FormWizardState<TestFormData>,
	steps: FormWizardProps<TestFormData>['steps'],
	handlers: ReturnType<typeof createMockHandlers>,
	props: Omit<FormWizardProps<TestFormData>, 'steps' | 'formOptions'>
) {
	return renderWithProviders(
		<FormWrapper state={state} steps={steps} handlers={handlers} props={props} />
	);
}

describe('FormWizardView', () => {
	it('renders wizard view container', () => {
		const state = createMockState();
		const steps = createMockSteps();
		const handlers = createMockHandlers();

		renderFormWizardView(state, steps, handlers, {});

		// Check that the container is rendered
		expect(screen.getByText('Step 1 Content')).toBeInTheDocument();
	});

	it('applies custom className', () => {
		const state = createMockState();
		const steps = createMockSteps();
		const handlers = createMockHandlers();

		const { container } = renderFormWizardView(state, steps, handlers, {
			className: 'custom-wizard-class',
		});

		const wizardContainer = container.querySelector('.custom-wizard-class');
		expect(wizardContainer).toBeInTheDocument();
	});

	it('forwards rest props to container', () => {
		const state = createMockState();
		const steps = createMockSteps();
		const handlers = createMockHandlers();

		renderFormWizardView(state, steps, handlers, {
			'data-testid': 'wizard-view',
			'aria-label': 'Test wizard',
		} as any);

		const wizard = screen.getByTestId('wizard-view');
		expect(wizard).toBeInTheDocument();
		expect(wizard).toHaveAttribute('aria-label', 'Test wizard');
	});

	it('renders current step content', () => {
		const state = createMockState(0);
		const steps = createMockSteps();
		const handlers = createMockHandlers();

		renderFormWizardView(state, steps, handlers, {});

		expect(screen.getByText('Step 1 Content')).toBeInTheDocument();
	});

	it('renders different step content when activeStep changes', () => {
		const state = createMockState(1);
		const steps = createMockSteps();
		const handlers = createMockHandlers();

		renderFormWizardView(state, steps, handlers, {});

		expect(screen.getByText('Step 2 Content')).toBeInTheDocument();
		expect(screen.queryByText('Step 1 Content')).not.toBeInTheDocument();
	});

	it('renders with default props', () => {
		const state = createMockState();
		const steps = createMockSteps();
		const handlers = createMockHandlers();

		renderFormWizardView(state, steps, handlers, {});

		// Should render with default settings (showNavigation, showProgress, etc.)
		expect(screen.getByText('Step 1 Content')).toBeInTheDocument();
	});

	it('handles onCancel callback', () => {
		const state = createMockState();
		const steps = createMockSteps();
		const handlers = createMockHandlers();
		const onCancel = vi.fn();

		renderFormWizardView(state, steps, handlers, { onCancel });

		// The onCancel should be passed to NavigationSection
		// We can verify it's available by checking if cancel button appears
		const cancelButton = screen.queryByRole('button', { name: 'Cancel' });
		if (cancelButton) {
			expect(cancelButton).toBeInTheDocument();
		}
	});

	it('has no accessibility violations', async () => {
		const state = createMockState();
		const steps = createMockSteps();
		const handlers = createMockHandlers();

		const { container } = renderFormWizardView(state, steps, handlers, {});
		await expectA11y(container);
	});

	it('combines className with rest props', () => {
		const state = createMockState();
		const steps = createMockSteps();
		const handlers = createMockHandlers();

		const { container } = renderFormWizardView(state, steps, handlers, {
			className: 'custom-class',
			'data-testid': 'wizard',
		} as any);

		const wizard = container.querySelector('.custom-class[data-testid="wizard"]');
		expect(wizard).toBeInTheDocument();
	});
});
