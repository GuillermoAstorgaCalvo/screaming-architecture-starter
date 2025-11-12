import type { CurrencyInputWrapperProps } from './CurrencyInputTypes';

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
