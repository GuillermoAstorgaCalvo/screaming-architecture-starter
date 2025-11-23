/**
 * useFormWizardState.helpers Tests
 *
 * Tests for the state helper functions including:
 * - loadPersistedData: Loading persisted data from localStorage
 * - getInitialState: Getting initial state for form wizard
 * - createFormWizardHandlers: Creating form wizard action handlers
 * - savePersistedData: Saving data to localStorage
 * - clearPersistedData: Removing persisted data from localStorage
 */

import {
	clearPersistedData,
	createFormWizardHandlers,
	getInitialState,
	loadPersistedData,
	savePersistedData,
} from '@core/ui/forms/form-wizard/helpers/useFormWizardState.helpers';
import type { Dispatch, SetStateAction } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

interface TestFormData {
	name: string;
	email: string;
	age?: number;
}

describe('loadPersistedData', () => {
	beforeEach(() => {
		if (globalThis.window !== undefined && globalThis.window.localStorage) {
			globalThis.window.localStorage.clear();
		}
	});

	it('returns null when localStorage is not available (SSR)', () => {
		// Mock window not being available
		const originalWindow = globalThis.window;
		// @ts-expect-error - Testing SSR scenario
		delete globalThis.window;

		const result = loadPersistedData<TestFormData>('test-key');

		globalThis.window = originalWindow;
		expect(result).toBeNull();
	});

	it('returns null when key does not exist in localStorage', () => {
		const result = loadPersistedData<TestFormData>('non-existent-key');

		expect(result).toBeNull();
	});

	it('loads persisted data from localStorage', () => {
		const persistedData = {
			activeStep: 2,
			formData: { name: 'John', email: 'john@example.com' },
			completedSteps: [0, 1],
		};

		if (globalThis.window !== undefined && globalThis.window.localStorage) {
			globalThis.window.localStorage.setItem('test-key', JSON.stringify(persistedData));
		}

		const result = loadPersistedData<TestFormData>('test-key');

		expect(result).toEqual(persistedData);
	});

	it('handles invalid JSON in localStorage', () => {
		if (globalThis.window !== undefined && globalThis.window.localStorage) {
			globalThis.window.localStorage.setItem('test-key', 'invalid-json');
		}

		const result = loadPersistedData<TestFormData>('test-key');

		expect(result).toBeNull();
	});

	it('loads partial persisted data', () => {
		const persistedData = {
			activeStep: 1,
		};

		if (globalThis.window !== undefined && globalThis.window.localStorage) {
			globalThis.window.localStorage.setItem('test-key', JSON.stringify(persistedData));
		}

		const result = loadPersistedData<TestFormData>('test-key');

		expect(result).toEqual(persistedData);
		expect(result?.formData).toBeUndefined();
		expect(result?.completedSteps).toBeUndefined();
	});

	it('handles localStorage errors gracefully', () => {
		const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new Error('Storage error');
		});

		const result = loadPersistedData<TestFormData>('test-key');

		expect(result).toBeNull();

		getItemSpy.mockRestore();
	});
});

