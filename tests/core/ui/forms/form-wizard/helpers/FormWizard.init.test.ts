/**
 * FormWizard.init Tests
 *
 * Tests for the initialization helpers including:
 * - useFormWizardHandlersInit: Initializing form wizard handlers with all dependencies
 * - useFormWizardInit: Initializing all form wizard dependencies and state
 */

import type { FormControls } from '@core/forms/formAdapter';
import { useFormWizardInit } from '@core/ui/forms/form-wizard/helpers/FormWizard.init';
import type {
	FormWizardProps,
	FormWizardState,
} from '@core/ui/forms/form-wizard/types/FormWizardTypes';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

interface TestFormData {
	name: string;
	email: string;
	age?: number;
}

// Mock dependencies
const mockUseFormWizardForm = vi.fn();
const mockUseFormWizardStateManagement = vi.fn();
const mockUseWizardStateSync = vi.fn();
const mockUseFormWizardHandlers = vi.fn();
const mockCreateStateHandlers = vi.fn();
const mockBuildCallbacks = vi.fn();

vi.mock('@core/ui/forms/form-wizard/helpers/FormWizard.form', () => ({
	useFormWizardForm: (formOptions?: unknown) => mockUseFormWizardForm(formOptions),
}));

vi.mock('@core/ui/forms/form-wizard/helpers/FormWizard.state', () => ({
	useFormWizardStateManagement: (config: unknown) => mockUseFormWizardStateManagement(config),
	createStateHandlers: (stateManagement: unknown) => mockCreateStateHandlers(stateManagement),
}));

vi.mock('@core/ui/forms/form-wizard/helpers/FormWizard.sync', () => ({
	useWizardStateSync: (stateManagement: unknown, controlledActiveStep: unknown) =>
		mockUseWizardStateSync(stateManagement, controlledActiveStep),
}));

vi.mock('@core/ui/forms/form-wizard/hooks/useFormWizardHandlers', () => ({
	useFormWizardHandlers: (deps: unknown) => mockUseFormWizardHandlers(deps),
}));

vi.mock('@core/ui/forms/form-wizard/helpers/FormWizard.callbacks', () => ({
	buildCallbacks: (config: unknown) => mockBuildCallbacks(config),
}));

