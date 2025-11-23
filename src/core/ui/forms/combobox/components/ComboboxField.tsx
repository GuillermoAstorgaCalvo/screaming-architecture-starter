import type { ComboboxFieldProps } from '@core/ui/forms/combobox/types/ComboboxTypes';
import { forwardRef } from 'react';

export interface ComboboxFieldComponentProps extends ComboboxFieldProps {}

export const ComboboxField = forwardRef<HTMLInputElement, Readonly<ComboboxFieldComponentProps>>(
	(
		{ id, className, hasError, ariaDescribedBy, disabled, required, isOpen, ariaControls, props },
		ref
	) => {
		return (
			<input
				ref={ref}
				id={id}
				type="text"
				className={className}
				disabled={disabled}
				required={required}
				aria-invalid={hasError}
				aria-describedby={ariaDescribedBy}
				aria-autocomplete="list"
				role="combobox"
				aria-expanded={isOpen}
				aria-controls={ariaControls}
				{...props}
			/>
		);
	}
);

ComboboxField.displayName = 'ComboboxField';
