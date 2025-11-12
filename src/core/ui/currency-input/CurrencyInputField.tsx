import type { InputHTMLAttributes } from 'react';

import type { CurrencyInputFieldProps } from './CurrencyInputTypes';

function CurrencySymbol({ currency }: Readonly<{ currency: string }>) {
	// Get currency symbol based on currency code
	const currencySymbols: Record<string, string> = {
		USD: '$',
		EUR: '€',
		GBP: '£',
		JPY: '¥',
		CNY: '¥',
		AUD: 'A$',
		CAD: 'C$',
		CHF: 'CHF',
		INR: '₹',
	};

	const symbol = currencySymbols[currency] ?? currency;

	return (
		<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
			<span className="text-sm font-medium">{symbol}</span>
		</div>
	);
}

interface CurrencyInputProps {
	readonly id: string | undefined;
	readonly className: string;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean;
	readonly required?: boolean;
	readonly inputProps: Readonly<
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			| 'size'
			| 'id'
			| 'className'
			| 'disabled'
			| 'required'
			| 'aria-invalid'
			| 'aria-describedby'
			| 'type'
		>
	>;
}

function CurrencyInput({
	id,
	className,
	hasError,
	ariaDescribedBy,
	disabled,
	required,
	inputProps,
}: Readonly<CurrencyInputProps>) {
	return (
		<input
			id={id}
			type="text"
			inputMode="decimal"
			className={className}
			disabled={disabled}
			required={required}
			aria-invalid={hasError}
			aria-describedby={ariaDescribedBy}
			{...inputProps}
		/>
	);
}

export function CurrencyInputField({
	id,
	className,
	hasError,
	ariaDescribedBy,
	disabled,
	required,
	currency,
	props: inputProps,
}: Readonly<CurrencyInputFieldProps>) {
	return (
		<div className="relative">
			<CurrencySymbol currency={currency} />
			<CurrencyInput
				id={id}
				className={className}
				hasError={hasError}
				ariaDescribedBy={ariaDescribedBy}
				{...(disabled !== undefined && { disabled })}
				{...(required !== undefined && { required })}
				inputProps={inputProps}
			/>
		</div>
	);
}
