import type { NumberInputWrapperProps } from './NumberInputTypes';

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
