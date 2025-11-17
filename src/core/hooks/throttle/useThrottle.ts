import { throttle, type ThrottledFunction } from '@core/utils/throttle/throttle';
import { validateWait } from '@core/utils/throttle/throttleHelpers';
import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import { unstable_batchedUpdates } from 'react-dom';

const NO_PENDING_VALUE = Symbol('useThrottle-no-pending');

type Listener = () => void;

type PendingValue<T> = T | typeof NO_PENDING_VALUE;

interface ThrottleStore<T> {
	value: T;
	pending: PendingValue<T>;
	timeoutId: ReturnType<typeof setTimeout> | null;
}

interface ThrottleStoreRef<T> {
	current: ThrottleStore<T>;
}

/**
 * Hook to throttle a value
 *
 * Returns a throttled version of the value that updates at most once
 * per specified delay period, regardless of how many times it changes.
 *
 * @example
 * ```tsx
 * const [scrollPosition, setScrollPosition] = useState(0);
 * const throttledPosition = useThrottle(scrollPosition, 100);
 *
 * useEffect(() => {
 *   updateUI(throttledPosition);
 * }, [throttledPosition]);
 * ```
 *
 * @param value - The value to throttle
 * @param delay - The delay in milliseconds between updates
 * @returns The throttled value
 */
export function useThrottle<T>(value: T, delay: number): T {
	validateWait(delay, 'useThrottle');

	const store = useThrottleStore(value, delay);

	return useSyncExternalStore(store.subscribe, store.getSnapshot);
}

/**
 * Hook to throttle a callback function
 *
 * Returns a memoized throttled version of the callback that
 * will only execute at most once per delay period.
 *
 * @example
 * ```tsx
 * const throttledScroll = useThrottledCallback((event: Event) => {
 *   handleScroll(event);
 * }, 100);
 *
 * // Call multiple times, but only executes once every 100ms
 * window.addEventListener('scroll', throttledScroll);
 * ```
 *
 * @template T - The function type
 * @param callback - The function to throttle
 * @param delay - The delay in milliseconds
 * @returns A throttled version of the callback with cancel and flush methods
 */
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
	callback: T,
	delay: number
): ThrottledFunction<T> {
	return useMemo(() => throttle(callback, delay), [callback, delay]);
}

function useThrottleStore<T>(value: T, delay: number) {
	const storeRef = useRef<ThrottleStore<T>>(createThrottleStore(value));
	const listenersRef = useRef(new Set<Listener>());

	const notify = useCallback(() => notifyListeners(listenersRef.current), []);

	useDelayChangeEffect(storeRef, delay);
	useThrottleValueEffect(storeRef, value, { delay, notify });
	useCleanupOnUnmount(storeRef);

	const subscribe = useCallback(
		(listener: Listener) => addListener(listenersRef.current, listener),
		[]
	);

	const getSnapshot = useCallback(() => storeRef.current.value, []);

	return { subscribe, getSnapshot };
}

function useDelayChangeEffect<T>(storeRef: ThrottleStoreRef<T>, delay: number) {
	useEffect(() => {
		const store = storeRef.current;
		store.pending = NO_PENDING_VALUE;
		cancelTimer(store);
	}, [delay, storeRef]);
}

function useThrottleValueEffect<T>(
	storeRef: ThrottleStoreRef<T>,
	value: T,
	options: { delay: number; notify: () => void }
) {
	const { delay, notify } = options;

	useEffect(() => {
		const store = storeRef.current;

		if (Object.is(store.value, value)) {
			clearMatchingPending(store, value);
			return;
		}

		if (hasPendingValue(store.pending) && Object.is(store.pending, value)) {
			return;
		}

		if (store.timeoutId === null) {
			applyValue(store, value, notify);
			startCooldown(store, delay, notify);
			return;
		}

		store.pending = value;
	}, [storeRef, value, delay, notify]);
}

function useCleanupOnUnmount<T>(storeRef: ThrottleStoreRef<T>) {
	useEffect(() => {
		const store = storeRef.current;
		return () => {
			cancelTimer(store);
		};
	}, [storeRef]);
}

function createThrottleStore<T>(value: T): ThrottleStore<T> {
	return {
		value,
		pending: NO_PENDING_VALUE,
		timeoutId: null,
	};
}

function notifyListeners(listeners: Set<Listener>) {
	unstable_batchedUpdates(() => {
		for (const listener of listeners) {
			listener();
		}
	});
}

function addListener(listeners: Set<Listener>, listener: Listener) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

function applyValue<T>(store: ThrottleStore<T>, value: T, notify: () => void) {
	if (Object.is(store.value, value)) {
		return;
	}

	store.value = value;
	notify();
}

function startCooldown<T>(store: ThrottleStore<T>, delay: number, notify: () => void) {
	if (store.timeoutId !== null) {
		return;
	}

	store.timeoutId = setTimeout(() => handleCooldown(store, delay, notify), delay);
}

function handleCooldown<T>(store: ThrottleStore<T>, delay: number, notify: () => void) {
	store.timeoutId = null;

	if (!hasPendingValue(store.pending)) {
		return;
	}

	const nextValue = store.pending;
	store.pending = NO_PENDING_VALUE;
	applyValue(store, nextValue, notify);
	startCooldown(store, delay, notify);
}

function cancelTimer(store: ThrottleStore<unknown>) {
	if (store.timeoutId === null) {
		return;
	}

	clearTimeout(store.timeoutId);
	store.timeoutId = null;
}

function clearMatchingPending<T>(store: ThrottleStore<T>, value: T) {
	if (!hasPendingValue(store.pending)) {
		return;
	}

	if (Object.is(store.pending, value)) {
		store.pending = NO_PENDING_VALUE;
	}
}

function hasPendingValue<T>(pending: PendingValue<T>): pending is T {
	return pending !== NO_PENDING_VALUE;
}
