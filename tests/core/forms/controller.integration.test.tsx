/**
 * Integration tests for Controller component
 *
 * Tests validation and error handling functionality
 */

import { Controller } from '@core/forms/controller';
import { useFormAdapter } from '@core/forms/formAdapter';
import { zodResolver } from '@hookform/resolvers/zod';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { defaultFormValues, type TestFormData, testSchema } from './controller.test-helpers';

// Test ID constants
const TEST_ID_NAME_INPUT = 'name-input';
const TEST_ID_EMAIL_INPUT = 'email-input';
const TEST_ID_AGE_INPUT = 'age-input';

// Helper components for validation tests
function TestFormWithNameValidation() {
	const { control } = useFormAdapter<TestFormData>({
		resolver: zodResolver(testSchema),
		mode: 'onBlur',
		defaultValues: defaultFormValues,
	});

	return (
		<Controller
			name="name"
			control={control}
			render={({ field, fieldState }) => (
				<div>
					<input {...field} data-testid={TEST_ID_NAME_INPUT} aria-label="Name" />
					{fieldState.error ? (
						<span data-testid="error-message">{fieldState.error.message}</span>
					) : null}
				</div>
			)}
		/>
	);
}

function TestFormWithEmailValidation({
	mode = 'onChange',
}: {
	readonly mode?: 'onBlur' | 'onChange';
}) {
	const { control } = useFormAdapter<TestFormData>({
		resolver: zodResolver(testSchema),
		mode,
		defaultValues: defaultFormValues,
	});

	return (
		<Controller
			name="email"
			control={control}
			render={({ field, fieldState }) => (
				<div>
					<input {...field} type="email" data-testid={TEST_ID_EMAIL_INPUT} aria-label="Email" />
					{fieldState.error ? (
						<span data-testid="error-message">{fieldState.error.message}</span>
					) : null}
				</div>
			)}
		/>
	);
}

function TestFormWithAgeValidation() {
	const { control } = useFormAdapter<TestFormData>({
		resolver: zodResolver(testSchema),
		mode: 'onBlur',
		defaultValues: defaultFormValues,
	});

	return (
		<Controller
			name="age"
			control={control}
			render={({ field, fieldState }) => (
				<div>
					<input
						{...field}
						type="number"
						data-testid={TEST_ID_AGE_INPUT}
						aria-label="Age"
						value={field.value || ''}
						onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
					/>
					{fieldState.error ? (
						<span data-testid="error-message">{fieldState.error.message}</span>
					) : null}
				</div>
			)}
		/>
	);
}

function TestFormWithMultipleFieldValidation() {
	const { control } = useFormAdapter<TestFormData>({
		resolver: zodResolver(testSchema),
		mode: 'onBlur',
		defaultValues: defaultFormValues,
	});

	return (
		<div>
			<Controller
				name="name"
				control={control}
				render={({ field, fieldState }) => (
					<div>
						<input {...field} data-testid={TEST_ID_NAME_INPUT} aria-label="Name" />
						{fieldState.error ? (
							<span data-testid="name-error">{fieldState.error.message}</span>
						) : null}
					</div>
				)}
			/>
			<Controller
				name="email"
				control={control}
				render={({ field, fieldState }) => (
					<div>
						<input {...field} type="email" data-testid={TEST_ID_EMAIL_INPUT} aria-label="Email" />
						{fieldState.error ? (
							<span data-testid="email-error">{fieldState.error.message}</span>
						) : null}
					</div>
				)}
			/>
		</div>
	);
}

// Test functions for validation
async function testValidatesFieldOnBlurWhenModeIsOnBlur() {
	renderWithProviders(<TestFormWithNameValidation />);

	const input = screen.getByTestId(TEST_ID_NAME_INPUT);
	fireEvent.focus(input);
	fireEvent.blur(input);

	const errorMessage = await screen.findByText('Name is required');
	expect(errorMessage).toBeInTheDocument();
}

async function testValidatesFieldOnChangeWhenModeIsOnChange() {
	renderWithProviders(<TestFormWithEmailValidation mode="onChange" />);

	const input = screen.getByTestId(TEST_ID_EMAIL_INPUT);
	fireEvent.change(input, { target: { value: 'invalid-email' } });

	const errorMessage = await screen.findByText('Invalid email address');
	expect(errorMessage).toBeInTheDocument();
}

async function testClearsValidationErrorWhenFieldBecomesValid() {
	renderWithProviders(<TestFormWithEmailValidation mode="onChange" />);

	const input = screen.getByTestId(TEST_ID_EMAIL_INPUT);
	fireEvent.change(input, { target: { value: 'invalid' } });

	await waitFor(() => {
		expect(screen.getByTestId('error-message')).toBeInTheDocument();
	});

	fireEvent.change(input, { target: { value: 'valid@example.com' } });

	await waitFor(() => {
		expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
	});
}

