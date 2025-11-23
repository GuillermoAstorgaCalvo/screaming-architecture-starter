/**
 * FormWizard.sync Tests
 *
 * Tests for the synchronization helpers including:
 * - useActiveStepSync: Synchronizing controlled and internal active step
 * - useWizardStateWithSync: Creating combined wizard state with synchronized active step
 * - useWizardStateSync: Synchronizing wizard state with controlled active step
 */

import {
	useActiveStepSync,
	useWizardStateSync,
	useWizardStateWithSync,
} from '@core/ui/forms/form-wizard/helpers/FormWizard.sync';
import type { FormWizardState } from '@core/ui/forms/form-wizard/types/FormWizardTypes';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

interface TestFormData {
	name: string;
	email: string;
}

describe('useActiveStepSync', () => {
	it('returns controlled active step when provided', () => {
		const { result } = renderHook(() => useActiveStepSync(2, 0));

		expect(result.current).toBe(2);
	});

	it('returns internal active step when controlled is undefined', () => {
		const { result } = renderHook(() => useActiveStepSync(undefined, 3));

		expect(result.current).toBe(3);
	});

	it('updates when controlled active step changes', () => {
		const { result, rerender } = renderHook(
			({ controlled, internal }) => useActiveStepSync(controlled, internal),
			{
				initialProps: { controlled: 1 as number | undefined, internal: 0 },
			}
		);

		expect(result.current).toBe(1);

		act(() => {
			rerender({ controlled: 2, internal: 0 });
		});

		expect(result.current).toBe(2);
	});

	it('updates when internal active step changes and controlled is undefined', () => {
		const { result, rerender } = renderHook(
			({ controlled, internal }) => useActiveStepSync(controlled, internal),
			{
				initialProps: { controlled: undefined, internal: 0 },
			}
		);

		expect(result.current).toBe(0);

		act(() => {
			rerender({ controlled: undefined, internal: 2 });
		});

		expect(result.current).toBe(2);
	});

	it('prioritizes controlled step over internal step', () => {
		const { result } = renderHook(() => useActiveStepSync(5, 10));

		expect(result.current).toBe(5);
	});

	it('handles zero values correctly', () => {
		const { result } = renderHook(() => useActiveStepSync(0, 1));

		expect(result.current).toBe(0);
	});

	it('handles undefined controlled with zero internal', () => {
		const { result } = renderHook(() => useActiveStepSync(undefined, 0));

		expect(result.current).toBe(0);
	});
});

describe('useWizardStateWithSync', () => {
	it('creates combined wizard state with synchronized active step', () => {
		const state: FormWizardState<TestFormData> = {
			activeStep: 0,
			completedSteps: new Set([0]),
			errorSteps: new Set(),
			formData: { name: 'John' },
			isSubmitting: false,
		};

		const { result } = renderHook(() => useWizardStateWithSync(state, 2));

		expect(result.current.activeStep).toBe(2);
		expect(result.current.completedSteps).toBe(state.completedSteps);
		expect(result.current.errorSteps).toBe(state.errorSteps);
		expect(result.current.formData).toBe(state.formData);
		expect(result.current.isSubmitting).toBe(state.isSubmitting);
	});

	it('updates active step when currentActiveStep changes', () => {
		const state: FormWizardState<TestFormData> = {
			activeStep: 0,
			completedSteps: new Set(),
			errorSteps: new Set(),
			formData: {},
			isSubmitting: false,
		};

		const { result, rerender } = renderHook(
			({ currentStep }) => useWizardStateWithSync(state, currentStep),
			{
				initialProps: { currentStep: 1 },
			}
		);

		expect(result.current.activeStep).toBe(1);

		act(() => {
			rerender({ currentStep: 3 });
		});

		expect(result.current.activeStep).toBe(3);
	});

	it('preserves all other state properties', () => {
		const completedSteps = new Set([0, 1]);
		const errorSteps = new Set([2]);
		const formData: Partial<TestFormData> = { name: 'Jane', email: 'jane@example.com' };

		const state: FormWizardState<TestFormData> = {
			activeStep: 0,
			completedSteps,
			errorSteps,
			formData,
			isSubmitting: true,
		};

		const { result } = renderHook(() => useWizardStateWithSync(state, 5));

		expect(result.current.activeStep).toBe(5);
		expect(result.current.completedSteps).toBe(completedSteps);
		expect(result.current.errorSteps).toBe(errorSteps);
		expect(result.current.formData).toBe(formData);
		expect(result.current.isSubmitting).toBe(true);
	});

	it('creates new state object on each render', () => {
		const state: FormWizardState<TestFormData> = {
			activeStep: 0,
			completedSteps: new Set(),
			errorSteps: new Set(),
			formData: {},
			isSubmitting: false,
		};

		const { result, rerender } = renderHook(
			({ currentStep }) => useWizardStateWithSync(state, currentStep),
			{
				initialProps: { currentStep: 1 },
			}
		);

		const firstResult = result.current;

		act(() => {
			rerender({ currentStep: 1 });
		});

		// Should be a new object reference even if values are the same
		expect(result.current).not.toBe(firstResult);
		expect(result.current.activeStep).toBe(firstResult.activeStep);
	});
});

