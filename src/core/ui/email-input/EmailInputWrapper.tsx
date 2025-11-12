import type { EmailInputWrapperProps } from './EmailInputTypes';

export function EmailInputWrapper({
	fullWidth,
	children,
	...props
}: Readonly<EmailInputWrapperProps>) {
	return (
		<div className={fullWidth ? 'w-full' : undefined} {...props}>
			{children}
		</div>
	);
}
