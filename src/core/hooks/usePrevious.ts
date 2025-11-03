import { useEffect, useRef, useState } from 'react';

/**
 * Hook that returns the previous value of a state or prop
 *
 * This hook is useful when you need to compare the current value
 * with its previous value, or when implementing undo/redo functionality.
 *
 * @example
 * ```tsx
 * const [count, setCount] = useState(0);
 * const previousCount = usePrevious(count);
 *
 * useEffect(() => {
 *   if (count !== previousCount) {
 *     console.log(`Count changed from ${previousCount} to ${count}`);
 *   }
 * }, [count, previousCount]);
 * ```
 *
 * @example
 * ```tsx
 * // With conditional updates
 * const [user, setUser] = useState<User | null>(null);
 * const previousUser = usePrevious(user);
 *
 * useEffect(() => {
 *   if (user && previousUser && user.id !== previousUser.id) {
 *     console.log('User changed');
 *   }
 * }, [user, previousUser]);
 * ```
 *
 * @template T - The type of the value
 * @param value - The current value to track
 * @returns The previous value, or undefined on the first render
 */
export function usePrevious<T>(value: T): T | undefined {
	const [previous, setPrevious] = useState<T | undefined>(undefined);
	const ref = useRef(value);

	useEffect(() => {
		if (ref.current !== value) {
			setPrevious(ref.current);
			ref.current = value;
		}
	}, [value]);

	return previous;
}
