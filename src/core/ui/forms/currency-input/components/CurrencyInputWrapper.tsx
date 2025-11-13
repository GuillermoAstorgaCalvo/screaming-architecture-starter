import type { CurrencyInputWrapperProps } from '@core/ui/forms/currency-input/types/CurrencyInputTypes';

export function CurrencyInputWrapper({
	fullWidth,
	children,
	...props
}: Readonly<CurrencyInputWrapperProps>) {
	return (
		<div className={fullWidth ? 'w-full' : undefined} {...props}>
			{children}
		</div>
	);
}
