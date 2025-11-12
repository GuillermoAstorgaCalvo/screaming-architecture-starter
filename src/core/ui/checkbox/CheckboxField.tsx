import { handleDisabledChange, handleDisabledClick } from './CheckboxHandlers';
import type { CheckboxFieldProps } from './CheckboxTypes';

export function CheckboxField({
	id,
	className,
	ariaDescribedBy,
	disabled,
	required,
	checked,
	defaultChecked,
	props: inputProps,
}: Readonly<CheckboxFieldProps>) {
	return (
		<input
			type="checkbox"
			id={id}
			className={className}
			disabled={disabled}
			required={required}
			aria-describedby={ariaDescribedBy}
			checked={checked}
			defaultChecked={defaultChecked}
			{...inputProps}
			onChange={disabled ? handleDisabledChange : inputProps.onChange}
			onClick={disabled ? handleDisabledClick : inputProps.onClick}
		/>
	);
}