describe('useWizardStateSync', () => {
	it('synchronizes wizard state with controlled active step', () => {
		const stateManagement = {
			state: {
				activeStep: 0,
				completedSteps: new Set([0]),
				errorSteps: new Set(),
				formData: { name: 'John' } as Partial<TestFormData>,
				isSubmitting: false,
			} as FormWizardState<TestFormData>,
		};

		const { result } = renderHook(() => useWizardStateSync(stateManagement, 2));

		expect(result.current.activeStep).toBe(2);
		expect(result.current.completedSteps).toBe(stateManagement.state.completedSteps);
		expect(result.current.errorSteps).toBe(stateManagement.state.errorSteps);
		expect(result.current.formData).toBe(stateManagement.state.formData);
		expect(result.current.isSubmitting).toBe(stateManagement.state.isSubmitting);
	});

	it('uses internal active step when controlled is undefined', () => {
		const stateManagement = {
			state: {
				activeStep: 3,
				completedSteps: new Set(),
				errorSteps: new Set(),
				formData: {} as Partial<TestFormData>,
				isSubmitting: false,
			} as FormWizardState<TestFormData>,
		};

		const { result } = renderHook(() => useWizardStateSync(stateManagement, undefined));

		expect(result.current.activeStep).toBe(3);
	});

	it('updates when controlled active step changes', () => {
		const stateManagement = {
			state: {
				activeStep: 0,
				completedSteps: new Set(),
				errorSteps: new Set(),
				formData: {} as Partial<TestFormData>,
				isSubmitting: false,
			} as FormWizardState<TestFormData>,
		};

		const { result, rerender } = renderHook(
			({ controlled }) => useWizardStateSync(stateManagement, controlled),
			{
				initialProps: { controlled: 1 as number | undefined },
			}
		);

		expect(result.current.activeStep).toBe(1);

		act(() => {
			rerender({ controlled: 4 });
		});

		expect(result.current.activeStep).toBe(4);
	});

	it('updates when state management changes', () => {
		let stateManagement = {
			state: {
				activeStep: 0,
				completedSteps: new Set(),
				errorSteps: new Set(),
				formData: {} as Partial<TestFormData>,
				isSubmitting: false,
			} as FormWizardState<TestFormData>,
		};

		const { result, rerender } = renderHook(({ state }) => useWizardStateSync(state, undefined), {
			initialProps: { state: stateManagement },
		});

		expect(result.current.activeStep).toBe(0);

		stateManagement = {
			state: {
				...stateManagement.state,
				activeStep: 5,
			},
		};

		act(() => {
			rerender({ state: stateManagement });
		});

		expect(result.current.activeStep).toBe(5);
	});

	it('handles zero controlled step correctly', () => {
		const stateManagement = {
			state: {
				activeStep: 2,
				completedSteps: new Set(),
				errorSteps: new Set(),
				formData: {} as Partial<TestFormData>,
				isSubmitting: false,
			} as FormWizardState<TestFormData>,
		};

		const { result } = renderHook(() => useWizardStateSync(stateManagement, 0));

		expect(result.current.activeStep).toBe(0);
	});

	it('preserves all state properties during synchronization', () => {
		const completedSteps = new Set([0, 1, 2]);
		const errorSteps = new Set([3]);
		const formData: Partial<TestFormData> = {
			name: 'Test',
			email: 'test@example.com',
		};

		const stateManagement = {
			state: {
				activeStep: 1,
				completedSteps,
				errorSteps,
				formData,
				isSubmitting: true,
			} as FormWizardState<TestFormData>,
		};

		const { result } = renderHook(() => useWizardStateSync(stateManagement, 4));

		expect(result.current.activeStep).toBe(4);
		expect(result.current.completedSteps).toBe(completedSteps);
		expect(result.current.errorSteps).toBe(errorSteps);
		expect(result.current.formData).toBe(formData);
		expect(result.current.isSubmitting).toBe(true);
	});
});
