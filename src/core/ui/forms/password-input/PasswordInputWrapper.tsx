import type { PasswordInputWrapperProps } from './PasswordInputTypes';

export function PasswordInputWrapper({
	fullWidth,
	children,
	...props
}: Readonly<PasswordInputWrapperProps>) {
	return (
		<div className={fullWidth ? 'w-full' : undefined} {...props}>
			{children}
		</div>
	);
}
