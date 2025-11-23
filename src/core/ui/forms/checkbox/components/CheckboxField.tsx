import {
	handleDisabledChange,
	handleDisabledClick,
} from '@core/ui/forms/checkbox/helpers/CheckboxHandlers';
import type { CheckboxFieldProps } from '@core/ui/forms/checkbox/types/CheckboxTypes';

export function CheckboxField({
	id,
	className,
	ariaDescribedBy,
	hasError,
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
			aria-invalid={hasError ? true : undefined}
			aria-describedby={ariaDescribedBy}
			checked={checked}
			defaultChecked={defaultChecked}
			{...inputProps}
			onChange={disabled ? handleDisabledChange : inputProps.onChange}
			onClick={disabled ? handleDisabledClick : inputProps.onClick}
		/>
	);
}
