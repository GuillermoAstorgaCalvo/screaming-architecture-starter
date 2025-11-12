/**
 * Throttle utility function
 *
 * Creates a throttled function that limits the rate at which a function can be invoked.
 * Ensures the function is called at most once per specified time period. Useful for
 * optimizing performance by controlling the frequency of function calls.
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
 * - Scroll/resize event handlers
 * - Mouse move handlers
 * - API rate limiting
 * - Input validation throttling
 *
 * @example
 * ```ts
 * const throttledScroll = throttle(() => handleScroll(), 100);
 * window.addEventListener('scroll', throttledScroll);
 * // Function executes at most once every 100ms during scrolling
 * ```
 */

import {
	clearTimer,
	createCancelHandler,
	createFlushHandler,
	handleLeadingEdge,
	handleTrailingEdge,
	scheduleTrailingEdge,
	shouldInvoke,
	type ThrottleState,
	validateThrottleOptions,
	validateWait,
} from './throttleHelpers';

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

interface CreateThrottledFunctionOptions<T extends (...args: unknown[]) => unknown> {
	func: T;
	state: ThrottleState<T>;
	wait: number;
	leading: boolean;
	trailing: boolean;
	skipTrailingSchedule?: boolean;
}

function startNewThrottleCycle<T extends (...args: unknown[]) => unknown>(
	options: CreateThrottledFunctionOptions<T>,
	args: Parameters<T>
): ReturnType<T> | undefined {
	const { func, state, wait, leading, trailing, skipTrailingSchedule } = options;
	state.lastCallTime = Date.now();
	const leadingResult = handleLeadingEdge({ func, state, args, leading });
	if (leadingResult !== undefined) {
		state.result = leadingResult;
	}
	if (trailing) {
		state.lastArgs = args;
	}
	if (!skipTrailingSchedule) {
		scheduleTrailingEdge({ func, state, wait, trailing });
	}
	return state.result;
}

function shouldExecutePendingTrailing<T extends (...args: unknown[]) => unknown>(
	state: ThrottleState<T>,
	wait: number,
	trailing: boolean
): boolean {
	if (!trailing || state.timeoutId === undefined || state.lastArgs === undefined) {
		return false;
	}
	const now = Date.now();
	const lastTime = state.lastCallTime ?? now;
	const remainingWait = Math.max(0, wait - (now - lastTime));
	return remainingWait <= 0;
}

function handleInvokingCase<T extends (...args: unknown[]) => unknown>(
	options: CreateThrottledFunctionOptions<T>,
	args: Parameters<T>
): ReturnType<T> | undefined {
	const { func, state, wait, trailing } = options;
	const shouldExecute = shouldExecutePendingTrailing(state, wait, trailing);

	if (shouldExecute) {
		// If we can start a new cycle (shouldInvoke is true), execute the pending trailing edge
		// and start a new cycle for the current call, but skip leading edge since we just executed trailing.
		clearTimer(state);
		if (trailing && state.lastArgs !== undefined) {
			// Execute the pending trailing edge with previous args
			handleTrailingEdge({ func, state, trailing });
			// Ensure timer is cleared after execution
			clearTimer(state);
		}
		// Start a new cycle for the current call, but skip leading edge and trailing schedule
		// since we just executed trailing. The trailing edge execution already cleared lastArgs.
		// We update lastCallTime and set lastArgs for potential future calls, but don't schedule trailing.
		state.lastCallTime = Date.now();
		if (trailing) {
			state.lastArgs = args;
		}
		// Don't schedule trailing edge since we just executed one
		// Return the result from the trailing edge execution
		return state.result;
	}

	return startNewThrottleCycle(options, args);
}

function handleThrottledCase<T extends (...args: unknown[]) => unknown>(
	options: CreateThrottledFunctionOptions<T>,
	args: Parameters<T>
): ReturnType<T> | undefined {
	const { func, state, wait, trailing } = options;
	state.lastArgs = args;
	scheduleTrailingEdge({ func, state, wait, trailing });
	return state.result;
}

function createThrottledFunction<T extends (...args: unknown[]) => unknown>(
	options: CreateThrottledFunctionOptions<T>
): (...args: Parameters<T>) => ReturnType<T> | undefined {
	const { state, wait } = options;
	return (...args: Parameters<T>): ReturnType<T> | undefined => {
		const isInvoking = shouldInvoke(state.lastCallTime, wait);
		return isInvoking ? handleInvokingCase(options, args) : handleThrottledCase(options, args);
	};
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
 *
 * Creates a throttled version of the function that will only execute at most once
 * per `wait` milliseconds. The throttled function has `cancel()` and `flush()` methods
 * for additional control.
 *
 * @template T - The function type to throttle
 * @param func - The function to throttle
 * @param wait - The number of milliseconds to throttle invocations to (must be > 0)
 * @param options - Additional options for throttle behavior
 * @param options.leading - Whether to execute on the leading edge of the timeout (default: true)
 * @param options.trailing - Whether to execute on the trailing edge of the timeout (default: true)
 * @returns A throttled version of the function with cancel and flush methods
 * @throws {TypeError} If wait is not a positive number, or if both leading and trailing are false
 *
 * @example
 * ```ts
 * // Basic throttling
 * const throttled = throttle(() => console.log('throttled'), 100);
 * throttled(); throttled(); throttled();
 * // Executes immediately (leading), then after 100ms (trailing)
 *
 * // Cancel pending execution
 * const throttled = throttle(() => console.log('throttled'), 100);
 * throttled();
 * throttled.cancel(); // Cancels pending trailing execution
 *
 * // Flush pending execution
 * const throttled = throttle(() => console.log('throttled'), 100);
 * throttled();
 * throttled.flush(); // Immediately executes pending trailing execution
 * ```
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
	return attachThrottleMethods<T>(throttled, func, state);
}
