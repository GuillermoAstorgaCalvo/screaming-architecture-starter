import type { ChangeEvent } from 'react';

import type { ColorPickerFieldProps } from './ColorPickerTypes';

export function ColorPickerField({
	id,
	colorPickerClasses,
	ariaDescribedBy,
	disabled,
	required,
	value,
	defaultValue,
	onChange,
	props: inputProps,
}: Readonly<ColorPickerFieldProps>) {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newColor = e.target.value;
		onChange?.(newColor);
		inputProps.onChange?.(e);
	};

	return (
		<input
			type="color"
			id={id}
			className={colorPickerClasses}
			disabled={disabled}
			required={required}
			aria-describedby={ariaDescribedBy}
			value={value}
			defaultValue={defaultValue}
			onChange={handleChange}
			{...inputProps}
		/>
	);
}
