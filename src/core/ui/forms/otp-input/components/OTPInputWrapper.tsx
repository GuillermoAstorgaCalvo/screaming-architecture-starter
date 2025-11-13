import type { OTPInputWrapperProps } from '@core/ui/forms/otp-input/types/OTPInputTypes';

export function OTPInputWrapper({ fullWidth, children, ...props }: Readonly<OTPInputWrapperProps>) {
	return (
		<div className={fullWidth ? 'w-full' : undefined} {...props}>
			{children}
		</div>
	);
}
