/**
 * Throttle utility function - Limits function invocation rate
 * Framework agnostic utility for event handlers, rate limiting, and performance optimization
 * @example throttle((data) => processData(data), 100)
 */

export interface ThrottleOptions {
	/**
	 * Whether to execute the function on the leading edge of the timeout
	 */
	leading?: boolean;
	/**
	 * Whether to execute the function on the trailing edge of the timeout
	 */
	trailing?: boolean;
}

export interface ThrottledFunction<T extends (...args: unknown[]) => unknown> {
	(...args: Parameters<T>): ReturnType<T> | undefined;
	cancel: () => void;
	flush: () => ReturnType<T> | undefined;
}

interface ThrottleState<T extends (...args: unknown[]) => unknown> {
	timeoutId?: ReturnType<typeof setTimeout>;
	lastCallTime?: number;
	lastArgs?: Parameters<T>;
	result?: ReturnType<T>;
}

interface ThrottleOperationOptions<T extends (...args: unknown[]) => unknown> {
	func: T;
	state: ThrottleState<T>;
	leading?: boolean;
	trailing?: boolean;
	wait?: number;
	args?: Parameters<T>;
}
function clearTimer(state: ThrottleState<(...args: unknown[]) => unknown>): void {
	if (state.timeoutId !== undefined) {
		clearTimeout(state.timeoutId);
		delete state.timeoutId;
	}
}

function invokeFunc<T extends (...args: unknown[]) => unknown>(
	func: T,
	state: ThrottleState<T>,
	args: Parameters<T>
): ReturnType<T> {
	const currentResult = func(...args) as ReturnType<T>;
	state.lastCallTime = Date.now();
	delete state.lastArgs;
	return currentResult;
}

function handleLeadingEdge<T extends (...args: unknown[]) => unknown>(
	options: ThrottleOperationOptions<T>
): ReturnType<T> | undefined {
	const { func, state, args, leading } = options;
	if (!args || !leading) {
		return undefined;
	}
	state.result = invokeFunc(func, state, args);
	return state.result;
}

function handleTrailingEdge<T extends (...args: unknown[]) => unknown>(
	options: ThrottleOperationOptions<T>
): void {
	const { func, state, trailing } = options;
	if (trailing && state.lastArgs !== undefined) {
		state.result = invokeFunc(func, state, state.lastArgs);
	}
	delete state.timeoutId;
}

function shouldInvoke(lastCallTime: number | undefined, wait: number): boolean {
	if (lastCallTime === undefined) {
		return true;
	}
	const timeSinceLastCall = Date.now() - lastCallTime;
	return timeSinceLastCall >= wait;
}
function scheduleTrailingEdge<T extends (...args: unknown[]) => unknown>(
	options: ThrottleOperationOptions<T>
): void {
	const { func, state, wait, trailing } = options;
	// wait is validated at entry, but check for undefined for type safety
	if (wait === undefined || state.timeoutId !== undefined || !trailing) {
		return;
	}
	const now = Date.now();
	const lastTime = state.lastCallTime ?? now;
	const remainingWait = Math.max(0, wait - (now - lastTime));
	state.timeoutId = setTimeout(() => {
		handleTrailingEdge({ func, state, trailing });
	}, remainingWait);
}
function createThrottledFunction<T extends (...args: unknown[]) => unknown>(
	options: ThrottleOperationOptions<T> & { wait: number; leading: boolean; trailing: boolean }
): (...args: Parameters<T>) => ReturnType<T> | undefined {
	const { func, state, wait, leading, trailing } = options;
	return (...args: Parameters<T>): ReturnType<T> | undefined => {
		const now = Date.now();
		const isInvoking = shouldInvoke(state.lastCallTime, wait);
		if (isInvoking) {
			state.lastCallTime ??= now;
			return handleLeadingEdge({ func, state, args, leading });
		}
		scheduleTrailingEdge({ func, state, wait, trailing });
		state.lastArgs = args;
		return state.result;
	};
}
function createCancelHandler<T extends (...args: unknown[]) => unknown>(
	state: ThrottleState<T>
): () => void {
	return () => {
		clearTimer(state);
		delete state.lastCallTime;
		delete state.lastArgs;
	};
}
function createFlushHandler<T extends (...args: unknown[]) => unknown>(
	func: T,
	state: ThrottleState<T>
): () => ReturnType<T> | undefined {
	return (): ReturnType<T> | undefined => {
		if (state.timeoutId !== undefined || state.lastArgs !== undefined) {
			clearTimer(state);
			if (state.lastArgs !== undefined) {
				return invokeFunc(func, state, state.lastArgs);
			}
		}
		return state.result;
	};
}
function validateWait(wait: number, functionName: string): void {
	if (typeof wait !== 'number' || wait <= 0 || !Number.isFinite(wait)) {
		throw new TypeError(`${functionName}: wait must be a positive finite number`);
	}
}
function validateThrottleOptions(leading: boolean, trailing: boolean): void {
	if (!leading && !trailing) {
		throw new TypeError('throttle: at least one of leading or trailing must be true');
	}
}
function attachThrottleMethods<T extends (...args: unknown[]) => unknown>(
	throttled: (...args: Parameters<T>) => ReturnType<T> | undefined,
	func: T,
	state: ThrottleState<T>
): ThrottledFunction<T> {
	const result = throttled as ThrottledFunction<T>;
	result.cancel = createCancelHandler(state);
	result.flush = createFlushHandler(func, state);
	return result;
}

/**
 * Throttle a function
 * @template T - The function type to throttle
 * @param func - The function to throttle
 * @param wait - The number of milliseconds to throttle invocations to (must be > 0)
 * @param options - Additional options for throttle behavior
 * @returns A throttled version of the function with cancel and flush methods
 * @throws {TypeError} If wait is not a positive number, or if both leading and trailing are false
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
	func: T,
	wait: number,
	options: ThrottleOptions = {}
): ThrottledFunction<T> {
	validateWait(wait, 'throttle');
	const { leading = true, trailing = true } = options;
	validateThrottleOptions(leading, trailing);
	const state: ThrottleState<T> = {};
	const throttled = createThrottledFunction({ func, state, wait, leading, trailing });
	return attachThrottleMethods(throttled, func, state);
}