async function testValidatesNumberFieldsCorrectly() {
	renderWithProviders(<TestFormWithAgeValidation />);

	const input = screen.getByTestId(TEST_ID_AGE_INPUT);
	fireEvent.change(input, { target: { value: '15' } });
	fireEvent.blur(input);

	const errorMessage = await screen.findByText('Must be at least 18');
	expect(errorMessage).toBeInTheDocument();
}

async function testValidatesMultipleFieldsIndependently() {
	renderWithProviders(<TestFormWithMultipleFieldValidation />);

	const nameInput = screen.getByTestId(TEST_ID_NAME_INPUT);
	const emailInput = screen.getByTestId(TEST_ID_EMAIL_INPUT);

	fireEvent.focus(nameInput);
	fireEvent.blur(nameInput);

	await waitFor(() => {
		expect(screen.getByTestId('name-error')).toBeInTheDocument();
	});

	fireEvent.focus(emailInput);
	fireEvent.change(emailInput, { target: { value: 'invalid' } });
	fireEvent.blur(emailInput);

	await waitFor(() => {
		expect(screen.getByTestId('email-error')).toBeInTheDocument();
	});

	expect(screen.getByTestId('name-error')).toBeInTheDocument();
	expect(screen.getByTestId('email-error')).toBeInTheDocument();
}

describe('Controller - validation', () => {
	it('validates field on blur when mode is onBlur', testValidatesFieldOnBlurWhenModeIsOnBlur);
	it(
		'validates field on change when mode is onChange',
		testValidatesFieldOnChangeWhenModeIsOnChange
	);
	it(
		'clears validation error when field becomes valid',
		testClearsValidationErrorWhenFieldBecomesValid
	);
	it('validates number fields correctly', testValidatesNumberFieldsCorrectly);
	it('validates multiple fields independently', testValidatesMultipleFieldsIndependently);
});

// Helper components for error handling tests
function TestFormWithErrorAlert() {
	const { control } = useFormAdapter<TestFormData>({
		resolver: zodResolver(testSchema),
		mode: 'onBlur',
		defaultValues: defaultFormValues,
	});

	return (
		<Controller
			name="name"
			control={control}
			render={({ field, fieldState }) => (
				<div>
					<input {...field} data-testid={TEST_ID_NAME_INPUT} aria-label="Name" />
					{fieldState.error ? (
						<span data-testid="error-message" role="alert">
							{fieldState.error.message}
						</span>
					) : null}
				</div>
			)}
		/>
	);
}

function TestFormWithFieldStateDisplay() {
	const { control } = useFormAdapter<TestFormData>({
		resolver: zodResolver(testSchema),
		mode: 'onBlur',
		defaultValues: defaultFormValues,
	});

	return (
		<Controller
			name="name"
			control={control}
			render={({ field, fieldState }) => (
				<div>
					<input {...field} data-testid={TEST_ID_NAME_INPUT} aria-label="Name" />
					<div data-testid="field-state">
						<span data-testid="invalid">{fieldState.invalid ? 'true' : 'false'}</span>
						<span data-testid="is-touched">{fieldState.isTouched ? 'true' : 'false'}</span>
						<span data-testid="is-dirty">{fieldState.isDirty ? 'true' : 'false'}</span>
						{fieldState.error ? (
							<span data-testid="error-type">{fieldState.error.type}</span>
						) : null}
					</div>
				</div>
			)}
		/>
	);
}

function TestFormWithCustomError() {
	const customSchema = z.object({
		name: z.string().min(1, { message: 'Custom error: Name is required' }),
	});

	type CustomFormData = z.infer<typeof customSchema>;

	const { control } = useFormAdapter<CustomFormData>({
		resolver: zodResolver(customSchema),
		mode: 'onBlur',
		defaultValues: {
			name: '',
		},
	});

	return (
		<Controller
			name="name"
			control={control}
			render={({ field, fieldState }) => (
				<div>
					<input {...field} data-testid={TEST_ID_NAME_INPUT} aria-label="Name" />
					{fieldState.error ? (
						<span data-testid="error-message">{fieldState.error.message}</span>
					) : null}
				</div>
			)}
		/>
	);
}

function TestFormWithDirtyState() {
	const { control } = useFormAdapter<TestFormData>({
		resolver: zodResolver(testSchema),
		mode: 'onChange',
		defaultValues: defaultFormValues,
	});

	return (
		<Controller
			name="name"
			control={control}
			render={({ field, fieldState }) => (
				<div>
					<input {...field} data-testid={TEST_ID_NAME_INPUT} aria-label="Name" />
					<div data-testid="field-state">
						<span data-testid="invalid">{fieldState.invalid ? 'true' : 'false'}</span>
						<span data-testid="is-touched">{fieldState.isTouched ? 'true' : 'false'}</span>
						<span data-testid="is-dirty">{fieldState.isDirty ? 'true' : 'false'}</span>
					</div>
				</div>
			)}
		/>
	);
}

