import type { InputWrapperProps } from '@core/ui/forms/input/types/InputTypes';

export function InputWrapper({ fullWidth, children, ...props }: Readonly<InputWrapperProps>) {
	return (
		<div className={fullWidth ? 'w-full' : undefined} {...props}>
			{children}
		</div>
	);
}
