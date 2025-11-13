import type { TextareaFieldProps } from '@core/ui/forms/textarea/types/TextareaTypes';

export function TextareaField({
	id,
	className,
	hasError,
	ariaDescribedBy,
	disabled,
	required,
	props: textareaProps,
}: Readonly<TextareaFieldProps>) {
	return (
		<textarea
			id={id}
			className={className}
			disabled={disabled}
			required={required}
			aria-invalid={hasError}
			aria-describedby={ariaDescribedBy}
			{...textareaProps}
		/>
	);
}