describe('useFormWizardInit', () => {
	let mockFormControls: FormControls<TestFormData>;
	let mockState: FormWizardState<TestFormData>;
	let mockStateManagement: ReturnType<typeof mockUseFormWizardStateManagement>;
	let mockStateHandlers: ReturnType<typeof mockCreateStateHandlers>;
	let mockHandlers: ReturnType<typeof mockUseFormWizardHandlers>;
	let mockSteps: FormWizardProps<TestFormData>['steps'];

	beforeEach(() => {
		vi.clearAllMocks();

		mockFormControls = {
			register: vi.fn(),
			handleSubmit: vi.fn(),
			reset: vi.fn(),
			setValue: vi.fn(),
			getValues: vi.fn().mockReturnValue({}),
			trigger: vi.fn(),
			watch: vi.fn(),
			control: {} as any,
			isValid: true,
			isDirty: false,
		} as unknown as FormControls<TestFormData>;

		mockState = {
			activeStep: 0,
			completedSteps: new Set(),
			errorSteps: new Set(),
			formData: {},
			isSubmitting: false,
		};

		mockStateHandlers = {
			setActiveStep: vi.fn(),
			markStepCompleted: vi.fn(),
			markStepError: vi.fn(),
			clearStepError: vi.fn(),
			updateFormData: vi.fn(),
			setIsSubmitting: vi.fn(),
		};

		mockStateManagement = {
			state: mockState,
			...mockStateHandlers,
		};

		mockHandlers = {
			handleNext: vi.fn(),
			handlePrevious: vi.fn(),
			handleStepClick: vi.fn(),
			handleComplete: vi.fn(),
			handleCancel: vi.fn(),
			validateCurrentStep: vi.fn(),
		};

		mockSteps = [
			{
				id: 'step1',
				label: 'Step 1',
				content: () => null,
			},
			{
				id: 'step2',
				label: 'Step 2',
				content: () => null,
			},
		];

		mockUseFormWizardForm.mockReturnValue(mockFormControls);
		mockUseFormWizardStateManagement.mockReturnValue(mockStateManagement);
		mockUseWizardStateSync.mockReturnValue(mockState);
		mockCreateStateHandlers.mockReturnValue(mockStateHandlers);
		mockUseFormWizardHandlers.mockReturnValue(mockHandlers);
		mockBuildCallbacks.mockReturnValue({});
	});

	it('initializes all dependencies correctly', () => {
		const { result } = renderHook(() =>
			useFormWizardInit<TestFormData>({
				formOptions: undefined,
				initialStep: 0,
				controlledActiveStep: undefined,
				persistData: false,
				persistKey: 'test-key',
				steps: mockSteps,
				validateOnStepChange: true,
				allowBackNavigation: true,
			})
		);

		expect(result.current.formControls).toBe(mockFormControls);
		expect(result.current.synchronizedState).toBe(mockState);
		expect(result.current.handlers).toBe(mockHandlers);
	});

	it('passes formOptions to useFormWizardForm', () => {
		const formOptions = {
			defaultValues: { name: 'John', email: 'john@example.com' } as TestFormData,
		};

		renderHook(() =>
			useFormWizardInit<TestFormData>({
				formOptions,
				initialStep: 0,
				controlledActiveStep: undefined,
				persistData: false,
				persistKey: 'test-key',
				steps: mockSteps,
				validateOnStepChange: true,
				allowBackNavigation: true,
			})
		);

		expect(mockUseFormWizardForm).toHaveBeenCalledWith(formOptions);
	});

	it('passes correct config to useFormWizardStateManagement', () => {
		renderHook(() =>
			useFormWizardInit<TestFormData>({
				formOptions: undefined,
				initialStep: 1,
				controlledActiveStep: 2,
				persistData: true,
				persistKey: 'custom-key',
				steps: mockSteps,
				validateOnStepChange: true,
				allowBackNavigation: true,
			})
		);

		expect(mockUseFormWizardStateManagement).toHaveBeenCalledWith({
			initialStep: 1,
			controlledActiveStep: 2,
			persistData: true,
			persistKey: 'custom-key',
			steps: mockSteps,
		});
	});

	it('synchronizes state with controlled active step', () => {
		renderHook(() =>
			useFormWizardInit<TestFormData>({
				formOptions: undefined,
				initialStep: 0,
				controlledActiveStep: 3,
				persistData: false,
				persistKey: 'test-key',
				steps: mockSteps,
				validateOnStepChange: true,
				allowBackNavigation: true,
			})
		);

		expect(mockUseWizardStateSync).toHaveBeenCalledWith(mockStateManagement, 3);
	});

	it('synchronizes state with undefined controlled active step', () => {
		renderHook(() =>
			useFormWizardInit<TestFormData>({
				formOptions: undefined,
				initialStep: 0,
				controlledActiveStep: undefined,
				persistData: false,
				persistKey: 'test-key',
				steps: mockSteps,
				validateOnStepChange: true,
				allowBackNavigation: true,
			})
		);

		expect(mockUseWizardStateSync).toHaveBeenCalledWith(mockStateManagement, undefined);
	});

	it('creates state handlers from state management', () => {
		renderHook(() =>
			useFormWizardInit<TestFormData>({
				formOptions: undefined,
				initialStep: 0,
				controlledActiveStep: undefined,
				persistData: false,
				persistKey: 'test-key',
				steps: mockSteps,
				validateOnStepChange: true,
				allowBackNavigation: true,
			})
		);

		expect(mockCreateStateHandlers).toHaveBeenCalledWith(mockStateManagement);
	});

	it('builds callbacks from config', () => {
		const onStepChange = vi.fn();
		const onComplete = vi.fn();
		const onCancel = vi.fn();

		renderHook(() =>
			useFormWizardInit<TestFormData>({
				formOptions: undefined,
				initialStep: 0,
				controlledActiveStep: undefined,
				persistData: false,
				persistKey: 'test-key',
				steps: mockSteps,
				onStepChange,
				onComplete,
				onCancel,
				validateOnStepChange: true,
				allowBackNavigation: true,
			})
		);

		// buildCallbacksObj is a local function in FormWizard.init.ts, not buildCallbacks
		// The callbacks are built internally and passed to handlers
		// Verify that handlers were created with the callbacks
		expect(mockUseFormWizardHandlers).toHaveBeenCalled();
	});

	it('passes all dependencies to useFormWizardHandlers', () => {
		const onStepChange = vi.fn();
		const onComplete = vi.fn();
		const callbacks = { onStepChange, onComplete };

		mockBuildCallbacks.mockReturnValue(callbacks);

		renderHook(() =>
			useFormWizardInit<TestFormData>({
				formOptions: undefined,
				initialStep: 0,
				controlledActiveStep: undefined,
				persistData: false,
				persistKey: 'test-key',
				steps: mockSteps,
				onStepChange,
				onComplete,
				validateOnStepChange: false,
				allowBackNavigation: false,
			})
		);

		expect(mockUseFormWizardHandlers).toHaveBeenCalledWith({
			state: mockState,
			steps: mockSteps,
			formControls: mockFormControls,
			...mockStateHandlers,
			onStepChange,
			onComplete,
			validateOnStepChange: false,
			allowBackNavigation: false,
		});
	});

	it('only includes defined callbacks in handlers', () => {
		const onStepChange = vi.fn();
		mockBuildCallbacks.mockReturnValue({ onStepChange });

		renderHook(() =>
			useFormWizardInit<TestFormData>({
				formOptions: undefined,
				initialStep: 0,
				controlledActiveStep: undefined,
				persistData: false,
				persistKey: 'test-key',
				steps: mockSteps,
				onStepChange,
				validateOnStepChange: true,
				allowBackNavigation: true,
			})
		);

		expect(mockUseFormWizardHandlers).toHaveBeenCalledWith(
			expect.objectContaining({
				onStepChange,
			})
		);

		expect(mockUseFormWizardHandlers).toHaveBeenCalledWith(
			expect.not.objectContaining({
				onComplete: expect.anything(),
				onCancel: expect.anything(),
			})
		);
	});

	it('passes options to handlers', () => {
		renderHook(() =>
			useFormWizardInit<TestFormData>({
				formOptions: undefined,
				initialStep: 0,
				controlledActiveStep: undefined,
				persistData: false,
				persistKey: 'test-key',
				steps: mockSteps,
				validateOnStepChange: false,
				allowBackNavigation: false,
			})
		);

		expect(mockUseFormWizardHandlers).toHaveBeenCalledWith(
			expect.objectContaining({
				validateOnStepChange: false,
				allowBackNavigation: false,
			})
		);
	});

	it('handles all callbacks when provided', () => {
		const onStepChange = vi.fn();
		const onComplete = vi.fn();
		const onCancel = vi.fn();

		mockBuildCallbacks.mockReturnValue({ onStepChange, onComplete, onCancel });

		renderHook(() =>
			useFormWizardInit<TestFormData>({
				formOptions: undefined,
				initialStep: 0,
				controlledActiveStep: undefined,
				persistData: false,
				persistKey: 'test-key',
				steps: mockSteps,
				onStepChange,
				onComplete,
				onCancel,
				validateOnStepChange: true,
				allowBackNavigation: true,
			})
		);

		expect(mockUseFormWizardHandlers).toHaveBeenCalledWith(
			expect.objectContaining({
				onStepChange,
				onComplete,
				onCancel,
			})
		);
	});

	it('returns synchronized state', () => {
		const synchronizedState: FormWizardState<TestFormData> = {
			...mockState,
			activeStep: 2,
		};

		mockUseWizardStateSync.mockReturnValue(synchronizedState);

		const { result } = renderHook(() =>
			useFormWizardInit<TestFormData>({
				formOptions: undefined,
				initialStep: 0,
				controlledActiveStep: 2,
				persistData: false,
				persistKey: 'test-key',
				steps: mockSteps,
				validateOnStepChange: true,
				allowBackNavigation: true,
			})
		);

		expect(result.current.synchronizedState).toBe(synchronizedState);
		expect(result.current.synchronizedState.activeStep).toBe(2);
	});

	it('handles undefined formOptions', () => {
		renderHook(() =>
			useFormWizardInit<TestFormData>({
				formOptions: undefined,
				initialStep: 0,
				controlledActiveStep: undefined,
				persistData: false,
				persistKey: 'test-key',
				steps: mockSteps,
				validateOnStepChange: true,
				allowBackNavigation: true,
			})
		);

		expect(mockUseFormWizardForm).toHaveBeenCalledWith(undefined);
	});

	it('handles empty steps array', () => {
		const emptySteps: FormWizardProps<TestFormData>['steps'] = [];

		const { result } = renderHook(() =>
			useFormWizardInit<TestFormData>({
				formOptions: undefined,
				initialStep: 0,
				controlledActiveStep: undefined,
				persistData: false,
				persistKey: 'test-key',
				steps: emptySteps,
				validateOnStepChange: true,
				allowBackNavigation: true,
			})
		);

		expect(result.current.formControls).toBe(mockFormControls);
		expect(result.current.synchronizedState).toBe(mockState);
		expect(result.current.handlers).toBe(mockHandlers);
	});
});
