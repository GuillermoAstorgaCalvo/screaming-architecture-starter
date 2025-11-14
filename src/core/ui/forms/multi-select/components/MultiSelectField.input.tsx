import type { FieldInputProps } from '@core/ui/forms/multi-select/types/MultiSelectField.types';
import { forwardRef } from 'react';

export const FieldInput = forwardRef<HTMLInputElement, FieldInputProps>(
	({ id, disabled, required, hasError, ariaDescribedBy, props, onKeyDown }, ref) => {
		return (
			<input
				ref={ref}
				id={id}
				type="text"
				className="flex-1 outline-none bg-transparent text-text-primary dark:text-text-primary placeholder:text-text-muted dark:placeholder:text-text-muted"
				style={{ minWidth: 'calc(var(--spacing-3xl) * 2.5)' }}
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
