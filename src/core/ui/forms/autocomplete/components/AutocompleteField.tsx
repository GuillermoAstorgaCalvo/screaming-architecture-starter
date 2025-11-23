import type { AutocompleteFieldProps } from '@core/ui/forms/autocomplete/types/AutocompleteTypes';
import { forwardRef } from 'react';

export interface AutocompleteFieldComponentProps extends AutocompleteFieldProps {}

export const AutocompleteField = forwardRef<
	HTMLInputElement,
	Readonly<AutocompleteFieldComponentProps>
>(
	(
		{ id, className, hasError, ariaDescribedBy, disabled, required, isOpen, menuId, props },
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
				aria-expanded={isOpen ?? false}
				aria-controls={menuId}
				role="combobox"
				{...props}
			/>
		);
	}
);

AutocompleteField.displayName = 'AutocompleteField';
