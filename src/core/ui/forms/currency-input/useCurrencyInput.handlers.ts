import type { ChangeEvent } from 'react';

import { parseCurrency } from './CurrencyInputHelpers';

interface CreateCurrencyChangeHandlerOptions {
	readonly onChange?: ((e: ChangeEvent<HTMLInputElement>) => void) | undefined;
}

/**
 * Creates a change handler that parses currency input and calls the provided onChange
 * with a synthetic event containing the parsed numeric value.
 *
 * @param options - Options containing the onChange handler
 * @returns Change event handler that parses currency and calls onChange
 */
export function createCurrencyChangeHandler({
	onChange,
}: Readonly<CreateCurrencyChangeHandlerOptions>): (e: ChangeEvent<HTMLInputElement>) => void {
	return (e: ChangeEvent<HTMLInputElement>) => {
		if (onChange) {
			const parsed = parseCurrency(e.target.value);
			// Create a synthetic event with the parsed number value
			const syntheticEvent = {
				...e,
				target: {
					...e.target,
					value: parsed === undefined ? '' : String(parsed),
				},
			} as ChangeEvent<HTMLInputElement>;
			onChange(syntheticEvent);
		}
	};
}
