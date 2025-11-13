import { forwardRef } from 'react';

import type { AutocompleteFieldProps } from './AutocompleteTypes';

export interface AutocompleteFieldComponentProps extends AutocompleteFieldProps {}

export const AutocompleteField = forwardRef<
	HTMLInputElement,
	Readonly<AutocompleteFieldComponentProps>
>(({ id, className, hasError, ariaDescribedBy, disabled, required, props }, ref) => {
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
});

AutocompleteField.displayName = 'AutocompleteField';
