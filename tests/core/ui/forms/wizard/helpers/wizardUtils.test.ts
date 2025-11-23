/**
 * wizardUtils Tests
 *
 * Tests for wizard utility functions:
 * - Progress calculation
 * - Step conversion
 * - Step metadata
 * - Navigation validation
 */

import {
	calculateStepMetadata,
	calculateWizardProgress,
	calculateWizardProgressByCompletion,
	canNavigateToStep,
	convertStepsToStepperSteps,
} from '@core/ui/forms/wizard/helpers/wizardUtils';
import { describe, expect, it } from 'vitest';

describe('calculateWizardProgress', () => {
	it('calculates progress for first step', () => {
		expect(calculateWizardProgress(0, 3)).toBe(33);
	});

	it('calculates progress for middle step', () => {
		expect(calculateWizardProgress(1, 3)).toBe(67);
	});

	it('calculates progress for last step', () => {
		expect(calculateWizardProgress(2, 3)).toBe(100);
	});

	it('handles zero total steps', () => {
		expect(calculateWizardProgress(0, 0)).toBe(0);
	});

	it('handles single step', () => {
		expect(calculateWizardProgress(0, 1)).toBe(100);
	});

	it('rounds progress correctly', () => {
		expect(calculateWizardProgress(1, 3)).toBe(67); // 66.66... rounded
	});
});

describe('calculateWizardProgressByCompletion', () => {
	it('calculates progress based on completed steps', () => {
		const completedSteps = new Set([0, 1]);
		const skippedSteps = new Set<number>();
		expect(calculateWizardProgressByCompletion(3, completedSteps, skippedSteps)).toBe(67);
	});

	it('includes skipped steps in progress', () => {
		const completedSteps = new Set([0]);
		const skippedSteps = new Set([1]);
		expect(calculateWizardProgressByCompletion(3, completedSteps, skippedSteps)).toBe(67);
	});

	it('calculates 100% when all steps completed', () => {
		const completedSteps = new Set([0, 1, 2]);
		const skippedSteps = new Set<number>();
		expect(calculateWizardProgressByCompletion(3, completedSteps, skippedSteps)).toBe(100);
	});

	it('calculates 0% when no steps completed', () => {
		const completedSteps = new Set<number>();
		const skippedSteps = new Set<number>();
		expect(calculateWizardProgressByCompletion(3, completedSteps, skippedSteps)).toBe(0);
	});

	it('handles zero total steps', () => {
		const completedSteps = new Set<number>();
		const skippedSteps = new Set<number>();
		expect(calculateWizardProgressByCompletion(0, completedSteps, skippedSteps)).toBe(0);
	});

	it('rounds progress correctly', () => {
		const completedSteps = new Set([0]);
		const skippedSteps = new Set<number>();
		expect(calculateWizardProgressByCompletion(3, completedSteps, skippedSteps)).toBe(33);
	});
});

describe('convertStepsToStepperSteps', () => {
	it('converts wizard steps to stepper steps', () => {
		const steps = [
			{ id: 'step1', label: 'Step 1', description: 'First step' },
			{ id: 'step2', label: 'Step 2' },
		];
		const result = convertStepsToStepperSteps(steps);
		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({ id: 'step1', label: 'Step 1', description: 'First step' });
		expect(result[1]).toEqual({ id: 'step2', label: 'Step 2' });
	});

	it('handles steps without description', () => {
		const steps = [{ id: 'step1', label: 'Step 1' }];
		const result = convertStepsToStepperSteps(steps);
		expect(result[0]).toEqual({ id: 'step1', label: 'Step 1' });
		expect(result[0]).not.toHaveProperty('description');
	});

	it('handles empty array', () => {
		const result = convertStepsToStepperSteps([]);
		expect(result).toEqual([]);
	});

	it('preserves all required fields', () => {
		const steps = [
			{ id: 'step1', label: 'Step 1', description: 'Description' },
			{ id: 'step2', label: 'Step 2' },
		];
		const result = convertStepsToStepperSteps(steps);
		expect(result[0]?.id).toBe('step1');
		expect(result[0]?.label).toBe('Step 1');
		expect(result[0]?.description).toBe('Description');
		expect(result[1]?.id).toBe('step2');
		expect(result[1]?.label).toBe('Step 2');
	});
});

describe('calculateStepMetadata', () => {
	it('identifies first step', () => {
		const metadata = calculateStepMetadata(0, 3);
		expect(metadata.isFirstStep).toBe(true);
		expect(metadata.isLastStep).toBe(false);
		expect(metadata.progress).toBe(33);
	});

	it('identifies last step', () => {
		const metadata = calculateStepMetadata(2, 3);
		expect(metadata.isFirstStep).toBe(false);
		expect(metadata.isLastStep).toBe(true);
		expect(metadata.progress).toBe(100);
	});

	it('identifies middle step', () => {
		const metadata = calculateStepMetadata(1, 3);
		expect(metadata.isFirstStep).toBe(false);
		expect(metadata.isLastStep).toBe(false);
		expect(metadata.progress).toBe(67);
	});

	it('handles single step', () => {
		const metadata = calculateStepMetadata(0, 1);
		expect(metadata.isFirstStep).toBe(true);
		expect(metadata.isLastStep).toBe(true);
		expect(metadata.progress).toBe(100);
	});
});

describe('canNavigateToStep', () => {
	it('allows navigation to same step (returns false)', () => {
		expect(canNavigateToStep(1, 1, true)).toBe(false);
		expect(canNavigateToStep(1, 1, false)).toBe(false);
	});

	it('allows forward navigation when back navigation is allowed', () => {
		expect(canNavigateToStep(2, 1, true)).toBe(true);
	});

	it('allows forward navigation when back navigation is not allowed', () => {
		expect(canNavigateToStep(2, 1, false)).toBe(true);
	});

	it('allows back navigation when back navigation is allowed', () => {
		expect(canNavigateToStep(0, 1, true)).toBe(true);
	});

	it('prevents back navigation when back navigation is not allowed', () => {
		expect(canNavigateToStep(0, 1, false)).toBe(false);
	});

	it('allows navigation to any step when back navigation is allowed', () => {
		expect(canNavigateToStep(0, 2, true)).toBe(true);
		expect(canNavigateToStep(3, 2, true)).toBe(true);
	});
});
