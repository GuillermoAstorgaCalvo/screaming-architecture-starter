/**
 * Internal helper functions for debounce implementation
 */

/**
 * Internal state for debounced function
 */
export interface DebounceState<T extends (...args: unknown[]) => unknown> {
	timeoutId?: ReturnType<typeof setTimeout>;
	maxTimeoutId?: ReturnType<typeof setTimeout>;
	lastCallTime?: number;
	lastArgs?: Parameters<T>;
	result?: ReturnType<T>;
}

/**
 * Clear all timers in debounce state
 */
export function clearTimers(state: DebounceState<(...args: unknown[]) => unknown>): void {
	if (state.timeoutId !== undefined) {
		clearTimeout(state.timeoutId);
		delete state.timeoutId;
	}
	if (state.maxTimeoutId !== undefined) {
		clearTimeout(state.maxTimeoutId);
		delete state.maxTimeoutId;
	}
}

/**
 * Check if debounce should invoke based on timing constraints
 */
export function shouldInvoke(lastCallTime: number | undefined, maxWait?: number): boolean {
	return (
		lastCallTime === undefined || (maxWait !== undefined && Date.now() - lastCallTime >= maxWait)
	);
}

/**
 * Create a function that invokes the debounced function and cleans up state
 */
export function createInvokeFunc<T extends (...args: unknown[]) => unknown>(
	func: T,
	state: DebounceState<T>
): (args: Parameters<T>) => ReturnType<T> {
	return (args: Parameters<T>): ReturnType<T> => {
		const result = func(...args) as ReturnType<T>;
		delete state.lastCallTime;
		delete state.lastArgs;
		return result;
	};
}

/**
 * Create leading edge handler for debounce
 */
export function createLeadingEdge<T extends (...args: unknown[]) => unknown>(
	invokeFunc: (args: Parameters<T>) => ReturnType<T>,
	state: DebounceState<T>,
	leading: boolean
): (args: Parameters<T>) => void {
	return (args: Parameters<T>): void => {
		if (leading) {
			state.result = invokeFunc(args);
		}
		state.lastCallTime = Date.now();
		state.lastArgs = args;
	};
}

/**
 * Create trailing edge handler for debounce
 */
export function createTrailingEdge<T extends (...args: unknown[]) => unknown>(
	invokeFunc: (args: Parameters<T>) => ReturnType<T>,
	state: DebounceState<T>,
	trailing: boolean
): () => void {
	return (): void => {
		if (trailing && state.lastArgs !== undefined) {
			state.result = invokeFunc(state.lastArgs);
		}
		delete state.timeoutId;
	};
}

/**
 * Schedule maximum wait timeout for debounce
 */
export function scheduleMaxWait<T extends (...args: unknown[]) => unknown>(
	state: DebounceState<T>,
	invokeFunc: (args: Parameters<T>) => ReturnType<T>,
	maxWait: number
): void {
	// Clear existing maxWait timer before setting a new one to prevent multiple timers
	if (state.maxTimeoutId !== undefined) {
		clearTimeout(state.maxTimeoutId);
	}
	state.maxTimeoutId = setTimeout(() => {
		if (state.lastArgs !== undefined) invokeFunc(state.lastArgs);
		clearTimers(state);
	}, maxWait);
}

/**
 * Create cancel handler for debounced function
 */
export function createCancelHandler<T extends (...args: unknown[]) => unknown>(
	state: DebounceState<T>
): () => void {
	return (): void => {
		clearTimers(state);
		delete state.lastCallTime;
		delete state.lastArgs;
	};
}

/**
 * Create flush handler for debounced function
 */
export function createFlushHandler<T extends (...args: unknown[]) => unknown>(
	state: DebounceState<T>,
	invokeFunc: (args: Parameters<T>) => ReturnType<T>
): () => ReturnType<T> | undefined {
	return (): ReturnType<T> | undefined => {
		if (state.timeoutId !== undefined || state.lastArgs !== undefined) {
			clearTimers(state);
			if (state.lastArgs !== undefined) return invokeFunc(state.lastArgs);
		}
		return state.result;
	};
}
