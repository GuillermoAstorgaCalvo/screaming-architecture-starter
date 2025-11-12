import type { KeyboardEvent, ReactNode, Ref } from 'react';

import type { MultiSelectOption } from './MultiSelect';
import type { MultiSelectFieldProps } from './MultiSelectTypes';

export interface MultiSelectFieldComponentProps extends MultiSelectFieldProps {
	readonly selectedValues: string[];
	readonly options: MultiSelectOption[];
	readonly onRemoveChip: (value: string) => void;
	readonly handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
	readonly menuId?: string;
	readonly isOpen?: boolean;
}

export interface FieldInputProps {
	readonly ref: Ref<HTMLInputElement>;
	readonly id: string;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly props: MultiSelectFieldProps['props'];
	readonly onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export interface FieldContainerProps {
	readonly selectedOptions: MultiSelectOption[];
	readonly onRemoveChip: (value: string) => void;
	readonly isOpen: boolean;
	readonly menuId?: string | undefined;
	readonly children: ReactNode;
}

export interface PrepareFieldStateParams {
	readonly options: MultiSelectOption[];
	readonly selectedValues: string[];
	readonly onRemoveChip: (value: string) => void;
	readonly handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
	readonly inputProps: MultiSelectFieldProps['props'];
}

export interface FieldState {
	readonly selectedOptions: MultiSelectOption[];
	readonly onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export interface RenderFieldContentParams {
	readonly ref: Ref<HTMLInputElement>;
	readonly id: string;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly inputProps: MultiSelectFieldProps['props'];
	readonly onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
	readonly selectedOptions: MultiSelectOption[];
	readonly onRemoveChip: (value: string) => void;
	readonly isOpen: boolean;
	readonly menuId?: string | undefined;
}
