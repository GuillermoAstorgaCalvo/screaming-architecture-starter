import type { StandardSize } from '@src-types/ui/base';
import type { InputHTMLAttributes } from 'react';

import type { NumberInputHandlers } from './NumberInputHandlers';
import type { UseNumberInputStateReturn } from './NumberInputTypes';
import type { NumberInputValueAndCapability } from './NumberInputValue';

export type NumberInputValue = number | string | undefined;

export interface ExtractedNumberInputProps {
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly fullWidth: boolean;
	readonly inputId?: string | undefined;
	readonly className?: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly min?: number | undefined;
	readonly max?: number | undefined;
	readonly step: number;
	readonly value?: NumberInputValue;
	readonly defaultValue?: NumberInputValue;
	readonly onChange?: ((value: number) => void) | undefined;
	readonly rest: Readonly<
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			| 'size'
			| 'id'
			| 'className'
			| 'disabled'
			| 'required'
			| 'aria-invalid'
			| 'aria-describedby'
			| 'type'
			| 'min'
			| 'max'
			| 'step'
			| 'value'
			| 'defaultValue'
		>
	>;
}

export interface UseNumberInputHandlersOptions {
	readonly valueAndCapability: NumberInputValueAndCapability;
	readonly min?: number | undefined;
	readonly max?: number | undefined;
	readonly step: number;
	readonly disabled?: boolean | undefined;
	readonly onChange?: ((value: number) => void) | undefined;
}

export interface UseNumberInputFieldPropsOptions {
	readonly state: UseNumberInputStateReturn;
	readonly extracted: ExtractedNumberInputProps;
	readonly valueAndCapability: NumberInputValueAndCapability;
	readonly handlers: NumberInputHandlers;
}
