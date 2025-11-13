import type { NumberInputWrapperProps } from '@core/ui/forms/number-input/types/NumberInputTypes';

export function NumberInputWrapper({
	fullWidth,
	children,
	...props
}: Readonly<NumberInputWrapperProps>) {
	return (
		<div className={fullWidth ? 'w-full' : undefined} {...props}>
			{children}
		</div>
	);
}
