import { type RefObject, useMemo } from 'react';

import { createFocusHandlers } from './OTPInputFieldHandlers.focus';
import { createInputHandlers } from './OTPInputFieldHandlers.input';
import { createKeyboardHandlers } from './OTPInputFieldHandlers.keyboard';
import { createPasteHandlers } from './OTPInputFieldHandlers.paste';
import type { HandlerDependencies } from './OTPInputFieldHandlers.types';
import type { OTPInputFieldProps } from './OTPInputTypes';

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
