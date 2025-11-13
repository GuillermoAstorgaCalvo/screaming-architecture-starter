import type { EmailInputWrapperProps } from '@core/ui/forms/email-input/types/EmailInputTypes';

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
