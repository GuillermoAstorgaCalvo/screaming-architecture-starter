import type { PasswordInputWrapperProps } from '@core/ui/forms/password-input/types/PasswordInputTypes';

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
