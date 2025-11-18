/**
 * Tests for Controller component
 *
 * Tests the Controller re-export from react-hook-form, ensuring:
 * - Component export
 * - Form control functionality
 */

import { Controller } from '@core/forms/controller';
import { useFormAdapter } from '@core/forms/formAdapter';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

import {
	defaultFormValues,
	getFormValuesFromDisplay,
	type TestFormData,
	ValuesDisplay,
} from './controller.test-helpers';

const NAME_INPUT_LABEL = 'Name';
const NAME_INPUT_TEST_ID = 'name-input';

describe('Controller - component export', () => {
	it('exports Controller component', () => {
		expect(Controller).toBeDefined();
		expect(typeof Controller).toBe('function');
	});
});

// Helper components for form control tests
function TestFormWithValuesDisplay() {
	const { control, getValues } = useFormAdapter<TestFormData>({
		defaultValues: defaultFormValues,
	});

	return (
		<div>
			<Controller
				name="name"
				control={control}
				render={({ field }) => (
					<input {...field} data-testid={NAME_INPUT_TEST_ID} aria-label={NAME_INPUT_LABEL} />
				)}
			/>
			<ValuesDisplay getValues={getValues} />
		</div>
	);
}

function TestFormWithNameInput() {
	const { control } = useFormAdapter<TestFormData>({
		defaultValues: defaultFormValues,
	});

	return (
		<Controller
			name="name"
			control={control}
			render={({ field }) => (
				<input {...field} data-testid={NAME_INPUT_TEST_ID} aria-label={NAME_INPUT_LABEL} />
			)}
		/>
	);
}

function TestFormWithTouchedIndicator() {
	const { control } = useFormAdapter<TestFormData>({
		defaultValues: defaultFormValues,
	});

	return (
		<Controller
			name="name"
			control={control}
			render={({ field, fieldState }) => (
				<div>
					<input {...field} data-testid={NAME_INPUT_TEST_ID} aria-label={NAME_INPUT_LABEL} />
					{fieldState.isTouched ? <span data-testid="touched-indicator">Touched</span> : null}
				</div>
			)}
		/>
	);
}

function TestFormWithMultipleControllers() {
	const { control, getValues } = useFormAdapter<TestFormData>({
		defaultValues: defaultFormValues,
	});

	return (
		<div>
			<Controller
				name="name"
				control={control}
				render={({ field }) => (
					<input {...field} data-testid={NAME_INPUT_TEST_ID} aria-label={NAME_INPUT_LABEL} />
				)}
			/>
			<Controller
				name="email"
				control={control}
				render={({ field }) => (
					<input {...field} type="email" data-testid="email-input" aria-label="Email" />
				)}
			/>
			<ValuesDisplay getValues={getValues} />
		</div>
	);
}

// Test functions for form control
async function testRendersControlledInputAndUpdatesFormState() {
	renderWithProviders(<TestFormWithValuesDisplay />);

	const input = screen.getByTestId(NAME_INPUT_TEST_ID);
	const getValuesButton = screen.getByRole('button', { name: 'Get Values' });

	fireEvent.change(input, { target: { value: 'John Doe' } });
	fireEvent.click(getValuesButton);

	const values = getFormValuesFromDisplay();
	expect(values.name).toBe('John Doe');
}

function testHandlesOnChangeEventsCorrectly() {
	renderWithProviders(<TestFormWithNameInput />);

	const input = screen.getByTestId(NAME_INPUT_TEST_ID);
	fireEvent.change(input, { target: { value: 'Jane' } });

	expect((input as HTMLInputElement).value).toBe('Jane');
}

async function testHandlesOnBlurEventsCorrectly() {
	renderWithProviders(<TestFormWithTouchedIndicator />);

	const input = screen.getByTestId(NAME_INPUT_TEST_ID);
	fireEvent.focus(input);
	fireEvent.blur(input);

	await waitFor(() => {
		expect(screen.getByTestId('touched-indicator')).toBeInTheDocument();
	});
}

function testWorksWithMultipleControllerInstances() {
	renderWithProviders(<TestFormWithMultipleControllers />);

	const nameInput = screen.getByTestId(NAME_INPUT_TEST_ID);
	const emailInput = screen.getByTestId('email-input');
	const getValuesButton = screen.getByRole('button', { name: 'Get Values' });

	fireEvent.change(nameInput, { target: { value: 'John' } });
	fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
	fireEvent.click(getValuesButton);

	const values = getFormValuesFromDisplay();
	expect(values.name).toBe('John');
	expect(values.email).toBe('john@example.com');
}

describe('Controller - form control', () => {
	it(
		'renders controlled input and updates form state',
		testRendersControlledInputAndUpdatesFormState
	);
	it('handles onChange events correctly', testHandlesOnChangeEventsCorrectly);
	it('handles onBlur events correctly', testHandlesOnBlurEventsCorrectly);
	it('works with multiple Controller instances', testWorksWithMultipleControllerInstances);
});
