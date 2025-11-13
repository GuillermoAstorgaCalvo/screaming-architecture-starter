import type { InputHTMLAttributes } from 'react';

import type { EmailInputFieldProps } from './EmailInputTypes';

interface EmailInputProps {
	readonly id: string | undefined;
	readonly className: string;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean;
	readonly required?: boolean;
	readonly inputProps: Readonly<
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			| 'size'
			| 'id'
			| 'className'
			| 'disabled'
			| 'required'
			| 'aria-invalid'
			| 'aria-describedby'
			| 'type'
		>
	>;
}

function EmailInput({
	id,
	className,
	hasError,
	ariaDescribedBy,
	disabled,
	required,
	inputProps,
}: Readonly<EmailInputProps>) {
	return (
		<input
			id={id}
			type="email"
			className={className}
			disabled={disabled}
			required={required}
			aria-invalid={hasError}
			aria-describedby={ariaDescribedBy}
			{...inputProps}
		/>
	);
}

export function EmailInputField({
	id,
	className,
	hasError,
	ariaDescribedBy,
	disabled,
	required,
	props: inputProps,
}: Readonly<EmailInputFieldProps>) {
	return (
		<div className="relative">
			<EmailInput
				id={id}
				className={className}
				hasError={hasError}
				ariaDescribedBy={ariaDescribedBy}
				{...(disabled !== undefined && { disabled })}
				{...(required !== undefined && { required })}
				inputProps={inputProps}
			/>
		</div>
	);
}
