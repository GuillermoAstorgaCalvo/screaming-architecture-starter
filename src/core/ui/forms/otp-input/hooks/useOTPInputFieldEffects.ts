import { type RefObject, useEffect, useState } from 'react';

const FOCUS_POLL_INTERVAL_MS = 10;

function useRefsLengthSync(
	length: number,
	inputRefs: RefObject<(HTMLInputElement | null)[] | null>
) {
	const [refsLength, setRefsLength] = useState(() => inputRefs.current?.length ?? 0);

	useEffect(() => {
		const refs = inputRefs.current;
		if (!refs) {
			return;
		}
		if (refs.length !== length && refs.length > length) {
			refs.splice(length);
		}
		// Update refs length state to trigger re-render when refs change
		// Use a small delay to allow refs to be populated
		const timer = setTimeout(() => {
			setRefsLength(refs.length);
		}, 0);
		return () => clearTimeout(timer);
	}, [length, inputRefs]);

	return refsLength;
}

function useAutoFocus(
	autoFocus: boolean | undefined,
	inputRefs: RefObject<(HTMLInputElement | null)[] | null>,
	refsLength: number
) {
	useEffect(() => {
		if (!autoFocus) {
			return undefined;
		}

		let isMounted = true;
		let intervalId: ReturnType<typeof setInterval> | undefined;

		const attemptFocus = (): void => {
			if (!isMounted) {
				return;
			}
			const refs = inputRefs.current;
			if (!refs) {
				return;
			}
			const [firstInput] = refs;
			if (firstInput) {
				firstInput.focus();
				// Clear interval once focus succeeds
				if (intervalId) {
					clearInterval(intervalId);
					intervalId = undefined;
				}
			}
		};

		// Try after a short delay to allow cleanup to prevent it
		const timeoutId = setTimeout(() => {
			attemptFocus();
			// If not available, poll until refs are populated
			intervalId = setInterval(() => {
				attemptFocus();
			}, FOCUS_POLL_INTERVAL_MS);
		}, 0);

		return () => {
			isMounted = false;
			clearTimeout(timeoutId);
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [autoFocus, inputRefs, refsLength]);
}

export function useOTPInputFieldEffects({
	length,
	autoFocus,
	inputRefs,
}: Readonly<{
	length: number;
	autoFocus?: boolean | undefined;
	inputRefs: RefObject<(HTMLInputElement | null)[] | null>;
}>) {
	const refsLength = useRefsLengthSync(length, inputRefs);
	useAutoFocus(autoFocus, inputRefs, refsLength);
}