describe('getInitialState', () => {
	beforeEach(() => {
		if (globalThis.window !== undefined && globalThis.window.localStorage) {
			globalThis.window.localStorage.clear();
		}
	});

	it('returns initial state when persistence is disabled', () => {
		const result = getInitialState<TestFormData>({
			persistData: false,
			persistKey: 'test-key',
			initialStep: 0,
		});

		expect(result.activeStep).toBe(0);
		expect(result.completedSteps).toEqual(new Set());
		expect(result.formData).toEqual({});
	});

	it('returns initial state when persistence is enabled but no data exists', () => {
		const result = getInitialState<TestFormData>({
			persistData: true,
			persistKey: 'non-existent-key',
			initialStep: 2,
		});

		expect(result.activeStep).toBe(2);
		expect(result.completedSteps).toEqual(new Set());
		expect(result.formData).toEqual({});
	});

	it('loads persisted state when persistence is enabled and data exists', () => {
		const persistedData = {
			activeStep: 3,
			formData: { name: 'Jane', email: 'jane@example.com' },
			completedSteps: [0, 1, 2],
		};

		if (globalThis.window !== undefined && globalThis.window.localStorage) {
			globalThis.window.localStorage.setItem('test-key', JSON.stringify(persistedData));
		}

		const result = getInitialState<TestFormData>({
			persistData: true,
			persistKey: 'test-key',
			initialStep: 0,
		});

		expect(result.activeStep).toBe(3);
		expect(result.completedSteps).toEqual(new Set([0, 1, 2]));
		expect(result.formData).toEqual(persistedData.formData);
	});

	it('uses initialStep when persisted activeStep is undefined', () => {
		const persistedData = {
			formData: { name: 'John' },
			completedSteps: [0],
		};

		if (globalThis.window !== undefined && globalThis.window.localStorage) {
			globalThis.window.localStorage.setItem('test-key', JSON.stringify(persistedData));
		}

		const result = getInitialState<TestFormData>({
			persistData: true,
			persistKey: 'test-key',
			initialStep: 5,
		});

		expect(result.activeStep).toBe(5);
		expect(result.formData).toEqual(persistedData.formData);
	});

	it('handles empty completedSteps array', () => {
		const persistedData = {
			activeStep: 1,
			formData: {},
			completedSteps: [],
		};

		if (globalThis.window !== undefined && globalThis.window.localStorage) {
			globalThis.window.localStorage.setItem('test-key', JSON.stringify(persistedData));
		}

		const result = getInitialState<TestFormData>({
			persistData: true,
			persistKey: 'test-key',
			initialStep: 0,
		});

		expect(result.completedSteps).toEqual(new Set());
	});
});

