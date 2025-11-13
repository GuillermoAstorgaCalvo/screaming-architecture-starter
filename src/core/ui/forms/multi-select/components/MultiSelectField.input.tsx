import type { FieldInputProps } from '@core/ui/forms/multi-select/types/MultiSelectField.types';
import { forwardRef } from 'react';

export const FieldInput = forwardRef<HTMLInputElement, FieldInputProps>(
	({ id, disabled, required, hasError, ariaDescribedBy, props, onKeyDown }, ref) => {
		return (
			<input
				ref={ref}
				id={id}
				type="text"
				className="flex-1 min-w-[120px] outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
				disabled={disabled}
				required={required}
				aria-invalid={hasError}
				aria-describedby={ariaDescribedBy}
				aria-autocomplete="list"
				{...props}
				onKeyDown={onKeyDown}
			/>
		);
	}
);

FieldInput.displayName = 'FieldInput';
