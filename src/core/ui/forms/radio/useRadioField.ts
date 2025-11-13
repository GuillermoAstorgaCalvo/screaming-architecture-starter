import { type RefObject, useEffect, useRef } from 'react';

export interface UseRadioFieldStateReturn {
	readonly inputRef: RefObject<HTMLInputElement | null>;
	readonly previousCheckedRef: RefObject<boolean>;
}

export function useRadioFieldState(
	checked: boolean | undefined,
	defaultChecked: boolean | undefined,
	disabled: boolean | undefined
): UseRadioFieldStateReturn {
	const inputRef = useRef<HTMLInputElement>(null);
	const previousCheckedRef = useRef<boolean>(checked ?? defaultChecked ?? false);

	useEffect(() => {
		if (inputRef.current && checked === undefined) {
			previousCheckedRef.current = inputRef.current.checked;
		}
	}, [checked]);

	useEffect(() => {
		if (disabled && inputRef.current && checked === undefined) {
			const currentChecked = inputRef.current.checked;
			if (currentChecked !== previousCheckedRef.current) {
				inputRef.current.checked = previousCheckedRef.current;
			}
		}
	}, [disabled, checked]);

	return { inputRef, previousCheckedRef };
}
