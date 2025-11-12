/**
 * Helper functions for throttle utility
 */

/**
 * Internal state for throttled function
 */
export interface ThrottleState<T extends (...args: unknown[]) => unknown> {
	timeoutId?: ReturnType<typeof setTimeout>;
	lastCallTime?: number;
	lastArgs?: Parameters<T>;
	result?: ReturnType<T>;
}

/**
 * Options for throttle operation functions
 */
export interface ThrottleOperationOptions<T extends (...args: unknown[]) => unknown> {
	func: T;
	state: ThrottleState<T>;
	leading?: boolean;
	trailing?: boolean;
	wait?: number;
	args?: Parameters<T>;
}

/**
 * Clear the timeout timer in throttle state
 */
export function clearTimer(state: ThrottleState<(...args: unknown[]) => unknown>): void {
	if (state.timeoutId !== undefined) {
		clearTimeout(state.timeoutId);
		delete state.timeoutId;
	}
}

export function invokeFunc<T extends (...args: unknown[]) => unknown>(
	func: T,
	state: ThrottleState<T>,
	args: Parameters<T>
): ReturnType<T> {
	const currentResult = func(...args) as ReturnType<T>;
	state.lastCallTime = Date.now();
	delete state.lastArgs;
	return currentResult;
}

export function handleLeadingEdge<T extends (...args: unknown[]) => unknown>(
	options: ThrottleOperationOptions<T>
): ReturnType<T> | undefined {
	const { func, state, args, leading } = options;
	if (!args || !leading) {
		return undefined;
	}
	state.result = invokeFunc(func, state, args);
	return state.result;
}

export function handleTrailingEdge<T extends (...args: unknown[]) => unknown>(
	options: ThrottleOperationOptions<T>
): void {
	const { func, state, trailing } = options;
	if (trailing && state.lastArgs !== undefined) {
		const args = state.lastArgs;
		delete state.lastArgs;
		state.result = invokeFunc(func, state, args);
	}
	clearTimer(state);
}

export function shouldInvoke(lastCallTime: number | undefined, wait: number): boolean {
	if (lastCallTime === undefined) {
		return true;
	}
	const timeSinceLastCall = Date.now() - lastCallTime;
	return timeSinceLastCall >= wait;
}

export function scheduleTrailingEdge<T extends (...args: unknown[]) => unknown>(
	options: ThrottleOperationOptions<T>
): void {
	const { func, state, wait, trailing } = options;
	if (wait === undefined || !trailing) {
		return;
	}
	// Only schedule if we have args to execute with (either from current call or previous throttled call)
	if (state.lastArgs === undefined) {
		return;
	}
	// Clear existing timeout to reschedule with latest args
	if (state.timeoutId !== undefined) {
		clearTimer(state);
	}
	const now = Date.now();
	const lastTime = state.lastCallTime ?? now;
	const remainingWait = Math.max(0, wait - (now - lastTime));
	state.timeoutId = setTimeout(() => {
		handleTrailingEdge({ func, state, trailing });
	}, remainingWait);
}

export function createCancelHandler<T extends (...args: unknown[]) => unknown>(
	state: ThrottleState<T>
): () => void {
	return () => {
		clearTimer(state);
		delete state.lastCallTime;
		delete state.lastArgs;
	};
}

export function createFlushHandler<T extends (...args: unknown[]) => unknown>(
	func: T,
	state: ThrottleState<T>
): () => ReturnType<T> | undefined {
	return (): ReturnType<T> | undefined => {
		if (state.timeoutId !== undefined) {
			clearTimer(state);
		}
		if (state.lastArgs !== undefined) {
			const args = state.lastArgs;
			delete state.lastArgs;
			const result = invokeFunc(func, state, args);
			state.result = result;
			return result;
		}
		return state.result;
	};
}

export function validateWait(wait: number, functionName: string): void {
	if (typeof wait !== 'number' || wait <= 0 || !Number.isFinite(wait)) {
		throw new TypeError(`${functionName}: wait must be a positive finite number`);
	}
}

export function validateThrottleOptions(leading: boolean, trailing: boolean): void {
	if (!leading && !trailing) {
		throw new TypeError('throttle: at least one of leading or trailing must be true');
	}
}
