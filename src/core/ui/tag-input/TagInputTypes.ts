import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, InputHTMLAttributes, KeyboardEvent, ReactNode } from 'react';

export interface TagInputWrapperProps extends HTMLAttributes<HTMLDivElement> {
	readonly fullWidth: boolean;
	readonly children: ReactNode;
}

export interface TagInputFieldProps {
	readonly id: string | undefined;
	readonly className: string;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly tags: readonly string[];
	readonly onRemoveTag: (tag: string) => void;
	readonly chipSize?: StandardSize | undefined;
	readonly chipVariant?:
		| 'default'
		| 'primary'
		| 'success'
		| 'warning'
		| 'error'
		| 'info'
		| undefined;
	readonly props: Readonly<
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			| 'size'
			| 'id'
			| 'className'
			| 'disabled'
			| 'required'
			| 'aria-invalid'
			| 'aria-describedby'
			| 'value'
			| 'onChange'
		>
	>;
	readonly value: string;
	readonly onChange: (value: string) => void;
	readonly onKeyDown?: ((event: KeyboardEvent<HTMLInputElement>) => void) | undefined;
	readonly placeholder?: string | undefined;
	readonly maxTags?: number | undefined;
}

export interface TagInputMessagesProps {
	readonly inputId: string;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
}

export interface TagInputLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean | undefined;
}

export interface UseTagInputStateOptions {
	readonly inputId?: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly className?: string | undefined;
}

export interface UseTagInputStateReturn {
	readonly finalId: string | undefined;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly inputClasses: string;
}

export interface TagInputContentProps {
	readonly state: UseTagInputStateReturn;
	readonly fieldProps: Readonly<TagInputFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}
