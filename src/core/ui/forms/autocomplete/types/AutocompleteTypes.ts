import type { AutocompleteOption } from '@core/ui/forms/autocomplete/Autocomplete';
import type { InputHTMLAttributes, KeyboardEvent, ReactNode, RefObject } from 'react';

export interface UseAutocompleteStateOptions {
	readonly autocompleteId?: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size?: 'sm' | 'md' | 'lg' | undefined;
	readonly className?: string | undefined;
}

export interface UseAutocompleteStateReturn {
	readonly finalId: string;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly inputClasses: string;
}

export interface AutocompleteFieldProps {
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
	> & { value: string };
}

export interface AutocompleteContentProps {
	readonly state: UseAutocompleteStateReturn;
	readonly fieldProps: Readonly<AutocompleteFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
	readonly inputValue: string;
	readonly setInputValue: (value: string) => void;
	readonly isOpen: boolean;
	readonly setIsOpen: (open: boolean) => void;
	readonly filteredOptions: AutocompleteOption[];
	readonly highlightedIndex: number;
	readonly setHighlightedIndex: (index: number) => void;
	readonly handleSelect: (option: AutocompleteOption) => void;
	readonly handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
	readonly inputRef: RefObject<HTMLInputElement | null>;
	readonly listboxRef: RefObject<HTMLUListElement | null>;
	readonly optionRefs: RefObject<HTMLButtonElement | null>[];
	readonly maxHeight: number;
	readonly emptyState: ReactNode;
	readonly menuId: string;
	readonly searchQuery: string;
	readonly highlightMatches?: boolean;
}
