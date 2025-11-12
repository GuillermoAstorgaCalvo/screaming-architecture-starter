import type { CurrencyInputProps } from '@src-types/ui/forms-specialized';

import { CurrencyInputContent } from './CurrencyInputContent';
import { useCurrencyInputProps } from './useCurrencyInput';

/**
 * CurrencyInput - Currency/money input with formatting and currency symbol
 *
 * Features:
 * - Accessible: proper ARIA attributes and relationships
 * - Currency symbol display (left side)
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Dark mode support
 * - Automatic ID generation when label is provided
 * - Supports common currencies (USD, EUR, GBP, JPY, etc.)
 * - Parses and formats currency values
 *
 * @example
 * ```tsx
 * <CurrencyInput
 *   label="Price"
 *   currency="USD"
 *   placeholder="0.00"
 *   required
 *   error={errors.price}
 *   helperText="Enter the price in USD"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <CurrencyInput
 *   label="Amount"
 *   currency="EUR"
 *   value={amount}
 *   onChange={(e) => setAmount(Number.parseFloat(e.target.value))}
 *   size="lg"
 *   fullWidth
 * />
 * ```
 */
export default function CurrencyInput(props: Readonly<CurrencyInputProps>) {
	const { state, fieldProps, label, error, helperText, required, fullWidth } =
		useCurrencyInputProps({
			props,
		});
	return (
		<CurrencyInputContent
			state={state}
			fieldProps={fieldProps}
			label={label}
			error={error}
			helperText={helperText}
			required={required}
			fullWidth={fullWidth}
		/>
	);
}
