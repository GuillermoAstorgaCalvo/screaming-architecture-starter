/**
 * FormWizardView.props Tests
 *
 * Tests for the extractWizardProps function including:
 * - Extracting props with all defaults
 * - Extracting props with custom values
 * - Handling undefined values
 * - Preserving restProps
 */

import { extractWizardProps } from '@core/ui/forms/form-wizard/components/FormWizardView.props';
import type { FormWizardProps } from '@core/ui/forms/form-wizard/types/FormWizardTypes';
import { describe, expect, it } from 'vitest';

interface TestFormData {
	name: string;
	email: string;
}

describe('extractWizardProps', () => {
	it('extracts props with all default values', () => {
		const props: Omit<FormWizardProps<TestFormData>, 'steps' | 'formOptions'> = {};

		const result = extractWizardProps(props);

		expect(result.orientation).toBe('horizontal');
		expect(result.size).toBe('md');
		expect(result.showNumbers).toBe(true);
		expect(result.showNavigation).toBe(true);
		expect(result.nextButtonLabel).toBe('Next');
		expect(result.previousButtonLabel).toBe('Previous');
		expect(result.finishButtonLabel).toBe('Finish');
		expect(result.showProgress).toBe(true);
		expect(result.allowBackNavigation).toBe(true);
		expect(result.className).toBeUndefined();
	});

	it('extracts props with custom orientation', () => {
		const props: Omit<FormWizardProps<TestFormData>, 'steps' | 'formOptions'> = {
			orientation: 'vertical',
		};

		const result = extractWizardProps(props);

		expect(result.orientation).toBe('vertical');
		expect(result.size).toBe('md');
	});

	it('extracts props with custom size', () => {
		const props: Omit<FormWizardProps<TestFormData>, 'steps' | 'formOptions'> = {
			size: 'lg',
		};

		const result = extractWizardProps(props);

		expect(result.size).toBe('lg');
		expect(result.orientation).toBe('horizontal');
	});

	it('extracts props with custom showNumbers', () => {
		const props: Omit<FormWizardProps<TestFormData>, 'steps' | 'formOptions'> = {
			showNumbers: false,
		};

		const result = extractWizardProps(props);

		expect(result.showNumbers).toBe(false);
	});

	it('extracts props with custom showNavigation', () => {
		const props: Omit<FormWizardProps<TestFormData>, 'steps' | 'formOptions'> = {
			showNavigation: false,
		};

		const result = extractWizardProps(props);

		expect(result.showNavigation).toBe(false);
	});

	it('extracts props with custom button labels', () => {
		const props: Omit<FormWizardProps<TestFormData>, 'steps' | 'formOptions'> = {
			nextButtonLabel: 'Continue',
			previousButtonLabel: 'Back',
			finishButtonLabel: 'Submit',
		};

		const result = extractWizardProps(props);

		expect(result.nextButtonLabel).toBe('Continue');
		expect(result.previousButtonLabel).toBe('Back');
		expect(result.finishButtonLabel).toBe('Submit');
	});

	it('extracts props with custom showProgress', () => {
		const props: Omit<FormWizardProps<TestFormData>, 'steps' | 'formOptions'> = {
			showProgress: false,
		};

		const result = extractWizardProps(props);

		expect(result.showProgress).toBe(false);
	});

	it('extracts props with custom allowBackNavigation', () => {
		const props: Omit<FormWizardProps<TestFormData>, 'steps' | 'formOptions'> = {
			allowBackNavigation: false,
		};

		const result = extractWizardProps(props);

		expect(result.allowBackNavigation).toBe(false);
	});

	it('extracts props with custom className', () => {
		const props: Omit<FormWizardProps<TestFormData>, 'steps' | 'formOptions'> = {
			className: 'custom-wizard-class',
		};

		const result = extractWizardProps(props);

		expect(result.className).toBe('custom-wizard-class');
	});

	it('preserves restProps', () => {
		const props: Omit<FormWizardProps<TestFormData>, 'steps' | 'formOptions'> = {
			'data-testid': 'wizard',
			'aria-label': 'Test wizard',
		} as any;

		const result = extractWizardProps(props);

		expect(result.restProps).toEqual({
			'data-testid': 'wizard',
			'aria-label': 'Test wizard',
		});
	});

	it('handles all custom props together', () => {
		const props: Omit<FormWizardProps<TestFormData>, 'steps' | 'formOptions'> = {
			orientation: 'vertical',
			size: 'sm',
			showNumbers: false,
			showNavigation: false,
			nextButtonLabel: 'Continue',
			previousButtonLabel: 'Back',
			finishButtonLabel: 'Submit',
			showProgress: false,
			allowBackNavigation: false,
			className: 'custom-class',
			'data-testid': 'wizard',
		} as any;

		const result = extractWizardProps(props);

		expect(result.orientation).toBe('vertical');
		expect(result.size).toBe('sm');
		expect(result.showNumbers).toBe(false);
		expect(result.showNavigation).toBe(false);
		expect(result.nextButtonLabel).toBe('Continue');
		expect(result.previousButtonLabel).toBe('Back');
		expect(result.finishButtonLabel).toBe('Submit');
		expect(result.showProgress).toBe(false);
		expect(result.allowBackNavigation).toBe(false);
		expect(result.className).toBe('custom-class');
		expect(result.restProps).toEqual({
			'data-testid': 'wizard',
		});
	});

	it('excludes extracted props from restProps', () => {
		const props: Omit<FormWizardProps<TestFormData>, 'steps' | 'formOptions'> = {
			orientation: 'vertical',
			size: 'lg',
			className: 'test-class',
			'data-testid': 'wizard',
		} as any;

		const result = extractWizardProps(props);

		expect(result.restProps).not.toHaveProperty('orientation');
		expect(result.restProps).not.toHaveProperty('size');
		expect(result.restProps).not.toHaveProperty('className');
		expect(result.restProps).toHaveProperty('data-testid', 'wizard');
	});
});
