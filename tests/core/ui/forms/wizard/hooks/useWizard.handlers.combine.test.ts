/**
 * useWizard.handlers.combine Tests
 *
 * Tests for handler combination:
 * - All handlers are combined correctly
 */

import { combineAllHandlers } from '@core/ui/forms/wizard/hooks/useWizard.handlers.combine';
import type { CombineHandlersParams } from '@core/ui/forms/wizard/types/useWizard.handlers.groups.types';
import { describe, expect, it, vi } from 'vitest';

describe('combineAllHandlers', () => {
	it('combines all handler groups', () => {
		const validation = {
			validateCurrentStep: vi.fn(),
			markRemainingStepsAsSkipped: vi.fn(),
		};

		const actions = {
			handleComplete: vi.fn(),
			handleCancel: vi.fn(),
		};

		const basicNav = {
			handleNext: vi.fn(),
			handlePrevious: vi.fn(),
		};

		const advancedNav = {
			goToStep: vi.fn(),
			skipStep: vi.fn(),
		};

		const params: CombineHandlersParams = {
			validation,
			actions,
			basicNav,
			advancedNav,
		};

		const result = combineAllHandlers(params);

		expect(result.validateCurrentStep).toBe(validation.validateCurrentStep);
		expect(result.handleComplete).toBe(actions.handleComplete);
		expect(result.handleNext).toBe(basicNav.handleNext);
		expect(result.handlePrevious).toBe(basicNav.handlePrevious);
		expect(result.goToStep).toBe(advancedNav.goToStep);
		expect(result.skipStep).toBe(advancedNav.skipStep);
		expect(result.handleCancel).toBe(actions.handleCancel);
	});

	it('returns all expected handlers', () => {
		const params: CombineHandlersParams = {
			validation: {
				validateCurrentStep: vi.fn(),
				markRemainingStepsAsSkipped: vi.fn(),
			},
			actions: {
				handleComplete: vi.fn(),
				handleCancel: vi.fn(),
			},
			basicNav: {
				handleNext: vi.fn(),
				handlePrevious: vi.fn(),
			},
			advancedNav: {
				goToStep: vi.fn(),
				skipStep: vi.fn(),
			},
		};

		const result = combineAllHandlers(params);

		expect(result).toHaveProperty('validateCurrentStep');
		expect(result).toHaveProperty('handleComplete');
		expect(result).toHaveProperty('handleCancel');
		expect(result).toHaveProperty('handleNext');
		expect(result).toHaveProperty('handlePrevious');
		expect(result).toHaveProperty('goToStep');
		expect(result).toHaveProperty('skipStep');
	});
});
