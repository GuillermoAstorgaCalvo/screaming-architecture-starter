import type { PhoneInputWrapperProps } from './PhoneInputTypes';

export function PhoneInputWrapper({
	fullWidth,
	children,
	...props
}: Readonly<PhoneInputWrapperProps>) {
	return (
		<div className={fullWidth ? 'w-full' : undefined} {...props}>
			{children}
		</div>
	);
}