describe('createFormWizardHandlers', () => {
	it('creates all required handlers', () => {
		const setActiveStep = vi.fn();
		const setCompletedSteps = vi.fn() as Dispatch<SetStateAction<Set<number>>>;
		const setErrorSteps = vi.fn() as Dispatch<SetStateAction<Set<number>>>;
		const setFormData = vi.fn() as Dispatch<SetStateAction<Partial<TestFormData>>>;
		const setIsSubmitting = vi.fn();
		const isResettingRef = { current: false };

		const handlers = createFormWizardHandlers<TestFormData>({
			setActiveStep,
			setCompletedSteps,
			setErrorSteps,
			setFormData,
			setIsSubmitting,
			stepsLength: 5,
			initialStep: 0,
			persistData: false,
			persistKey: 'test-key',
			isResettingRef,
		});

		expect(handlers.handleSetActiveStep).toBeDefined();
		expect(handlers.handleMarkStepCompleted).toBeDefined();
		expect(handlers.handleMarkStepError).toBeDefined();
		expect(handlers.handleClearStepError).toBeDefined();
		expect(handlers.handleUpdateFormData).toBeDefined();
		expect(handlers.handleReset).toBeDefined();
	});

	it('handleSetActiveStep sets active step within valid range', () => {
		const setActiveStep = vi.fn();
		const setCompletedSteps = vi.fn() as Dispatch<SetStateAction<Set<number>>>;
		const setErrorSteps = vi.fn() as Dispatch<SetStateAction<Set<number>>>;
		const setFormData = vi.fn() as Dispatch<SetStateAction<Partial<TestFormData>>>;
		const setIsSubmitting = vi.fn();
		const isResettingRef = { current: false };

		const handlers = createFormWizardHandlers<TestFormData>({
			setActiveStep,
			setCompletedSteps,
			setErrorSteps,
			setFormData,
			setIsSubmitting,
			stepsLength: 5,
			initialStep: 0,
			persistData: false,
			persistKey: 'test-key',
			isResettingRef,
		});

		handlers.handleSetActiveStep(2);

		expect(setActiveStep).toHaveBeenCalledWith(2);
	});

	it('handleSetActiveStep does not set step outside valid range', () => {
		const setActiveStep = vi.fn();
		const setCompletedSteps = vi.fn() as Dispatch<SetStateAction<Set<number>>>;
		const setErrorSteps = vi.fn() as Dispatch<SetStateAction<Set<number>>>;
		const setFormData = vi.fn() as Dispatch<SetStateAction<Partial<TestFormData>>>;
		const setIsSubmitting = vi.fn();
		const isResettingRef = { current: false };

		const handlers = createFormWizardHandlers<TestFormData>({
			setActiveStep,
			setCompletedSteps,
			setErrorSteps,
			setFormData,
			setIsSubmitting,
			stepsLength: 5,
			initialStep: 0,
			persistData: false,
			persistKey: 'test-key',
			isResettingRef,
		});

		handlers.handleSetActiveStep(-1);
		handlers.handleSetActiveStep(5);
		handlers.handleSetActiveStep(10);

		expect(setActiveStep).not.toHaveBeenCalled();
	});

	it('handleMarkStepCompleted adds step to completed and removes from errors', () => {
		const setActiveStep = vi.fn();
		const setCompletedSteps = vi.fn((action: SetStateAction<Set<number>>) => {
			if (typeof action === 'function') {
				const prev = new Set<number>();
				const next = action(prev);
				expect(Array.from(next)).toEqual([1]);
			}
		});
		const setErrorSteps = vi.fn((action: SetStateAction<Set<number>>) => {
			if (typeof action === 'function') {
				const prev = new Set<number>([1]);
				const next = action(prev);
				expect(Array.from(next)).toEqual([]);
			}
		});
		const setFormData = vi.fn() as Dispatch<SetStateAction<Partial<TestFormData>>>;
		const setIsSubmitting = vi.fn();
		const isResettingRef = { current: false };

		const handlers = createFormWizardHandlers<TestFormData>({
			setActiveStep,
			setCompletedSteps,
			setErrorSteps,
			setFormData,
			setIsSubmitting,
			stepsLength: 5,
			initialStep: 0,
			persistData: false,
			persistKey: 'test-key',
			isResettingRef,
		});

		handlers.handleMarkStepCompleted(1);

		expect(setCompletedSteps).toHaveBeenCalled();
		expect(setErrorSteps).toHaveBeenCalled();
	});

	it('handleMarkStepError adds step to errors', () => {
		const setActiveStep = vi.fn();
		const setCompletedSteps = vi.fn() as Dispatch<SetStateAction<Set<number>>>;
		const setErrorSteps = vi.fn((action: SetStateAction<Set<number>>) => {
			if (typeof action === 'function') {
				const prev = new Set<number>();
				const next = action(prev);
				expect(Array.from(next)).toEqual([2]);
			}
		});
		const setFormData = vi.fn() as Dispatch<SetStateAction<Partial<TestFormData>>>;
		const setIsSubmitting = vi.fn();
		const isResettingRef = { current: false };

		const handlers = createFormWizardHandlers<TestFormData>({
			setActiveStep,
			setCompletedSteps,
			setErrorSteps,
			setFormData,
			setIsSubmitting,
			stepsLength: 5,
			initialStep: 0,
			persistData: false,
			persistKey: 'test-key',
			isResettingRef,
		});

		handlers.handleMarkStepError(2);

		expect(setErrorSteps).toHaveBeenCalled();
	});

	it('handleClearStepError removes step from errors', () => {
		const setActiveStep = vi.fn();
		const setCompletedSteps = vi.fn() as Dispatch<SetStateAction<Set<number>>>;
		const setErrorSteps = vi.fn((action: SetStateAction<Set<number>>) => {
			if (typeof action === 'function') {
				const prev = new Set<number>([0, 1]);
				const next = action(prev);
				expect(Array.from(next)).toEqual([1]);
			}
		});
		const setFormData = vi.fn() as Dispatch<SetStateAction<Partial<TestFormData>>>;
		const setIsSubmitting = vi.fn();
		const isResettingRef = { current: false };

		const handlers = createFormWizardHandlers<TestFormData>({
			setActiveStep,
			setCompletedSteps,
			setErrorSteps,
			setFormData,
			setIsSubmitting,
			stepsLength: 5,
			initialStep: 0,
			persistData: false,
			persistKey: 'test-key',
			isResettingRef,
		});

		handlers.handleClearStepError(0);

		expect(setErrorSteps).toHaveBeenCalled();
	});

	it('handleUpdateFormData merges data with existing form data', () => {
		const setActiveStep = vi.fn();
		const setCompletedSteps = vi.fn() as Dispatch<SetStateAction<Set<number>>>;
		const setErrorSteps = vi.fn() as Dispatch<SetStateAction<Set<number>>>;
		const setFormData = vi.fn((action: SetStateAction<Partial<TestFormData>>) => {
			if (typeof action === 'function') {
				const prev: Partial<TestFormData> = { name: 'John' };
				const next = action(prev);
				expect(next).toEqual({ name: 'John', email: 'john@example.com' });
			}
		});
		const setIsSubmitting = vi.fn();
		const isResettingRef = { current: false };

		const handlers = createFormWizardHandlers<TestFormData>({
			setActiveStep,
			setCompletedSteps,
			setErrorSteps,
			setFormData,
			setIsSubmitting,
			stepsLength: 5,
			initialStep: 0,
			persistData: false,
			persistKey: 'test-key',
			isResettingRef,
		});

		handlers.handleUpdateFormData({ email: 'john@example.com' });

		expect(setFormData).toHaveBeenCalled();
	});

	it('handleReset resets all state and clears persistence when enabled', () => {
		const setActiveStep = vi.fn();
		const setCompletedSteps = vi.fn() as Dispatch<SetStateAction<Set<number>>>;
		const setErrorSteps = vi.fn() as Dispatch<SetStateAction<Set<number>>>;
		const setFormData = vi.fn() as Dispatch<SetStateAction<Partial<TestFormData>>>;
		const setIsSubmitting = vi.fn();
		const isResettingRef = { current: false };

		if (globalThis.window !== undefined && globalThis.window.localStorage) {
			globalThis.window.localStorage.setItem('test-key', 'some-data');
		}

		const handlers = createFormWizardHandlers<TestFormData>({
			setActiveStep,
			setCompletedSteps,
			setErrorSteps,
			setFormData,
			setIsSubmitting,
			stepsLength: 5,
			initialStep: 2,
			persistData: true,
			persistKey: 'test-key',
			isResettingRef,
		});

		handlers.handleReset();

		expect(setActiveStep).toHaveBeenCalledWith(2);
		expect(setCompletedSteps).toHaveBeenCalledWith(new Set());
		expect(setErrorSteps).toHaveBeenCalledWith(new Set());
		expect(setFormData).toHaveBeenCalledWith({});
		expect(setIsSubmitting).toHaveBeenCalledWith(false);

		if (globalThis.window !== undefined && globalThis.window.localStorage) {
			expect(globalThis.window.localStorage.getItem('test-key')).toBeNull();
		}
	});

	it('handleReset does not clear persistence when disabled', () => {
		const setActiveStep = vi.fn();
		const setCompletedSteps = vi.fn() as Dispatch<SetStateAction<Set<number>>>;
		const setErrorSteps = vi.fn() as Dispatch<SetStateAction<Set<number>>>;
		const setFormData = vi.fn() as Dispatch<SetStateAction<Partial<TestFormData>>>;
		const setIsSubmitting = vi.fn();
		const isResettingRef = { current: false };

		if (globalThis.window !== undefined && globalThis.window.localStorage) {
			globalThis.window.localStorage.setItem('other-key', 'some-data');
		}

		const handlers = createFormWizardHandlers<TestFormData>({
			setActiveStep,
			setCompletedSteps,
			setErrorSteps,
			setFormData,
			setIsSubmitting,
			stepsLength: 5,
			initialStep: 0,
			persistData: false,
			persistKey: 'test-key',
			isResettingRef,
		});

		handlers.handleReset();

		expect(setActiveStep).toHaveBeenCalledWith(0);
		// Should not clear localStorage when persistData is false
		if (globalThis.window !== undefined && globalThis.window.localStorage) {
			expect(globalThis.window.localStorage.getItem('other-key')).toBe('some-data');
		}
	});
});

