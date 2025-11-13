import type { ComboboxOption } from '@core/ui/forms/combobox/Combobox';
import type { InputHTMLAttributes, KeyboardEvent, ReactNode, RefObject } from 'react';

export interface UseComboboxStateOptions {
	readonly comboboxId?: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size?: 'sm' | 'md' | 'lg' | undefined;
	readonly className?: string | undefined;
}

export interface UseComboboxStateReturn {
	readonly finalId: string;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly inputClasses: string;
}

export interface ComboboxFieldProps {
	readonly id: string;
	readonly className: string;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
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
			| 'defaultValue'
			| 'onChange'
		>
	>;
}

export interface ComboboxContentProps {
	readonly state: UseComboboxStateReturn;
	readonly fieldProps: Readonly<ComboboxFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
	readonly inputValue: string;
	readonly setInputValue: (value: string) => void;
	readonly isOpen: boolean;
	readonly setIsOpen: (open: boolean) => void;
	readonly filteredOptions: ComboboxOption[];
	readonly highlightedIndex: number;
	readonly setHighlightedIndex: (index: number) => void;
	readonly handleSelect: (option: ComboboxOption) => void;
	readonly handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
	readonly inputRef: RefObject<HTMLInputElement | null>;
	readonly listboxRef: RefObject<HTMLUListElement | null>;
	readonly optionRefs: RefObject<HTMLButtonElement | null>[];
	readonly maxHeight: number;
	readonly emptyState: ReactNode;
	readonly menuId: string;
}
