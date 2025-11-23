/**
 * FormWizard.state Tests
 *
 * Tests for the state management helpers including:
 * - useFormWizardStateManagement: Initializing wizard state with persistence and step tracking
 * - createStateHandlers: Creating state handlers object from state management
 */

import {
	createStateHandlers,
	useFormWizardStateManagement,
} from '@core/ui/forms/form-wizard/helpers/FormWizard.state';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

interface TestFormData {
	name: string;
	email: string;
}

// Mock useFormWizardState
const mockUseFormWizardState = vi.fn();
vi.mock('@core/ui/forms/form-wizard/hooks/useFormWizardState', () => ({
	useFormWizardState: (config: unknown) => mockUseFormWizardState(config),
}));

describe('useFormWizardStateManagement', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Clear localStorage before each test
		if (globalThis.window !== undefined && globalThis.window.localStorage) {
			globalThis.window.localStorage.clear();
		}
	});

	it('initializes state management with initial step', () => {
		const mockState = {
			state: {
				activeStep: 0,
				completedSteps: new Set<number>(),
				errorSteps: new Set<number>(),
				formData: {} as Partial<TestFormData>,
				isSubmitting: false,
			},
			setActiveStep: vi.fn(),
			markStepCompleted: vi.fn(),
			markStepError: vi.fn(),
			clearStepError: vi.fn(),
			updateFormData: vi.fn(),
			setIsSubmitting: vi.fn(),
		};

		mockUseFormWizardState.mockReturnValue(mockState);

		const { result } = renderHook(() =>
			useFormWizardStateManagement<TestFormData>({
				initialStep: 0,
				controlledActiveStep: undefined,
				persistData: false,
				persistKey: 'test-key',
				steps: [],
			})
		);

		expect(result.current.state).toBeDefined();
		expect(result.current.setActiveStep).toBeDefined();
		expect(result.current.markStepCompleted).toBeDefined();
		expect(result.current.markStepError).toBeDefined();
		expect(result.current.clearStepError).toBeDefined();
		expect(result.current.updateFormData).toBeDefined();
		expect(result.current.setIsSubmitting).toBeDefined();
	});

	it('uses controlled active step when provided', () => {
		const mockState = {
			state: {
				activeStep: 2,
				completedSteps: new Set<number>(),
				errorSteps: new Set<number>(),
				formData: {} as Partial<TestFormData>,
				isSubmitting: false,
			},
			setActiveStep: vi.fn(),
			markStepCompleted: vi.fn(),
			markStepError: vi.fn(),
			clearStepError: vi.fn(),
			updateFormData: vi.fn(),
			setIsSubmitting: vi.fn(),
		};

		mockUseFormWizardState.mockReturnValue(mockState);

		renderHook(() =>
			useFormWizardStateManagement<TestFormData>({
				initialStep: 0,
				controlledActiveStep: 2,
				persistData: false,
				persistKey: 'test-key',
				steps: [],
			})
		);

		expect(mockUseFormWizardState).toHaveBeenCalledWith({
			initialStep: 2,
			persistData: false,
			persistKey: 'test-key',
			steps: [],
		});
	});

	it('uses initial step when controlled is undefined', () => {
		const mockState = {
			state: {
				activeStep: 0,
				completedSteps: new Set<number>(),
				errorSteps: new Set<number>(),
				formData: {} as Partial<TestFormData>,
				isSubmitting: false,
			},
			setActiveStep: vi.fn(),
			markStepCompleted: vi.fn(),
			markStepError: vi.fn(),
			clearStepError: vi.fn(),
			updateFormData: vi.fn(),
			setIsSubmitting: vi.fn(),
		};

		mockUseFormWizardState.mockReturnValue(mockState);

		renderHook(() =>
			useFormWizardStateManagement<TestFormData>({
				initialStep: 3,
				controlledActiveStep: undefined,
				persistData: false,
				persistKey: 'test-key',
				steps: [],
			})
		);

		expect(mockUseFormWizardState).toHaveBeenCalledWith({
			initialStep: 3,
			persistData: false,
			persistKey: 'test-key',
			steps: [],
		});
	});

	it('passes persistData and persistKey to useFormWizardState', () => {
		const mockState = {
			state: {
				activeStep: 0,
				completedSteps: new Set<number>(),
				errorSteps: new Set<number>(),
				formData: {} as Partial<TestFormData>,
				isSubmitting: false,
			},
			setActiveStep: vi.fn(),
			markStepCompleted: vi.fn(),
			markStepError: vi.fn(),
			clearStepError: vi.fn(),
			updateFormData: vi.fn(),
			setIsSubmitting: vi.fn(),
		};

		mockUseFormWizardState.mockReturnValue(mockState);

		renderHook(() =>
			useFormWizardStateManagement<TestFormData>({
				initialStep: 0,
				controlledActiveStep: undefined,
				persistData: true,
				persistKey: 'custom-key',
				steps: [],
			})
		);

		expect(mockUseFormWizardState).toHaveBeenCalledWith({
			initialStep: 0,
			persistData: true,
			persistKey: 'custom-key',
			steps: [],
		});
	});

	it('returns all state management functions', () => {
		const setActiveStep = vi.fn();
		const markStepCompleted = vi.fn();
		const markStepError = vi.fn();
		const clearStepError = vi.fn();
		const updateFormData = vi.fn();
		const setIsSubmitting = vi.fn();

		mockUseFormWizardState.mockReturnValue({
			state: {
				activeStep: 0,
				completedSteps: new Set<number>(),
				errorSteps: new Set<number>(),
				formData: {} as Partial<TestFormData>,
				isSubmitting: false,
			},
			setActiveStep,
			markStepCompleted,
			markStepError,
			clearStepError,
			updateFormData,
			setIsSubmitting,
		});

		const { result } = renderHook(() =>
			useFormWizardStateManagement<TestFormData>({
				initialStep: 0,
				controlledActiveStep: undefined,
				persistData: false,
				persistKey: 'test-key',
				steps: [],
			})
		);

		expect(result.current.setActiveStep).toBe(setActiveStep);
		expect(result.current.markStepCompleted).toBe(markStepCompleted);
		expect(result.current.markStepError).toBe(markStepError);
		expect(result.current.clearStepError).toBe(clearStepError);
		expect(result.current.updateFormData).toBe(updateFormData);
		expect(result.current.setIsSubmitting).toBe(setIsSubmitting);
	});

	it('handles steps array correctly', () => {
		const steps = [
			{ id: 'step1', label: 'Step 1' },
			{ id: 'step2', label: 'Step 2' },
		];

		const mockState = {
			state: {
				activeStep: 0,
				completedSteps: new Set<number>(),
				errorSteps: new Set<number>(),
				formData: {} as Partial<TestFormData>,
				isSubmitting: false,
			},
			setActiveStep: vi.fn(),
			markStepCompleted: vi.fn(),
			markStepError: vi.fn(),
			clearStepError: vi.fn(),
			updateFormData: vi.fn(),
			setIsSubmitting: vi.fn(),
		};

		mockUseFormWizardState.mockReturnValue(mockState);

		renderHook(() =>
			useFormWizardStateManagement<TestFormData>({
				initialStep: 0,
				controlledActiveStep: undefined,
				persistData: false,
				persistKey: 'test-key',
				steps,
			})
		);

		expect(mockUseFormWizardState).toHaveBeenCalledWith({
			initialStep: 0,
			persistData: false,
			persistKey: 'test-key',
			steps,
		});
	});
});

