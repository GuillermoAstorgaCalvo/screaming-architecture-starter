import type { OTPInputFieldProps } from '@core/ui/forms/otp-input/types/OTPInputTypes';
import type { ChangeEvent, ClipboardEvent, FocusEvent, KeyboardEvent } from 'react';

interface CreateRefCallbackParams {
	readonly index: number;
	readonly inputRefs: OTPInputFieldProps['inputRefs'];
}

export function createInputRefCallback({
	index,
	inputRefs,
}: CreateRefCallbackParams): (el: HTMLInputElement | null) => void {
	return (el: HTMLInputElement | null) => {
		const refs = inputRefs.current;
		if (refs) {
			refs[index] = el;
		}
	};
}

interface AriaAttributesParams {
	readonly index: number;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly length: number;
}

export function getInputAriaAttributes({
	index,
	hasError,
	ariaDescribedBy,
	length,
}: AriaAttributesParams) {
	return {
		'aria-invalid': hasError,
		'aria-describedby': index === 0 ? ariaDescribedBy : undefined,
		'aria-label': `Digit ${index + 1} of ${length}`,
	};
}

interface EventHandlersParams {
	readonly index: number;
	readonly onInput: (index: number, value: string) => void;
	readonly onKeyDown: (index: number, e: KeyboardEvent<HTMLInputElement>) => void;
	readonly onPaste: (e: ClipboardEvent<HTMLInputElement>) => void;
	readonly onFocus: (index: number, e: FocusEvent<HTMLInputElement>) => void;
}

export function getInputEventHandlers({
	index,
	onInput,
	onKeyDown,
	onPaste,
	onFocus,
}: EventHandlersParams) {
	return {
		onChange: (e: ChangeEvent<HTMLInputElement>) => {
			// Don't process input if the element is disabled
			if (e.currentTarget.disabled) {
				return;
			}
			onInput(index, e.currentTarget.value);
		},
		onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => onKeyDown(index, e),
		onPaste: (e: ClipboardEvent<HTMLInputElement>) => {
			// Don't process paste if the element is disabled
			if (e.currentTarget.disabled) {
				return;
			}
			onPaste(e);
		},
		onFocus: (e: FocusEvent<HTMLInputElement>) => onFocus(index, e),
	};
}

interface InputAttributesParams {
	readonly index: number;
	readonly inputId: string;
	readonly inputValue: string;
	readonly className: string;
	readonly disabled: boolean | undefined;
	readonly required: boolean | undefined;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly length: number;
}

export function getInputAttributes({
	index,
	inputId,
	inputValue,
	className,
	disabled,
	required,
	hasError,
	ariaDescribedBy,
	length,
}: InputAttributesParams) {
	return {
		id: inputId,
		type: 'text' as const,
		inputMode: 'numeric' as const,
		pattern: '[0-9]*',
		maxLength: 1,
		value: inputValue,
		className,
		disabled,
		required: required && index === 0 ? true : undefined,
		autoComplete: 'one-time-code' as const,
		...getInputAriaAttributes({ index, hasError, ariaDescribedBy, length }),
	};
}

export interface RenderOTPInputProps {
	readonly index: number;
	readonly inputValue: string;
	readonly inputId: string;
	readonly className: string;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly length: number;
	readonly inputRefs: OTPInputFieldProps['inputRefs'];
	readonly onInput: (index: number, value: string) => void;
	readonly onKeyDown: (index: number, e: KeyboardEvent<HTMLInputElement>) => void;
	readonly onPaste: (e: ClipboardEvent<HTMLInputElement>) => void;
	readonly onFocus: (index: number, e: FocusEvent<HTMLInputElement>) => void;
}

export function renderOTPInput(props: Readonly<RenderOTPInputProps>) {
	const {
		index,
		inputValue,
		inputId,
		className,
		disabled,
		required,
		hasError,
		ariaDescribedBy,
		length,
		inputRefs,
		onInput,
		onKeyDown,
		onPaste,
		onFocus,
	} = props;

	const refCallback = createInputRefCallback({ index, inputRefs });
	const attributes = getInputAttributes({
		index,
		inputId,
		inputValue,
		className,
		disabled,
		required,
		hasError,
		ariaDescribedBy,
		length,
	});
	const eventHandlers = getInputEventHandlers({ index, onInput, onKeyDown, onPaste, onFocus });

	return <input key={index} ref={refCallback} {...attributes} {...eventHandlers} />;
}
