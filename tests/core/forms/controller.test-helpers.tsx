/**
 * Shared test utilities for Controller tests
 */

import { screen } from '@testing-library/react';
import { z } from 'zod';

// Test schema for validation
export const testSchema = z.object({
	name: z
		.string()
		.min(1, { message: 'Name is required' })
		.max(50, { message: 'Name must be less than 50 characters' }),
	email: z.email({ message: 'Invalid email address' }),
	age: z
		.number()
		.min(18, { message: 'Must be at least 18' })
		.max(120, { message: 'Must be less than 120' }),
	country: z.string().min(1, { message: 'Country is required' }),
});

export type TestFormData = z.infer<typeof testSchema>;

// Default form values for tests
export const defaultFormValues: TestFormData = {
	name: '',
	email: '',
	age: 0,
	country: '',
};

// Helper component for displaying form values
export function ValuesDisplay({ getValues }: { readonly getValues: () => TestFormData }) {
	const handleGetValues = () => {
		const values = getValues();
		const displayElement = screen.getByTestId('values-display');
		if (displayElement) {
			displayElement.dataset.values = JSON.stringify(values);
		}
	};

	return (
		<>
			<button type="button" data-testid="get-values-button" onClick={handleGetValues}>
				Get Values
			</button>
			<div id="values-display" data-testid="values-display" />
		</>
	);
}

// Helper function to get form values from display
export function getFormValuesFromDisplay(): TestFormData {
	const valuesDisplay = screen.getByTestId('values-display');
	const valuesAttr = valuesDisplay.dataset.values ?? '{}';
	return JSON.parse(valuesAttr) as TestFormData;
}
