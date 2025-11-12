import { InputIcon } from './InputIcon';
import type { InputFieldProps } from './InputTypes';

export function InputField({
	id,
	className,
	hasError,
	ariaDescribedBy,
	disabled,
	required,
	leftIcon,
	rightIcon,
	props: inputProps,
}: Readonly<InputFieldProps>) {
	return (
		<div className="relative">
			{leftIcon ? <InputIcon position="left">{leftIcon}</InputIcon> : null}
			<input
				id={id}
				className={className}
				disabled={disabled}
				required={required}
				aria-invalid={hasError}
				aria-describedby={ariaDescribedBy}
				{...inputProps}
			/>
			{rightIcon ? <InputIcon position="right">{rightIcon}</InputIcon> : null}
		</div>
	);
}
