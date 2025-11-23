/**
 * useWizard.handlers.validation Tests
 *
 * Tests for validation handler functions:
 * - Step validation
 * - Validation result handling
 * - Navigation validation
 */

import {
	canNavigateFromStep,
	markStepAsCompletedIfValid,
	shouldValidateStep,
	validateStep,
} from '@core/ui/forms/wizard/hooks/useWizard.handlers.validation';
import type { WizardStepConfig } from '@src-types/ui/navigation/wizard';
import { describe, expect, it, vi } from 'vitest';

describe('validateStep', () => {
	it('returns valid when no validator provided', async () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
		};

		const result = await validateStep(step);
		expect(result.isValid).toBe(true);
		expect(result.error).toBeUndefined();
	});

	it('returns valid when validator returns true', async () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
			validate: vi.fn().mockResolvedValue(true),
		};

		const result = await validateStep(step, { field: 'value' });
		expect(result.isValid).toBe(true);
		expect(result.error).toBeUndefined();
		expect(step.validate).toHaveBeenCalledWith({ field: 'value' });
	});

	it('returns invalid when validator returns false', async () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
			validate: vi.fn().mockResolvedValue(false),
		};

		const result = await validateStep(step);
		expect(result.isValid).toBe(false);
		expect(result.error).toBeTruthy();
	});

	it('handles validation errors', async () => {
		const errorMessage = 'Validation error';
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
			validate: vi.fn().mockRejectedValue(new Error(errorMessage)),
		};

		const result = await validateStep(step);
		expect(result.isValid).toBe(false);
		expect(result.error).toBe(errorMessage);
	});

	it('handles non-Error exceptions', async () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
			validate: vi.fn().mockRejectedValue('String error'),
		};

		const result = await validateStep(step);
		expect(result.isValid).toBe(false);
		expect(result.error).toBeTruthy();
	});

	it('uses empty object when formData is undefined', async () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
			validate: vi.fn().mockResolvedValue(true),
		};

		await validateStep(step);
		expect(step.validate).toHaveBeenCalledWith({});
	});
});

describe('shouldValidateStep', () => {
	it('returns true when step is undefined', () => {
		expect(shouldValidateStep(undefined)).toBe(true);
	});

	it('returns true when validateOnChange is not set', () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
		};
		expect(shouldValidateStep(step)).toBe(true);
	});

	it('returns true when validateOnChange is true', () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
			validateOnChange: true,
		};
		expect(shouldValidateStep(step)).toBe(true);
	});

	it('returns false when validateOnChange is false', () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
			validateOnChange: false,
		};
		expect(shouldValidateStep(step)).toBe(false);
	});
});

describe('canNavigateFromStep', () => {
	it('allows navigation when step is valid', () => {
		expect(canNavigateFromStep(true, undefined)).toBe(true);
	});

	it('allows navigation when step is optional', () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
			optional: true,
		};
		expect(canNavigateFromStep(false, step)).toBe(true);
	});

	it('prevents navigation when step is invalid and not optional', () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
			optional: false,
		};
		expect(canNavigateFromStep(false, step)).toBe(false);
	});

	it('allows navigation when step is valid even if not optional', () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
			optional: false,
		};
		expect(canNavigateFromStep(true, step)).toBe(true);
	});
});

describe('markStepAsCompletedIfValid', () => {
	it('marks step as completed when valid and not optional', () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
			optional: false,
		};

		const state = {
			isStepValid: vi.fn().mockReturnValue(true),
			markStepCompleted: vi.fn(),
		} as unknown as Parameters<typeof markStepAsCompletedIfValid>[2];

		markStepAsCompletedIfValid(step, 0, state);

		expect(state.isStepValid).toHaveBeenCalledWith(0);
		expect(state.markStepCompleted).toHaveBeenCalledWith(0);
	});

	it('does not mark step when invalid', () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
			optional: false,
		};

		const state = {
			isStepValid: vi.fn().mockReturnValue(false),
			markStepCompleted: vi.fn(),
		} as unknown as Parameters<typeof markStepAsCompletedIfValid>[2];

		markStepAsCompletedIfValid(step, 0, state);

		expect(state.markStepCompleted).not.toHaveBeenCalled();
	});

	it('does not mark step when optional', () => {
		const step: WizardStepConfig = {
			id: 'step1',
			label: 'Step 1',
			content: null,
			optional: true,
		};

		const state = {
			isStepValid: vi.fn().mockReturnValue(true),
			markStepCompleted: vi.fn(),
		} as unknown as Parameters<typeof markStepAsCompletedIfValid>[2];

		markStepAsCompletedIfValid(step, 0, state);

		expect(state.markStepCompleted).not.toHaveBeenCalled();
	});

	it('handles undefined step', () => {
		const state = {
			isStepValid: vi.fn(),
			markStepCompleted: vi.fn(),
		} as unknown as Parameters<typeof markStepAsCompletedIfValid>[2];

		markStepAsCompletedIfValid(undefined, 0, state);

		expect(state.markStepCompleted).not.toHaveBeenCalled();
	});
});
