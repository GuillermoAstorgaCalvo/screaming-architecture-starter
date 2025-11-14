import { useCallback, useState } from 'react';

/**
 * Hook for managing a boolean toggle state
 *
 * Provides a convenient way to manage boolean state with toggle,
 * setTrue, and setFalse functions.
 *
 * @example
 * ```tsx
 * const [isOpen, toggle, open, close] = useToggle(false);
 *
 * // Toggle the value
 * <button onClick={toggle}>Toggle</button>
 *
 * // Set to true
 * <button onClick={open}>Open</button>
 *
 * // Set to false
 * <button onClick={close}>Close</button>
 * ```
 *
 * @param initialValue - The initial boolean value (default: false)
 * @returns A tuple of [value, toggle, setTrue, setFalse]
 */
export function useToggle(initialValue = false): [boolean, () => void, () => void, () => void] {
	const [value, setValue] = useState(initialValue);

	const toggle = useCallback((): void => {
		setValue(prev => !prev);
	}, []);

	const setTrue = useCallback((): void => {
		setValue(true);
	}, []);

	const setFalse = useCallback((): void => {
		setValue(false);
	}, []);

	return [value, toggle, setTrue, setFalse];
}
