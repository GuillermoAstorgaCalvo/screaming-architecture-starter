import { forwardRef } from 'react';

import type { ComboboxFieldProps } from './ComboboxTypes';

export interface ComboboxFieldComponentProps extends ComboboxFieldProps {}

export const ComboboxField = forwardRef<HTMLInputElement, Readonly<ComboboxFieldComponentProps>>(
	({ id, className, hasError, ariaDescribedBy, disabled, required, props }, ref) => {
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
				{...props}
			/>
		);
	}
);

ComboboxField.displayName = 'ComboboxField';
