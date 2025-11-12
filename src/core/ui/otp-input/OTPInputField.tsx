import type { ClipboardEvent, FocusEvent, KeyboardEvent } from 'react';

import { renderOTPInput, type RenderOTPInputProps } from './OTPInputFieldHelpers';
import type { OTPInputFieldProps } from './OTPInputTypes';
import { useOTPInputFieldHandlers } from './useOTPInputField';
import { useOTPInputFieldEffects } from './useOTPInputFieldEffects';

interface RenderInputsParams {
	readonly length: number;
	readonly value: string;
	readonly getInputId: (index: number) => string;
	readonly className: string;
	readonly disabled: boolean | undefined;
	readonly required: boolean | undefined;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly inputRefs: OTPInputFieldProps['inputRefs'];
	readonly handleInput: (index: number, value: string) => void;
	readonly handleKeyDown: (index: number, e: KeyboardEvent<HTMLInputElement>) => void;
	readonly handlePaste: (e: ClipboardEvent<HTMLInputElement>) => void;
	readonly handleFocus: (index: number, e: FocusEvent<HTMLInputElement>) => void;
}

function createInputProps(
	index: number,
	params: RenderInputsParams
): Omit<RenderOTPInputProps, 'index'> {
	return {
		inputValue: params.value[index] ?? '',
		inputId: params.getInputId(index),
		className: params.className,
		disabled: params.disabled,
		required: params.required,
		hasError: params.hasError,
		ariaDescribedBy: params.ariaDescribedBy,
		length: params.length,
		inputRefs: params.inputRefs,
		onInput: params.handleInput,
		onKeyDown: params.handleKeyDown,
		onPaste: params.handlePaste,
		onFocus: params.handleFocus,
	};
}

function renderInputs(params: RenderInputsParams) {
	return Array.from({ length: params.length }, (_, index) =>
		renderOTPInput({ index, ...createInputProps(index, params) })
	);
}

function useOTPInputFieldSetup(props: Readonly<OTPInputFieldProps>) {
	const { id, length, value, onChange, onComplete, autoFocus, inputRefs } = props;

	useOTPInputFieldEffects({ length, autoFocus, inputRefs });

	const { handleInput, handleKeyDown, handlePaste, handleFocus } = useOTPInputFieldHandlers({
		length,
		value,
		onChange,
		onComplete,
		inputRefs,
	});

	const getInputId = (index: number): string => (id ? `${id}-${index}` : `otp-input-${index}`);

	return { getInputId, handleInput, handleKeyDown, handlePaste, handleFocus };
}

export function OTPInputField(props: Readonly<OTPInputFieldProps>) {
	const { className, hasError, ariaDescribedBy, disabled, required, length, value, inputRefs } =
		props;
	const { getInputId, handleInput, handleKeyDown, handlePaste, handleFocus } =
		useOTPInputFieldSetup(props);

	return (
		<div className="flex gap-2" aria-label="One-time password input">
			{renderInputs({
				length,
				value,
				getInputId,
				className,
				disabled,
				required,
				hasError,
				ariaDescribedBy,
				inputRefs,
				handleInput,
				handleKeyDown,
				handlePaste,
				handleFocus,
			})}
		</div>
	);
}
