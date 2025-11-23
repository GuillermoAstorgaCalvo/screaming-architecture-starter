/**
 * useWizard.state.validation Tests
 *
 * Tests for validation state management:
 * - Validation state storage
 * - Step validation
 * - Validation state updates
 */

import { useValidationState } from '@core/ui/forms/wizard/hooks/useWizard.state.validation';
import type { StepValidationState } from '@core/ui/forms/wizard/types/useWizard.state.types';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useValidationState', () => {
	it('initializes with empty validation state', () => {
		const { result } = renderHook(() => useValidationState());

		expect(result.current.validationState.size).toBe(0);
	});

	it('sets validation state for a step', () => {
		const { result } = renderHook(() => useValidationState());

		const validation: StepValidationState = {
			isValidated: true,
			isValid: true,
		};

		act(() => {
			result.current.setStepValidation(0, validation);
		});

		expect(result.current.validationState.get(0)).toEqual(validation);
	});

	it('updates validation state for a step', () => {
		const { result } = renderHook(() => useValidationState());

		const initialValidation: StepValidationState = {
			isValidated: true,
			isValid: true,
		};

		act(() => {
			result.current.setStepValidation(0, initialValidation);
		});

		const updatedValidation: StepValidationState = {
			isValidated: true,
			isValid: false,
			error: 'Validation failed',
		};

		act(() => {
			result.current.setStepValidation(0, updatedValidation);
		});

		expect(result.current.validationState.get(0)).toEqual(updatedValidation);
	});

	it('sets validation for multiple steps', () => {
		const { result } = renderHook(() => useValidationState());

		act(() => {
			result.current.setStepValidation(0, { isValidated: true, isValid: true });
			result.current.setStepValidation(1, { isValidated: true, isValid: false, error: 'Error' });
		});

		expect(result.current.validationState.size).toBe(2);
		expect(result.current.validationState.get(0)?.isValid).toBe(true);
		expect(result.current.validationState.get(1)?.isValid).toBe(false);
	});

	it('checks if step is valid', () => {
		const { result } = renderHook(() => useValidationState());

		act(() => {
			result.current.setStepValidation(0, { isValidated: true, isValid: true });
			result.current.setStepValidation(1, { isValidated: true, isValid: false });
		});

		expect(result.current.isStepValid(0)).toBe(true);
		expect(result.current.isStepValid(1)).toBe(false);
	});

	it('returns true for unvalidated steps', () => {
		const { result } = renderHook(() => useValidationState());

		expect(result.current.isStepValid(0)).toBe(true);
		expect(result.current.isStepValid(999)).toBe(true);
	});

	it('allows setting validation state directly', () => {
		const { result } = renderHook(() => useValidationState());

		const newState = new Map<number, StepValidationState>();
		newState.set(0, { isValidated: true, isValid: true });
		newState.set(1, { isValidated: true, isValid: false, error: 'Error' });

		act(() => {
			result.current.setValidationState(newState);
		});

		expect(result.current.validationState.size).toBe(2);
		expect(result.current.validationState.get(0)?.isValid).toBe(true);
		expect(result.current.validationState.get(1)?.isValid).toBe(false);
	});

	it('handles validation with error messages', () => {
		const { result } = renderHook(() => useValidationState());

		const validation: StepValidationState = {
			isValidated: true,
			isValid: false,
			error: 'Custom error message',
		};

		act(() => {
			result.current.setStepValidation(0, validation);
		});

		const stored = result.current.validationState.get(0);
		expect(stored?.error).toBe('Custom error message');
		expect(stored?.isValid).toBe(false);
	});
});
