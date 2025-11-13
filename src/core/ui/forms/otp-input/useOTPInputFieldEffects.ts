import { type RefObject, useEffect } from 'react';

export function useOTPInputFieldEffects({
	length,
	autoFocus,
	inputRefs,
}: Readonly<{
	length: number;
	autoFocus?: boolean | undefined;
	inputRefs: RefObject<(HTMLInputElement | null)[]>;
}>) {
	useEffect(() => {
		const refs = inputRefs.current;
		if (refs.length !== length && refs.length > length) {
			refs.splice(length);
		}
	}, [length, inputRefs]);

	useEffect(() => {
		if (autoFocus) {
			const [firstInput] = inputRefs.current;
			if (firstInput) {
				const timer = setTimeout(() => firstInput.focus(), 0);
				return () => clearTimeout(timer);
			}
		}
		return undefined;
	}, [autoFocus, inputRefs]);
}
