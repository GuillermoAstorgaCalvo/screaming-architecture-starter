/**
 * Landing Domain Store
 *
 * Example Zustand store following best practices:
 * - Domain-scoped state management
 * - Type-safe with TypeScript
 * - Uses selectors for performance optimization
 * - Minimal state, derived values when possible
 *
 * @example
 * ```tsx
 * // In a component
 * import { useLandingStore } from '@domains/landing/store/landingStore';
 *
 * function MyComponent() {
 *   // Using selector for optimal re-renders
 *   const count = useLandingStore((state) => state.count);
 *   const increment = useLandingStore((state) => state.increment);
 *
 *   return (
 *     <button onClick={increment}>Count: {count}</button>
 *   );
 * }
 * ```
 */

import type { StoreSelector } from '@core/lib/storeUtils';
import { create } from 'zustand';

/**
 * Landing store state interface
 */
export interface LandingState {
	/** Counter value */
	count: number;
	/** Loading state */
	isLoading: boolean;
	/** Error message */
	error: string | null;
}

/**
 * Landing store actions interface
 */
export interface LandingActions {
	/** Increment the counter */
	increment: () => void;
	/** Decrement the counter */
	decrement: () => void;
	/** Reset the counter */
	reset: () => void;
	/** Set loading state */
	setLoading: (isLoading: boolean) => void;
	/** Set error message */
	setError: (error: string | null) => void;
}

/**
 * Combined landing store type
 */
export type LandingStore = LandingState & LandingActions;

/**
 * Landing store initial state
 */
const initialState: LandingState = {
	count: 0,
	isLoading: false,
	error: null,
};

/**
 * Landing domain Zustand store
 *
 * Uses Zustand's create function with proper TypeScript typing.
 * State updates are immutable by default in Zustand.
 */
export const useLandingStore = create<LandingStore>(set => ({
	...initialState,

	increment: () =>
		set(state => ({
			...state,
			count: state.count + 1,
		})),

	decrement: () =>
		set(state => ({
			...state,
			count: state.count - 1,
		})),

	reset: () =>
		set(() => ({
			...initialState,
		})),

	setLoading: (isLoading: boolean) =>
		set(state => ({
			...state,
			isLoading,
		})),

	setError: (error: string | null) =>
		set(state => ({
			...state,
			error,
		})),
}));

/**
 * Pre-defined selectors for common state access patterns
 * Using selectors prevents unnecessary re-renders
 */
export const landingSelectors = {
	/** Select only the count value */
	count: ((state: LandingStore) => state.count) satisfies StoreSelector<LandingStore, number>,

	/** Select only the loading state */
	isLoading: ((state: LandingStore) => state.isLoading) satisfies StoreSelector<
		LandingStore,
		boolean
	>,

	/** Select only the error message */
	error: ((state: LandingStore) => state.error) satisfies StoreSelector<
		LandingStore,
		string | null
	>,

	/** Select count and increment action together */
	countWithIncrement: ((state: LandingStore) => ({
		count: state.count,
		increment: state.increment,
	})) satisfies StoreSelector<LandingStore, { count: number; increment: () => void }>,
} as const;
