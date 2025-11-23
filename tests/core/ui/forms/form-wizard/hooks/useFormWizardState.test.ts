/**
 * useFormWizardState Tests
 *
 * Tests for the useFormWizardState hook including:
 * - State initialization
 * - State persistence
 * - State handlers
 * - State updates
 * - Reset functionality
 */

import { useFormWizardState } from '@core/ui/forms/form-wizard/hooks/useFormWizardState';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

interface TestFormData {
	name: string;
	email: string;
	age?: number;
}

describe('useFormWizardState', () => {
	beforeEach(() => {
		if (globalThis.window !== undefined && globalThis.window.localStorage) {
			globalThis.window.localStorage.clear();
		}
	});

	describe('initialization', () => {
		it('initializes with default values', () => {
			const steps = [
				{ id: 'step1', label: 'Step 1', content: () => null },
				{ id: 'step2', label: 'Step 2', content: () => null },
			];

			const { result } = renderHook(() =>
				useFormWizardState<TestFormData>({
					initialStep: 0,
					persistData: false,
					persistKey: 'test-key',
					steps,
				})
			);

			expect(result.current.state.activeStep).toBe(0);
			expect(result.current.state.completedSteps).toEqual(new Set());
			expect(result.current.state.errorSteps).toEqual(new Set());
			expect(result.current.state.formData).toEqual({});
			expect(result.current.state.isSubmitting).toBe(false);
		});

		it('initializes with custom initial step', () => {
			const steps = [
				{ id: 'step1', label: 'Step 1', content: () => null },
				{ id: 'step2', label: 'Step 2', content: () => null },
				{ id: 'step3', label: 'Step 3', content: () => null },
			];

			const { result } = renderHook(() =>
				useFormWizardState<TestFormData>({
					initialStep: 2,
					persistData: false,
					persistKey: 'test-key',
					steps,
				})
			);

			expect(result.current.state.activeStep).toBe(2);
		});

		it('loads persisted state when persistence is enabled', () => {
			const persistedData = {
				activeStep: 1,
				formData: { name: 'John', email: 'john@example.com' },
				completedSteps: [0],
			};

			if (globalThis.window !== undefined && globalThis.window.localStorage) {
				globalThis.window.localStorage.setItem('test-key', JSON.stringify(persistedData));
			}

			const steps = [
				{ id: 'step1', label: 'Step 1', content: () => null },
				{ id: 'step2', label: 'Step 2', content: () => null },
			];

			const { result } = renderHook(() =>
				useFormWizardState<TestFormData>({
					initialStep: 0,
					persistData: true,
					persistKey: 'test-key',
					steps,
				})
			);

			expect(result.current.state.activeStep).toBe(1);
			expect(result.current.state.completedSteps).toEqual(new Set([0]));
			expect(result.current.state.formData).toEqual(persistedData.formData);
		});

		it('returns all required handlers', () => {
			const steps = [{ id: 'step1', label: 'Step 1', content: () => null }];

			const { result } = renderHook(() =>
				useFormWizardState<TestFormData>({
					initialStep: 0,
					persistData: false,
					persistKey: 'test-key',
					steps,
				})
			);

			expect(typeof result.current.setActiveStep).toBe('function');
			expect(typeof result.current.markStepCompleted).toBe('function');
			expect(typeof result.current.markStepError).toBe('function');
			expect(typeof result.current.clearStepError).toBe('function');
			expect(typeof result.current.updateFormData).toBe('function');
			expect(typeof result.current.setIsSubmitting).toBe('function');
			expect(typeof result.current.reset).toBe('function');
		});
	});

	describe('setActiveStep', () => {
		it('sets active step within valid range', () => {
			const steps = [
				{ id: 'step1', label: 'Step 1', content: () => null },
				{ id: 'step2', label: 'Step 2', content: () => null },
				{ id: 'step3', label: 'Step 3', content: () => null },
			];

			const { result } = renderHook(() =>
				useFormWizardState<TestFormData>({
					initialStep: 0,
					persistData: false,
					persistKey: 'test-key',
					steps,
				})
			);

			act(() => {
				result.current.setActiveStep(2);
			});

			expect(result.current.state.activeStep).toBe(2);
		});

		it('does not set step outside valid range', () => {
			const steps = [
				{ id: 'step1', label: 'Step 1', content: () => null },
				{ id: 'step2', label: 'Step 2', content: () => null },
			];

			const { result } = renderHook(() =>
				useFormWizardState<TestFormData>({
					initialStep: 0,
					persistData: false,
					persistKey: 'test-key',
					steps,
				})
			);

			act(() => {
				result.current.setActiveStep(-1);
			});

			expect(result.current.state.activeStep).toBe(0);

			act(() => {
				result.current.setActiveStep(10);
			});

			expect(result.current.state.activeStep).toBe(0);
		});
	});

	describe('markStepCompleted', () => {
		it('adds step to completed steps', () => {
			const steps = [
				{ id: 'step1', label: 'Step 1', content: () => null },
				{ id: 'step2', label: 'Step 2', content: () => null },
			];

			const { result } = renderHook(() =>
				useFormWizardState<TestFormData>({
					initialStep: 0,
					persistData: false,
					persistKey: 'test-key',
					steps,
				})
			);

			act(() => {
				result.current.markStepCompleted(0);
			});

			expect(result.current.state.completedSteps.has(0)).toBe(true);
		});

		it('removes step from error steps when marking as completed', () => {
			const steps = [
				{ id: 'step1', label: 'Step 1', content: () => null },
				{ id: 'step2', label: 'Step 2', content: () => null },
			];

			const { result } = renderHook(() =>
				useFormWizardState<TestFormData>({
					initialStep: 0,
					persistData: false,
					persistKey: 'test-key',
					steps,
				})
			);

			act(() => {
				result.current.markStepError(0);
			});

			expect(result.current.state.errorSteps.has(0)).toBe(true);

			act(() => {
				result.current.markStepCompleted(0);
			});

			expect(result.current.state.completedSteps.has(0)).toBe(true);
			expect(result.current.state.errorSteps.has(0)).toBe(false);
		});

		it('handles multiple completed steps', () => {
			const steps = [
				{ id: 'step1', label: 'Step 1', content: () => null },
				{ id: 'step2', label: 'Step 2', content: () => null },
				{ id: 'step3', label: 'Step 3', content: () => null },
			];

			const { result } = renderHook(() =>
				useFormWizardState<TestFormData>({
					initialStep: 0,
					persistData: false,
					persistKey: 'test-key',
					steps,
				})
			);

			act(() => {
				result.current.markStepCompleted(0);
				result.current.markStepCompleted(1);
				result.current.markStepCompleted(2);
			});

			expect(result.current.state.completedSteps.size).toBe(3);
			expect(result.current.state.completedSteps.has(0)).toBe(true);
			expect(result.current.state.completedSteps.has(1)).toBe(true);
			expect(result.current.state.completedSteps.has(2)).toBe(true);
		});
	});

	describe('markStepError', () => {
		it('adds step to error steps', () => {
			const steps = [
				{ id: 'step1', label: 'Step 1', content: () => null },
				{ id: 'step2', label: 'Step 2', content: () => null },
			];

			const { result } = renderHook(() =>
				useFormWizardState<TestFormData>({
					initialStep: 0,
					persistData: false,
					persistKey: 'test-key',
					steps,
				})
			);

			act(() => {
				result.current.markStepError(1);
			});

			expect(result.current.state.errorSteps.has(1)).toBe(true);
		});

		it('handles multiple error steps', () => {
			const steps = [
				{ id: 'step1', label: 'Step 1', content: () => null },
				{ id: 'step2', label: 'Step 2', content: () => null },
				{ id: 'step3', label: 'Step 3', content: () => null },
			];

			const { result } = renderHook(() =>
				useFormWizardState<TestFormData>({
					initialStep: 0,
					persistData: false,
					persistKey: 'test-key',
					steps,
				})
			);

			act(() => {
				result.current.markStepError(0);
				result.current.markStepError(2);
			});

			expect(result.current.state.errorSteps.size).toBe(2);
			expect(result.current.state.errorSteps.has(0)).toBe(true);
			expect(result.current.state.errorSteps.has(2)).toBe(true);
		});
	});

	describe('clearStepError', () => {
		it('removes step from error steps', () => {
			const steps = [
				{ id: 'step1', label: 'Step 1', content: () => null },
				{ id: 'step2', label: 'Step 2', content: () => null },
			];

			const { result } = renderHook(() =>
				useFormWizardState<TestFormData>({
					initialStep: 0,
					persistData: false,
					persistKey: 'test-key',
					steps,
				})
			);

			act(() => {
				result.current.markStepError(0);
			});

			expect(result.current.state.errorSteps.has(0)).toBe(true);

			act(() => {
				result.current.clearStepError(0);
			});

			expect(result.current.state.errorSteps.has(0)).toBe(false);
		});

		it('does not affect other error steps', () => {
			const steps = [
				{ id: 'step1', label: 'Step 1', content: () => null },
				{ id: 'step2', label: 'Step 2', content: () => null },
				{ id: 'step3', label: 'Step 3', content: () => null },
			];

			const { result } = renderHook(() =>
				useFormWizardState<TestFormData>({
					initialStep: 0,
					persistData: false,
					persistKey: 'test-key',
					steps,
				})
			);

			act(() => {
				result.current.markStepError(0);
				result.current.markStepError(1);
				result.current.markStepError(2);
			});

			act(() => {
				result.current.clearStepError(1);
			});

			expect(result.current.state.errorSteps.has(0)).toBe(true);
			expect(result.current.state.errorSteps.has(1)).toBe(false);
			expect(result.current.state.errorSteps.has(2)).toBe(true);
		});
	});

	describe('updateFormData', () => {
		it('updates form data', () => {
			const steps = [{ id: 'step1', label: 'Step 1', content: () => null }];

			const { result } = renderHook(() =>
				useFormWizardState<TestFormData>({
					initialStep: 0,
					persistData: false,
					persistKey: 'test-key',
					steps,
				})
			);

			act(() => {
				result.current.updateFormData({ name: 'John' });
			});

			expect(result.current.state.formData).toEqual({ name: 'John' });
		});

		it('merges form data with existing data', () => {
			const steps = [{ id: 'step1', label: 'Step 1', content: () => null }];

			const { result } = renderHook(() =>
				useFormWizardState<TestFormData>({
					initialStep: 0,
					persistData: false,
					persistKey: 'test-key',
					steps,
				})
			);

			act(() => {
				result.current.updateFormData({ name: 'John' });
			});

			act(() => {
				result.current.updateFormData({ email: 'john@example.com' });
			});

			expect(result.current.state.formData).toEqual({
				name: 'John',
				email: 'john@example.com',
			});
		});

		it('overwrites existing fields when updating', () => {
			const steps = [{ id: 'step1', label: 'Step 1', content: () => null }];

			const { result } = renderHook(() =>
				useFormWizardState<TestFormData>({
					initialStep: 0,
					persistData: false,
					persistKey: 'test-key',
					steps,
				})
			);

			act(() => {
				result.current.updateFormData({ name: 'John' });
			});

			act(() => {
				result.current.updateFormData({ name: 'Jane' });
			});

			expect(result.current.state.formData).toEqual({ name: 'Jane' });
		});
	});

	describe('setIsSubmitting', () => {
		it('sets isSubmitting state', () => {
			const steps = [{ id: 'step1', label: 'Step 1', content: () => null }];

			const { result } = renderHook(() =>
				useFormWizardState<TestFormData>({
					initialStep: 0,
					persistData: false,
					persistKey: 'test-key',
					steps,
				})
			);

			act(() => {
				result.current.setIsSubmitting(true);
			});

			expect(result.current.state.isSubmitting).toBe(true);

			act(() => {
				result.current.setIsSubmitting(false);
			});

			expect(result.current.state.isSubmitting).toBe(false);
		});
	});

	describe('reset', () => {
		it('resets state to initial values', () => {
			const steps = [
				{ id: 'step1', label: 'Step 1', content: () => null },
				{ id: 'step2', label: 'Step 2', content: () => null },
			];

			const { result } = renderHook(() =>
				useFormWizardState<TestFormData>({
					initialStep: 0,
					persistData: false,
					persistKey: 'test-key',
					steps,
				})
			);

			act(() => {
				result.current.setActiveStep(1);
				result.current.markStepCompleted(0);
				result.current.markStepError(1);
				result.current.updateFormData({ name: 'John' });
				result.current.setIsSubmitting(true);
			});

			act(() => {
				result.current.reset();
			});

			expect(result.current.state.activeStep).toBe(0);
			expect(result.current.state.completedSteps.size).toBe(0);
			expect(result.current.state.errorSteps.size).toBe(0);
			expect(result.current.state.formData).toEqual({});
			expect(result.current.state.isSubmitting).toBe(false);
		});

		it('resets to custom initial step', () => {
			const steps = [
				{ id: 'step1', label: 'Step 1', content: () => null },
				{ id: 'step2', label: 'Step 2', content: () => null },
			];

			const { result } = renderHook(() =>
				useFormWizardState<TestFormData>({
					initialStep: 1,
					persistData: false,
					persistKey: 'test-key',
					steps,
				})
			);

			act(() => {
				result.current.setActiveStep(0);
			});

			act(() => {
				result.current.reset();
			});

			expect(result.current.state.activeStep).toBe(1);
		});

		it('clears persisted data when persistence is enabled', async () => {
			const steps = [{ id: 'step1', label: 'Step 1', content: () => null }];

			const { result } = renderHook(() =>
				useFormWizardState<TestFormData>({
					initialStep: 0,
					persistData: true,
					persistKey: 'test-key',
					steps,
				})
			);

			act(() => {
				result.current.updateFormData({ name: 'John' });
			});

			// Wait for persistence to save
			await waitFor(() => {
				if (globalThis.window !== undefined && globalThis.window.localStorage) {
					expect(globalThis.window.localStorage.getItem('test-key')).not.toBeNull();
				}
			});

			act(() => {
				result.current.reset();
			});

			if (globalThis.window !== undefined && globalThis.window.localStorage) {
				expect(globalThis.window.localStorage.getItem('test-key')).toBeNull();
			}
		});
	});

	describe('persistence', () => {
		it('saves state to localStorage when persistence is enabled', async () => {
			const steps = [
				{ id: 'step1', label: 'Step 1', content: () => null },
				{ id: 'step2', label: 'Step 2', content: () => null },
			];

			const { result } = renderHook(() =>
				useFormWizardState<TestFormData>({
					initialStep: 0,
					persistData: true,
					persistKey: 'test-key',
					steps,
				})
			);

			act(() => {
				result.current.setActiveStep(1);
				result.current.markStepCompleted(0);
				result.current.updateFormData({ name: 'John' });
			});

			await waitFor(() => {
				if (globalThis.window !== undefined && globalThis.window.localStorage) {
					const stored = globalThis.window.localStorage.getItem('test-key');
					expect(stored).not.toBeNull();
					if (stored) {
						const parsed = JSON.parse(stored);
						expect(parsed.activeStep).toBe(1);
						expect(parsed.completedSteps).toEqual([0]);
						expect(parsed.formData).toEqual({ name: 'John' });
					}
				}
			});
		});

		it('does not save to localStorage when persistence is disabled', () => {
			const steps = [{ id: 'step1', label: 'Step 1', content: () => null }];

			const { result } = renderHook(() =>
				useFormWizardState<TestFormData>({
					initialStep: 0,
					persistData: false,
					persistKey: 'test-key',
					steps,
				})
			);

			act(() => {
				result.current.setActiveStep(1);
				result.current.updateFormData({ name: 'John' });
			});

			if (globalThis.window !== undefined && globalThis.window.localStorage) {
				expect(globalThis.window.localStorage.getItem('test-key')).toBeNull();
			}
		});
	});
});
