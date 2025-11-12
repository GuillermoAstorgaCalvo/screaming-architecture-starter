/**
 * Zustand Store Utilities
 *
 * Provides utilities and helpers for creating Zustand stores following best practices.
 * These utilities help ensure consistent store patterns across domains.
 */

import type { StateCreator, StoreMutatorIdentifier } from 'zustand';

/**
 * Type helper for creating store slices with proper typing
 *
 * @template T - The state type
 * @template M - Middleware types (optional)
 */
export type StoreSlice<T, M extends [StoreMutatorIdentifier, unknown][] = []> = StateCreator<
	T,
	M,
	[],
	T
>;

/**
 * Type helper for store actions
 *
 * @template T - The state type
 */
export type StoreActions<T> = Record<string, (...args: unknown[]) => void | T | Promise<T>>;

/**
 * Type helper for store selectors
 *
 * @template T - The state type
 * @template R - The return type of the selector
 */
export type StoreSelector<T, R> = (state: T) => R;

/**
 * Creates a selector function for Zustand stores
 * Useful for creating reusable selectors that can be used across components
 *
 * @example
 * ```ts
 * const selectCount = createSelector((state: CounterState) => state.count);
 * const count = useCounterStore(selectCount);
 * ```
 *
 * @template T - The state type
 * @template R - The return type
 * @param selector - The selector function
 * @returns The selector function (for use with useStore hook)
 */
export function createSelector<T, R>(selector: StoreSelector<T, R>): StoreSelector<T, R> {
	return selector;
}

/**
 * Type helper for store with actions
 *
 * @template State - The state type
 * @template Actions - The actions type
 */
export type StoreWithActions<State, Actions> = State & Actions;
