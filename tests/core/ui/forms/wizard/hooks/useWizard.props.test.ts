/**
 * useWizard.props Tests
 *
 * Tests for wizard props extraction:
 * - Default values
 * - Prop overrides
 * - Controlled vs uncontrolled
 */

import { extractWizardProps } from '@core/ui/forms/wizard/hooks/useWizard.props';
import type { WizardProps } from '@src-types/ui/navigation/wizard';
import { describe, expect, it, vi } from 'vitest';

describe('extractWizardProps', () => {
	it('extracts props with defaults', () => {
		const props: WizardProps = {
			steps: [{ id: 'step1', label: 'Step 1', content: null }],
		};

		const result = extractWizardProps(props);

		expect(result.steps).toBe(props.steps);
		expect(result.initialStep).toBe(0);
		expect(result.controlledStep).toBeUndefined();
		expect(result.orientation).toBe('horizontal');
		expect(result.size).toBe('md');
		expect(result.showNumbers).toBe(true);
		expect(result.showNavigation).toBe(true);
		expect(result.showProgress).toBe(true);
		expect(result.allowBackNavigation).toBe(true);
	});

	it('overrides defaults with provided props', () => {
		const props: WizardProps = {
			steps: [{ id: 'step1', label: 'Step 1', content: null }],
			initialStep: 2,
			activeStep: 1,
			orientation: 'vertical',
			size: 'lg',
			showNumbers: false,
			showNavigation: false,
			showProgress: false,
			allowBackNavigation: false,
			className: 'custom-class',
		};

		const result = extractWizardProps(props);

		expect(result.initialStep).toBe(2);
		expect(result.controlledStep).toBe(1);
		expect(result.orientation).toBe('vertical');
		expect(result.size).toBe('lg');
		expect(result.showNumbers).toBe(false);
		expect(result.showNavigation).toBe(false);
		expect(result.showProgress).toBe(false);
		expect(result.allowBackNavigation).toBe(false);
		expect(result.className).toBe('custom-class');
	});

	it('extracts button labels', () => {
		const props: WizardProps = {
			steps: [{ id: 'step1', label: 'Step 1', content: null }],
			nextButtonLabel: 'Custom Next',
			previousButtonLabel: 'Custom Previous',
			finishButtonLabel: 'Custom Finish',
		};

		const result = extractWizardProps(props);

		expect(result.nextButtonLabel).toBe('Custom Next');
		expect(result.previousButtonLabel).toBe('Custom Previous');
		expect(result.finishButtonLabel).toBe('Custom Finish');
	});

	it('uses default button labels when not provided', () => {
		const props: WizardProps = {
			steps: [{ id: 'step1', label: 'Step 1', content: null }],
		};

		const result = extractWizardProps(props);

		expect(result.nextButtonLabel).toBe('Next');
		expect(result.previousButtonLabel).toBe('Previous');
		expect(result.finishButtonLabel).toBe('Finish');
	});

	it('extracts callbacks', () => {
		const onStepChange = vi.fn();
		const onComplete = vi.fn();
		const onCancel = vi.fn();

		const props: WizardProps = {
			steps: [{ id: 'step1', label: 'Step 1', content: null }],
			onStepChange,
			onComplete,
			onCancel,
		};

		const result = extractWizardProps(props);

		expect(result.onStepChange).toBe(onStepChange);
		expect(result.onComplete).toBe(onComplete);
		expect(result.onCancel).toBe(onCancel);
	});

	it('extracts formData', () => {
		const formData = { field: 'value' };

		const props: WizardProps = {
			steps: [{ id: 'step1', label: 'Step 1', content: null }],
			formData,
		};

		const result = extractWizardProps(props);

		expect(result.formData).toBe(formData);
	});

	it('extracts rest props', () => {
		const props = {
			steps: [{ id: 'step1', label: 'Step 1', content: null }],
			'data-testid': 'wizard',
			'aria-label': 'Test Wizard',
		} as WizardProps & { 'data-testid'?: string; 'aria-label'?: string };

		const result = extractWizardProps(props);

		expect((result.rest as Record<string, unknown>)['data-testid']).toBe('wizard');
		expect(result.rest['aria-label']).toBe('Test Wizard');
	});
});
