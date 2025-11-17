import { useEffect, useRef, useState } from 'react';

/**
 * Hook that returns the previous value of a state or prop
 *
 * This hook is useful when you need to compare the current value
 * with its previous value, or when implementing undo/redo functionality.
 *
 * Uses an effect-driven update loop backed by refs to avoid touching mutable
 * values during render while still preventing unnecessary re-renders.
 *
 * @example
 * ```tsx
 * const [count, setCount] = useState(0);
 * const previousCount = usePrevious(count);
 *
 * useEffect(() => {
 *   if (previousCount !== undefined && count !== previousCount) {
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
	const latestValueRef = useRef(value);

	useEffect(() => {
		if (Object.is(latestValueRef.current, value)) {
			return;
		}

		setPrevious(() => latestValueRef.current);
		latestValueRef.current = value;
	}, [value]);

	return previous;
}
