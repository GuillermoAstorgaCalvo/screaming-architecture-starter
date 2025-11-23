/**
 * useWizard.handlers.navigation Tests
 *
 * Tests for navigation handler functions:
 * - Step navigation
 * - Step change callbacks
 */

import { navigateToStep } from '@core/ui/forms/wizard/hooks/useWizard.handlers.navigation';
import type { UseWizardStateReturn } from '@core/ui/forms/wizard/types/useWizard.state.types';
import { describe, expect, it, vi } from 'vitest';

describe('navigateToStep', () => {
	it('sets current step in state', () => {
		const setCurrentStep = vi.fn();
		const state = {
			setCurrentStep,
		} as unknown as UseWizardStateReturn;

		navigateToStep(2, state);

		expect(setCurrentStep).toHaveBeenCalledWith(2);
	});

	it('calls onStepChange callback when provided', () => {
		const setCurrentStep = vi.fn();
		const onStepChange = vi.fn();
		const state = {
			setCurrentStep,
		} as unknown as UseWizardStateReturn;

		navigateToStep(1, state, onStepChange);

		expect(setCurrentStep).toHaveBeenCalledWith(1);
		expect(onStepChange).toHaveBeenCalledWith(1);
	});

	it('does not call onStepChange when not provided', () => {
		const setCurrentStep = vi.fn();
		const state = {
			setCurrentStep,
		} as unknown as UseWizardStateReturn;

		navigateToStep(3, state);

		expect(setCurrentStep).toHaveBeenCalledWith(3);
	});

	it('handles step index 0', () => {
		const setCurrentStep = vi.fn();
		const state = {
			setCurrentStep,
		} as unknown as UseWizardStateReturn;

		navigateToStep(0, state);

		expect(setCurrentStep).toHaveBeenCalledWith(0);
	});

	it('handles negative step index', () => {
		const setCurrentStep = vi.fn();
		const state = {
			setCurrentStep,
		} as unknown as UseWizardStateReturn;

		navigateToStep(-1, state);

		expect(setCurrentStep).toHaveBeenCalledWith(-1);
	});
});
