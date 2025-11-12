import type { ChangeEvent } from 'react';

import type { ColorInputFieldProps } from './ColorInputTypes';

export function ColorInputField({
	id,
	className,
	hasError,
	ariaDescribedBy,
	disabled,
	required,
	value,
	defaultValue,
	onChange,
	props: inputProps,
}: Readonly<ColorInputFieldProps>) {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newColor = e.target.value;
		onChange?.(newColor);
	};

	return (
		<input
			type="color"
			id={id}
			className={className}
			disabled={disabled}
			required={required}
			aria-invalid={hasError}
			aria-describedby={ariaDescribedBy}
			value={value}
			defaultValue={defaultValue}
			onChange={handleChange}
			{...inputProps}
		/>
	);
}
