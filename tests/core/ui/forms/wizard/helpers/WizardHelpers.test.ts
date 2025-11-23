/**
 * WizardHelpers Tests
 *
 * Tests for wizard helper functions:
 * - useStepperSteps hook
 * - useWizardState hook
 * - createNavigationProps
 * - extractWizardConfig
 */

import type { UseWizardStateReturn } from '@core/ui/forms/wizard/helpers/WizardHelpers';
import {
	createNavigationProps,
	extractWizardConfig,
	useStepperSteps,
	useWizardState,
} from '@core/ui/forms/wizard/helpers/WizardHelpers';
import { useWizard } from '@core/ui/forms/wizard/hooks/useWizard';
import type { WizardProps } from '@src-types/ui/navigation/wizard';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useStepperSteps', () => {
	it('converts steps to stepper steps with content', () => {
		const steps = [
			{ id: 'step1', label: 'Step 1', content: null },
			{ id: 'step2', label: 'Step 2', content: null },
		];

		const { result } = renderHook(() => useStepperSteps({ steps }));

		expect(result.current).toHaveLength(2);
		expect(result.current[0]).toMatchObject({ id: 'step1', label: 'Step 1' });
		expect(result.current[0]?.content).toBe(steps[0]?.content);
		expect(result.current[1]).toMatchObject({ id: 'step2', label: 'Step 2' });
		expect(result.current[1]?.content).toBe(steps[1]?.content);
	});

	it('preserves description when provided', () => {
		const steps = [
			{
				id: 'step1',
				label: 'Step 1',
				description: 'Description 1',
				content: null,
			},
		];

		const { result } = renderHook(() => useStepperSteps({ steps }));

		expect(result.current[0]?.description).toBe('Description 1');
	});

	it('handles empty steps array', () => {
		const { result } = renderHook(() => useStepperSteps({ steps: [] }));
		expect(result.current).toEqual([]);
	});

	it('memoizes result based on steps', () => {
		const initialSteps = [{ id: 'step1', label: 'Step 1', content: null }];
		const { result, rerender } = renderHook(({ steps }) => useStepperSteps({ steps }), {
			initialProps: {
				steps: initialSteps,
			},
		});

		const firstResult = result.current;
		rerender({ steps: initialSteps });
		expect(result.current).toBe(firstResult);

		// Change the step to trigger a new memoized result
		const newSteps = [{ id: 'step1', label: 'Step 1 Updated', content: null }];
		rerender({ steps: newSteps });
		// Verify the content changed
		expect(result.current[0]?.label).toBe('Step 1 Updated');
		expect(result.current[0]?.label).not.toBe(firstResult[0]?.label);
	});
});

describe('useWizardState', () => {
	it('extracts state from wizard hook return', () => {
		const props: WizardProps = {
			steps: [
				{ id: 'step1', label: 'Step 1', content: null },
				{ id: 'step2', label: 'Step 2', content: null },
			],
		};

		const { result: wizardResult } = renderHook(() => useWizard(props));
		const { result } = renderHook(() => useWizardState(wizardResult.current));

		expect(result.current.currentStepIndex).toBe(0);
		expect(result.current.isProcessing).toBe(false);
		expect(result.current.canGoPrevious).toBe(false);
		expect(result.current.isLastStep).toBe(false);
		expect(result.current.canGoNext).toBe(true);
		expect(result.current.currentStep).toBeDefined();
		expect(result.current.currentStepContent).toBeDefined();
	});

	it('extracts current step content', () => {
		const content = null;
		const props: WizardProps = {
			steps: [{ id: 'step1', label: 'Step 1', content }],
		};

		const { result: wizardResult } = renderHook(() => useWizard(props));
		const { result } = renderHook(() => useWizardState(wizardResult.current));

		expect(result.current.currentStepContent).toBe(content);
	});
});

describe('createNavigationProps', () => {
	it('creates navigation props from wizard state', () => {
		const wizardState: UseWizardStateReturn = {
			currentStepIndex: 1,
			isProcessing: false,
			currentStepContent: null,
			wizardProgress: 50,
			canGoPrevious: true,
			isLastStep: false,
			canGoNext: true,
			goToStep: vi.fn(),
			handlePrevious: vi.fn(),
			skipStep: vi.fn(),
			handleComplete: vi.fn(),
			handleNext: vi.fn(),
			currentStep: { skippable: true },
		};

		const navProps = createNavigationProps(wizardState, {
			allowBackNavigation: true,
			size: 'md',
			previousButtonLabel: 'Previous',
			nextButtonLabel: 'Next',
			finishButtonLabel: 'Finish',
		});

		expect(navProps.allowBackNavigation).toBe(true);
		expect(navProps.canGoPrevious).toBe(true);
		expect(navProps.isLastStep).toBe(false);
		expect(navProps.canGoNext).toBe(true);
		expect(navProps.currentStep).toBe(wizardState.currentStep);
		expect(navProps.isProcessing).toBe(false);
		expect(navProps.size).toBe('md');
		expect(navProps.previousButtonLabel).toBe('Previous');
		expect(navProps.nextButtonLabel).toBe('Next');
		expect(navProps.finishButtonLabel).toBe('Finish');
		expect(navProps.onPrevious).toBe(wizardState.handlePrevious);
		expect(navProps.onSkip).toBe(wizardState.skipStep);
		expect(navProps.onNext).toBe(wizardState.handleNext);
		expect(navProps.onComplete).toBe(wizardState.handleComplete);
	});
});

describe('extractWizardConfig', () => {
	it('extracts config with defaults', () => {
		const props: WizardProps = {
			steps: [{ id: 'step1', label: 'Step 1', content: null }],
		};

		const config = extractWizardConfig(props);

		expect(config.steps).toBe(props.steps);
		expect(config.orientation).toBe('horizontal');
		expect(config.size).toBe('md');
		expect(config.showNumbers).toBe(true);
		expect(config.showNavigation).toBe(true);
		expect(config.showProgress).toBe(true);
		expect(config.allowBackNavigation).toBe(true);
	});

	it('overrides defaults with provided props', () => {
		const props: WizardProps = {
			steps: [{ id: 'step1', label: 'Step 1', content: null }],
			orientation: 'vertical',
			size: 'lg',
			showNumbers: false,
			showNavigation: false,
			showProgress: false,
			allowBackNavigation: false,
			className: 'custom-class',
		};

		const config = extractWizardConfig(props);

		expect(config.orientation).toBe('vertical');
		expect(config.size).toBe('lg');
		expect(config.showNumbers).toBe(false);
		expect(config.showNavigation).toBe(false);
		expect(config.showProgress).toBe(false);
		expect(config.allowBackNavigation).toBe(false);
		expect(config.className).toBe('custom-class');
	});

	it('uses i18n for button labels', () => {
		const props: WizardProps = {
			steps: [{ id: 'step1', label: 'Step 1', content: null }],
		};

		const config = extractWizardConfig(props);

		expect(config.nextButtonLabel).toBeTruthy();
		expect(config.previousButtonLabel).toBeTruthy();
		expect(config.finishButtonLabel).toBeTruthy();
	});

	it('allows custom button labels', () => {
		const props: WizardProps = {
			steps: [{ id: 'step1', label: 'Step 1', content: null }],
			nextButtonLabel: 'Custom Next',
			previousButtonLabel: 'Custom Previous',
			finishButtonLabel: 'Custom Finish',
		};

		const config = extractWizardConfig(props);

		expect(config.nextButtonLabel).toBe('Custom Next');
		expect(config.previousButtonLabel).toBe('Custom Previous');
		expect(config.finishButtonLabel).toBe('Custom Finish');
	});
});
