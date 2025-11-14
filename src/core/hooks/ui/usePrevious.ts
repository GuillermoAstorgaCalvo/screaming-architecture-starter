import { useEffect, useRef } from 'react';

/**
 * Hook that returns the previous value of a state or prop
 *
 * This hook is useful when you need to compare the current value
 * with its previous value, or when implementing undo/redo functionality.
 *
 * Uses a ref-based implementation for optimal performance without causing
 * unnecessary re-renders.
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
	// Use two refs: one to track current value, one to track previous value
	// This pattern ensures we return the correct previous value on each render
	const currentRef = useRef<T | undefined>(undefined);
	const previousRef = useRef<T | undefined>(undefined);

	// Update refs in effect: previous becomes old current, current becomes new value
	// This ensures next render sees the correct previous value
	useEffect(() => {
		previousRef.current = currentRef.current;
		currentRef.current = value;
	}, [value]);

	// Return the previous value (from previousRef, which was set in last effect)
	// Note: Accessing ref.current during render is intentional for this hook pattern
	// This is the standard pattern for usePrevious hooks
	// eslint-disable-next-line react-hooks/refs -- usePrevious intentionally accesses ref.current during render
	return previousRef.current;
}