describe('savePersistedData', () => {
	beforeEach(() => {
		if (globalThis.window !== undefined && globalThis.window.localStorage) {
			globalThis.window.localStorage.clear();
		}
	});

	it('saves data to localStorage', () => {
		const data = {
			activeStep: 2,
			formData: { name: 'John', email: 'john@example.com' } as Partial<TestFormData>,
			completedSteps: [0, 1],
		};

		savePersistedData('test-key', data);

		if (globalThis.window !== undefined && globalThis.window.localStorage) {
			const stored = globalThis.window.localStorage.getItem('test-key');
			expect(stored).toBe(JSON.stringify(data));
		}
	});

	it('does not save when localStorage is not available (SSR)', () => {
		const originalWindow = globalThis.window;
		// @ts-expect-error - Testing SSR scenario
		delete globalThis.window;

		const data = {
			activeStep: 0,
			formData: {} as Partial<TestFormData>,
			completedSteps: [],
		};

		// Should not throw
		expect(() => savePersistedData('test-key', data)).not.toThrow();

		globalThis.window = originalWindow;
	});

	it('handles localStorage errors gracefully', () => {
		const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new Error('Storage quota exceeded');
		});

		const data = {
			activeStep: 0,
			formData: {} as Partial<TestFormData>,
			completedSteps: [],
		};

		// Should not throw
		expect(() => savePersistedData('test-key', data)).not.toThrow();

		setItemSpy.mockRestore();
	});

	it('overwrites existing data', () => {
		const initialData = {
			activeStep: 0,
			formData: {} as Partial<TestFormData>,
			completedSteps: [],
		};

		if (globalThis.window !== undefined && globalThis.window.localStorage) {
			globalThis.window.localStorage.setItem('test-key', JSON.stringify(initialData));
		}

		const newData = {
			activeStep: 3,
			formData: { name: 'Jane' } as Partial<TestFormData>,
			completedSteps: [0, 1, 2],
		};

		savePersistedData('test-key', newData);

		if (globalThis.window !== undefined && globalThis.window.localStorage) {
			const stored = globalThis.window.localStorage.getItem('test-key');
			expect(stored).toBe(JSON.stringify(newData));
		}
	});
});

describe('clearPersistedData', () => {
	beforeEach(() => {
		if (globalThis.window !== undefined && globalThis.window.localStorage) {
			globalThis.window.localStorage.clear();
		}
	});

	it('removes data from localStorage', () => {
		if (globalThis.window !== undefined && globalThis.window.localStorage) {
			globalThis.window.localStorage.setItem('test-key', 'some-data');
		}

		clearPersistedData('test-key');

		if (globalThis.window !== undefined && globalThis.window.localStorage) {
			expect(globalThis.window.localStorage.getItem('test-key')).toBeNull();
		}
	});

	it('does not throw when key does not exist', () => {
		expect(() => clearPersistedData('non-existent-key')).not.toThrow();
	});

	it('does not remove when localStorage is not available (SSR)', () => {
		const originalWindow = globalThis.window;
		// @ts-expect-error - Testing SSR scenario
		delete globalThis.window;

		// Should not throw
		expect(() => clearPersistedData('test-key')).not.toThrow();

		globalThis.window = originalWindow;
	});

	it('handles localStorage errors gracefully', () => {
		const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
			throw new Error('Storage error');
		});

		// Should not throw
		expect(() => clearPersistedData('test-key')).not.toThrow();

		removeItemSpy.mockRestore();
	});
});
