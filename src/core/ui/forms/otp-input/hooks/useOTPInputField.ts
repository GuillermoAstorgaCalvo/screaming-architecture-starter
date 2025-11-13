import { createFocusHandlers } from '@core/ui/forms/otp-input/helpers/OTPInputFieldHandlers.focus';
import { createInputHandlers } from '@core/ui/forms/otp-input/helpers/OTPInputFieldHandlers.input';
import { createKeyboardHandlers } from '@core/ui/forms/otp-input/helpers/OTPInputFieldHandlers.keyboard';
import { createPasteHandlers } from '@core/ui/forms/otp-input/helpers/OTPInputFieldHandlers.paste';
import type { HandlerDependencies } from '@core/ui/forms/otp-input/helpers/OTPInputFieldHandlers.types';
import type { OTPInputFieldProps } from '@core/ui/forms/otp-input/types/OTPInputTypes';
import { type RefObject, useMemo } from 'react';

interface UtilityFunctionsOptions {
	length: number;
	value: string;
	onChange: (value: string) => void;
	inputRefs: RefObject<(HTMLInputElement | null)[]>;
}

function createUtilityFunctions(options: UtilityFunctionsOptions) {
	const { length, value, onChange, inputRefs } = options;

	const getValueArray = (): string[] => {
		const arr = Array.from({ length }, () => '');
		for (let i = 0; i < Math.min(value.length, length); i++) {
			arr[i] = value[i] ?? '';
		}
		return arr;
	};

	const updateValue = (newValueArray: string[]): void => {
		const newValue = newValueArray.join('');
		onChange(newValue);
	};

	const focusInput = (index: number): void => {
		const input = inputRefs.current[index];
		input?.focus();
		input?.select();
	};

	return { getValueArray, updateValue, focusInput };
}

export function useOTPInputFieldHandlers({
	length,
	value,
	onChange,
	onComplete,
	inputRefs,
}: Readonly<
	Pick<OTPInputFieldProps, 'length' | 'value' | 'onChange' | 'onComplete' | 'inputRefs'>
>) {
	const { getValueArray, updateValue, focusInput } = useMemo(
		() => createUtilityFunctions({ length, value, onChange, inputRefs }),
		[length, value, onChange, inputRefs]
	);

	const deps = useMemo<HandlerDependencies>(
		() => ({
			length,
			onComplete,
			getValueArray,
			updateValue,
			focusInput,
		}),
		[length, onComplete, getValueArray, updateValue, focusInput]
	);

	const handleInput = useMemo(() => createInputHandlers(deps), [deps]);
	const handleKeyDown = useMemo(() => createKeyboardHandlers(deps), [deps]);
	const handlePaste = useMemo(() => createPasteHandlers(deps), [deps]);
	const handleFocus = useMemo(() => createFocusHandlers(), []);

	return { handleInput, handleKeyDown, handlePaste, handleFocus };
}
