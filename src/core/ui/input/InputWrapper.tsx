import type { InputWrapperProps } from './InputTypes';

export function InputWrapper({ fullWidth, children, ...props }: Readonly<InputWrapperProps>) {
	return (
		<div className={fullWidth ? 'w-full' : undefined} {...props}>
			{children}
		</div>
	);
}
