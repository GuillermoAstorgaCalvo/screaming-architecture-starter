/**
 * FormAdapter Error Management Tests
 *
 * Tests for error handling: setting errors, clearing errors.
 */

import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { createSimpleForm, createTestForm, setErrorInAct } from './formAdapter.helpers';

function registerSetErrorTests() {
	describe('setError', () => {
		it('should set error for a field', () => {
			const { result } = createSimpleForm();

			setErrorInAct(result, 'value', {
				type: 'manual',
				message: 'Custom error',
			});

			expect(result.current.errors.value).toBeDefined();
			expect(result.current.errors.value?.message).toBe('Custom error');
		});

		it('should set error with custom type', () => {
			const { result } = createSimpleForm();

			setErrorInAct(result, 'value', {
				type: 'custom',
				message: 'Custom type error',
			});

			expect(result.current.errors.value?.type).toBe('custom');
		});

		it('should set error for nested field', () => {
			const { result } = createTestForm();

			setErrorInAct(result, 'nested.field', {
				type: 'manual',
				message: 'Nested error',
			});

			expect(result.current.errors.nested?.field).toBeDefined();
		});
	});
}

function registerClearErrorsTests() {
	describe('clearErrors', () => {
		it('should clear all errors', () => {
			const { result } = createTestForm();

			act(() => {
				result.current.setError('name', { type: 'manual', message: 'Error 1' });
				result.current.setError('email', { type: 'manual', message: 'Error 2' });
			});

			expect(result.current.errors.name).toBeDefined();
			expect(result.current.errors.email).toBeDefined();

			act(() => {
				result.current.clearErrors();
			});

			expect(result.current.errors.name).toBeUndefined();
			expect(result.current.errors.email).toBeUndefined();
		});

		it('should clear error for specific field', () => {
			const { result } = createTestForm();

			act(() => {
				result.current.setError('name', { type: 'manual', message: 'Error 1' });
				result.current.setError('email', { type: 'manual', message: 'Error 2' });
			});

			act(() => {
				result.current.clearErrors('name');
			});

			expect(result.current.errors.name).toBeUndefined();
			expect(result.current.errors.email).toBeDefined();
		});

		it('should clear errors for multiple fields', () => {
			const { result } = createTestForm();

			act(() => {
				result.current.setError('name', { type: 'manual', message: 'Error 1' });
				result.current.setError('email', { type: 'manual', message: 'Error 2' });
			});

			act(() => {
				result.current.clearErrors(['name', 'email']);
			});

			expect(result.current.errors.name).toBeUndefined();
			expect(result.current.errors.email).toBeUndefined();
		});
	});
}

describe('useFormAdapter - error management', () => {
	registerSetErrorTests();
	registerClearErrorsTests();
});