describe('createStateHandlers', () => {
	it('creates state handlers object from state management', () => {
		const setActiveStep = vi.fn();
		const markStepCompleted = vi.fn();
		const markStepError = vi.fn();
		const clearStepError = vi.fn();
		const updateFormData = vi.fn();
		const setIsSubmitting = vi.fn();

		const stateManagement = {
			setActiveStep,
			markStepCompleted,
			markStepError,
			clearStepError,
			updateFormData,
			setIsSubmitting,
		};

		const handlers = createStateHandlers<TestFormData>(stateManagement);

		expect(handlers.setActiveStep).toBe(setActiveStep);
		expect(handlers.markStepCompleted).toBe(markStepCompleted);
		expect(handlers.markStepError).toBe(markStepError);
		expect(handlers.clearStepError).toBe(clearStepError);
		expect(handlers.updateFormData).toBe(updateFormData);
		expect(handlers.setIsSubmitting).toBe(setIsSubmitting);
	});

	it('returns handlers that can be called', () => {
		const setActiveStep = vi.fn();
		const markStepCompleted = vi.fn();
		const markStepError = vi.fn();
		const clearStepError = vi.fn();
		const updateFormData = vi.fn();
		const setIsSubmitting = vi.fn();

		const stateManagement = {
			setActiveStep,
			markStepCompleted,
			markStepError,
			clearStepError,
			updateFormData,
			setIsSubmitting,
		};

		const handlers = createStateHandlers<TestFormData>(stateManagement);

		handlers.setActiveStep(2);
		handlers.markStepCompleted(1);
		handlers.markStepError(0);
		handlers.clearStepError(0);
		handlers.updateFormData({ name: 'Test' });
		handlers.setIsSubmitting(true);

		expect(setActiveStep).toHaveBeenCalledWith(2);
		expect(markStepCompleted).toHaveBeenCalledWith(1);
		expect(markStepError).toHaveBeenCalledWith(0);
		expect(clearStepError).toHaveBeenCalledWith(0);
		expect(updateFormData).toHaveBeenCalledWith({ name: 'Test' });
		expect(setIsSubmitting).toHaveBeenCalledWith(true);
	});

	it('creates new handlers object on each call', () => {
		const stateManagement = {
			setActiveStep: vi.fn(),
			markStepCompleted: vi.fn(),
			markStepError: vi.fn(),
			clearStepError: vi.fn(),
			updateFormData: vi.fn(),
			setIsSubmitting: vi.fn(),
		};

		const handlers1 = createStateHandlers<TestFormData>(stateManagement);
		const handlers2 = createStateHandlers<TestFormData>(stateManagement);

		expect(handlers1).not.toBe(handlers2);
		expect(handlers1.setActiveStep).toBe(handlers2.setActiveStep);
		expect(handlers1.markStepCompleted).toBe(handlers2.markStepCompleted);
	});

	it('handles all handler types correctly', () => {
		const stateManagement = {
			setActiveStep: vi.fn(),
			markStepCompleted: vi.fn(),
			markStepError: vi.fn(),
			clearStepError: vi.fn(),
			updateFormData: vi.fn(),
			setIsSubmitting: vi.fn(),
		};

		const handlers = createStateHandlers<TestFormData>(stateManagement);

		expect(typeof handlers.setActiveStep).toBe('function');
		expect(typeof handlers.markStepCompleted).toBe('function');
		expect(typeof handlers.markStepError).toBe('function');
		expect(typeof handlers.clearStepError).toBe('function');
		expect(typeof handlers.updateFormData).toBe('function');
		expect(typeof handlers.setIsSubmitting).toBe('function');
	});
});
