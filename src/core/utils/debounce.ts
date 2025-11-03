/**
 * Debounce utility function
 *
 * Creates a debounced function that delays execution until after a specified
 * delay has passed since the last invocation. Useful for optimizing performance
 * by reducing the frequency of function calls.
 *
 * Framework Agnostic:
 * This utility is in `core/utils/` (not `core/lib/`) because it:
 * - Has no framework dependencies (works in any JavaScript context)
 * - Uses standard JavaScript APIs (setTimeout, clearTimeout, Date.now)
 * - Can be used in Node.js, browser, tests, or any JS runtime
 *
 * See: src/core/README.md for distinction between `lib/` and `utils/`
 *
 * Useful for:
 * - Search input handlers
 * - Resize/scroll event handlers
 * - API call optimization
 * - Form validation delays
 *
 * @example
 * ```ts
 * const debouncedSearch = debounce((query: string) => performSearch(query), 300);
 * debouncedSearch('a'); debouncedSearch('ab'); debouncedSearch('abc');
 * // Only executes once after 300ms of inactivity
 * ```
 */

import {
	createCancelHandler,
	createFlushHandler,
	createInvokeFunc,
	createLeadingEdge,
	createTrailingEdge,
	type DebounceState,
	scheduleMaxWait,
	shouldInvoke,
} from './debounceHelpers';

export interface DebounceOptions {
	/**
	 * Execute on leading edge of timeout
	 */
	leading?: boolean;
	/**
	 * Execute on trailing edge of timeout
	 */
	trailing?: boolean;
	/**
	 * Maximum delay before forced invocation
	 */
	maxWait?: number;
}

export interface DebouncedFunction<T extends (...args: unknown[]) => unknown> {
	(...args: Parameters<T>): ReturnType<T> | undefined;
	cancel: () => void;
	flush: () => ReturnType<T> | undefined;
}

/**
 * Options for debounced implementation
 */
interface DebouncedImplOptions<T extends (...args: unknown[]) => unknown> {
	state: DebounceState<T>;
	invokeFunc: (args: Parameters<T>) => ReturnType<T>;
	leadingEdge: (args: Parameters<T>) => void;
	trailingEdge: () => void;
	maxWait: number | undefined;
	wait: number;
}

/**
 * Create the debounced callback function
 */
function createDebouncedCallback<T extends (...args: unknown[]) => unknown>(
	options: DebouncedImplOptions<T>
): (...args: Parameters<T>) => ReturnType<T> | undefined {
	const { state, invokeFunc, leadingEdge, trailingEdge, maxWait, wait } = options;
	return (...args: Parameters<T>): ReturnType<T> | undefined => {
		const isInvoking = shouldInvoke(state.lastCallTime, maxWait);
		if (isInvoking) {
			if (maxWait !== undefined) scheduleMaxWait(state, invokeFunc, maxWait);
			leadingEdge(args);
		} else {
			state.lastArgs = args;
		}
		// Clear existing timeout before setting a new one to prevent multiple timers
		if (state.timeoutId !== undefined) {
			clearTimeout(state.timeoutId);
		}
		state.timeoutId = setTimeout(trailingEdge, wait);
		return state.result;
	};
}

/**
 * Create debounced function implementation with cancel and flush methods
 */
function createDebouncedImpl<T extends (...args: unknown[]) => unknown>(
	options: DebouncedImplOptions<T>
): DebouncedFunction<T> {
	const { state, invokeFunc } = options;
	const debounced = createDebouncedCallback(options) as DebouncedFunction<T>;
	debounced.cancel = createCancelHandler(state);
	debounced.flush = createFlushHandler(state, invokeFunc);
	return debounced;
}

/**
 * Validate debounce options
 */
function validateDebounceOptions(
	leading: boolean,
	trailing: boolean,
	maxWait: number | undefined
): void {
	if (!leading && !trailing && maxWait === undefined) {
		throw new TypeError('debounce: at least one of leading, trailing, or maxWait must be enabled');
	}
}

/**
 * Validate wait parameter for throttle/debounce functions
 */
function validateWait(wait: number, functionName: string): void {
	if (typeof wait !== 'number' || wait <= 0 || !Number.isFinite(wait)) {
		throw new TypeError(`${functionName}: wait must be a positive finite number`);
	}
}

/**
 * Validate maxWait parameter for debounce function
 */
function validateMaxWait(maxWait: number | undefined, wait: number): void {
	if (maxWait === undefined) return;
	if (typeof maxWait !== 'number' || maxWait <= 0 || !Number.isFinite(maxWait)) {
		throw new TypeError('debounce: maxWait must be a positive finite number');
	}
	if (maxWait < wait) {
		throw new TypeError('debounce: maxWait must be greater than or equal to wait');
	}
}

/**
 * Initialize debounce state and handlers
 */
function initializeDebounce<T extends (...args: unknown[]) => unknown>(
	func: T,
	leading: boolean,
	trailing: boolean
): {
	state: DebounceState<T>;
	invokeFunc: (args: Parameters<T>) => ReturnType<T>;
	leadingEdge: (args: Parameters<T>) => void;
	trailingEdge: () => void;
} {
	const state: DebounceState<T> = {};
	const invokeFunc = createInvokeFunc(func, state);
	const leadingEdge = createLeadingEdge(invokeFunc, state, leading);
	const trailingEdge = createTrailingEdge(invokeFunc, state, trailing);
	return { state, invokeFunc, leadingEdge, trailingEdge };
}

/**
 * Debounce a function
 *
 * @template T - The function type to debounce
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay execution (must be > 0)
 * @param options - Additional options for debounce behavior
 * @returns A debounced version of the function with cancel and flush methods
 * @throws {TypeError} If wait is not a positive number, maxWait is invalid, or if both leading and trailing are false without maxWait
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
	func: T,
	wait: number,
	options: DebounceOptions = {}
): DebouncedFunction<T> {
	validateWait(wait, 'debounce');
	const { leading = false, trailing = true, maxWait } = options;
	validateMaxWait(maxWait, wait);
	validateDebounceOptions(leading, trailing, maxWait);

	const { state, invokeFunc, leadingEdge, trailingEdge } = initializeDebounce(
		func,
		leading,
		trailing
	);
	return createDebouncedImpl({ state, invokeFunc, leadingEdge, trailingEdge, maxWait, wait });
}