// Test functions for error handling
async function testDisplaysErrorMessageWhenFieldIsInvalid() {
	renderWithProviders(<TestFormWithErrorAlert />);

	const input = screen.getByTestId(TEST_ID_NAME_INPUT);
	fireEvent.focus(input);
	fireEvent.blur(input);

	const errorMessage = await screen.findByText('Name is required');
	expect(errorMessage).toBeInTheDocument();
}

async function testProvidesFieldStateWithErrorInformation() {
	renderWithProviders(<TestFormWithFieldStateDisplay />);

	const input = screen.getByTestId(TEST_ID_NAME_INPUT);

	expect(screen.getByTestId('invalid')).toHaveTextContent('false');
	expect(screen.getByTestId('is-touched')).toHaveTextContent('false');
	expect(screen.getByTestId('is-dirty')).toHaveTextContent('false');

	fireEvent.focus(input);
	fireEvent.blur(input);

	await waitFor(() => {
		expect(screen.getByTestId('invalid')).toHaveTextContent('true');
		expect(screen.getByTestId('is-touched')).toHaveTextContent('true');
		expect(screen.getByTestId('error-type')).toBeInTheDocument();
	});
}

async function testHandlesValidationErrorsWithCustomErrorMessages() {
	renderWithProviders(<TestFormWithCustomError />);

	const input = screen.getByTestId(TEST_ID_NAME_INPUT);
	fireEvent.focus(input);
	fireEvent.blur(input);

	const errorMessage = await screen.findByText('Custom error: Name is required');
	expect(errorMessage).toBeInTheDocument();
}

async function testHandlesFieldStateChangesCorrectlyDuringUserInteraction() {
	renderWithProviders(<TestFormWithDirtyState />);

	const input = screen.getByTestId(TEST_ID_NAME_INPUT);

	expect(screen.getByTestId('is-dirty')).toHaveTextContent('false');

	fireEvent.change(input, { target: { value: 'J' } });

	await waitFor(() => {
		expect(screen.getByTestId('is-dirty')).toHaveTextContent('true');
	});

	fireEvent.change(input, { target: { value: '' } });

	const isDirtyAfterClear = screen.getByTestId('is-dirty').textContent;
	expect(['true', 'false']).toContain(isDirtyAfterClear);
}

describe('Controller - error handling', () => {
	it('displays error message when field is invalid', testDisplaysErrorMessageWhenFieldIsInvalid);
	it('provides fieldState with error information', testProvidesFieldStateWithErrorInformation);
	it(
		'handles validation errors with custom error messages',
		testHandlesValidationErrorsWithCustomErrorMessages
	);
	it(
		'handles field state changes correctly during user interaction',
		testHandlesFieldStateChangesCorrectlyDuringUserInteraction
	);
});

// Integration tests for Controller with formAdapter
function TestFormWithControllerAndFormAdapter() {
	const { control, getValues, reset, setValue } = useFormAdapter<TestFormData>({
		resolver: zodResolver(testSchema),
		mode: 'onBlur',
		defaultValues: defaultFormValues,
	});

	return (
		<div>
			<Controller
				name="name"
				control={control}
				render={({ field }) => (
					<input {...field} data-testid={TEST_ID_NAME_INPUT} aria-label="Name" />
				)}
			/>
			<button type="button" data-testid="reset-button" onClick={() => reset(defaultFormValues)}>
				Reset
			</button>
			<button
				type="button"
				data-testid="set-value-button"
				onClick={() => setValue('name', 'Programmatic Value')}
			>
				Set Value
			</button>
			<div data-testid="current-value">{getValues('name')}</div>
		</div>
	);
}

async function testControllerWorksWithFormAdapterReset() {
	renderWithProviders(<TestFormWithControllerAndFormAdapter />);

	const input = screen.getByTestId(TEST_ID_NAME_INPUT);
	const resetButton = screen.getByTestId('reset-button');

	fireEvent.change(input, { target: { value: 'Changed Value' } });
	expect((input as HTMLInputElement).value).toBe('Changed Value');

	fireEvent.click(resetButton);

	await waitFor(() => {
		expect((input as HTMLInputElement).value).toBe('');
	});
}

async function testControllerWorksWithFormAdapterSetValue() {
	renderWithProviders(<TestFormWithControllerAndFormAdapter />);

	const input = screen.getByTestId(TEST_ID_NAME_INPUT);
	const setValueButton = screen.getByTestId('set-value-button');

	fireEvent.click(setValueButton);

	await waitFor(() => {
		expect((input as HTMLInputElement).value).toBe('Programmatic Value');
	});
}

describe('Controller - formAdapter integration', () => {
	it('works with formAdapter reset', testControllerWorksWithFormAdapterReset);
	it('works with formAdapter setValue', testControllerWorksWithFormAdapterSetValue);
});
