import { debounce, type DebouncedFunction } from '@core/utils/debounce';
import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Hook to debounce a value
 *
 * Returns a debounced version of the value that only updates after
 * the specified delay has passed since the last change.
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 300);
 *
 * useEffect(() => {
 *   if (debouncedSearch) {
 *     performSearch(debouncedSearch);
 *   }
 * }, [debouncedSearch]);
 * ```
 *
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);
	const debouncedRef = useRef<DebouncedFunction<(newValue: unknown) => void> | null>(null);

	useEffect(() => {
		// Cancel previous debounced function if it exists
		if (debouncedRef.current) {
			debouncedRef.current.cancel();
		}

		// Create new debounced function
		const debounced = debounce((newValue: unknown) => {
			setDebouncedValue(newValue as T);
		}, delay);

		debouncedRef.current = debounced;
		debounced(value);

		return () => {
			debounced.cancel();
			debouncedRef.current = null;
		};
	}, [value, delay]);

	return debouncedValue;
}

/**
 * Hook to debounce a callback function
 *
 * Returns a memoized debounced version of the callback that
 * will only execute after the delay has passed since the last call.
 *
 * @example
 * ```tsx
 * const debouncedSave = useDebouncedCallback((data: FormData) => {
 *   saveToServer(data);
 * }, 500);
 *
 * // Call multiple times, but only last call executes after 500ms
 * debouncedSave(formData1);
 * debouncedSave(formData2);
 * debouncedSave(formData3); // Only this executes
 * ```
 *
 * @template T - The function type
 * @param callback - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns A debounced version of the callback with cancel and flush methods
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
	callback: T,
	delay: number
): DebouncedFunction<T> {
	const debouncedRef = useRef<DebouncedFunction<T> | null>(null);

	const debounced = useMemo(() => debounce(callback, delay), [callback, delay]);

	useEffect(() => {
		debouncedRef.current = debounced;
		return () => {
			debounced.cancel();
			debouncedRef.current = null;
		};
	}, [debounced]);

	return debounced;
}
